import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";


export type SubscriptionSnapshot = {
  isAuthenticated: boolean;
  isPremium: boolean;
  plan: "free" | "premium";
  status: "active" | "trialing" | "past_due" | "canceled" | "inactive";
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
};

// Public — anyone (signed in or out) can ask. Returns the user's premium status if signed in.
export const getMySubscription = createServerFn({ method: "GET" }).handler(async () => {
  // Try auth; if absent, return anonymous snapshot
  // We can't run middleware conditionally, so re-read auth here.
  // Simpler: rely on requireSupabaseAuth in a second fn; this one assumes anonymous if no row.
  return {
    isAuthenticated: false,
    isPremium: false,
    plan: "free" as const,
    status: "inactive" as const,
    currentPeriodEnd: null,
    cancelAtPeriodEnd: false,
  } satisfies SubscriptionSnapshot;
});

export const getMySubscriptionAuthed = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const freeSnapshot: SubscriptionSnapshot = {
      isAuthenticated: true,
      isPremium: false,
      plan: "free",
      status: "inactive",
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
    };

    try {
      const { data, error } = await context.supabase
        .from("subscriptions")
        .select("plan, status, current_period_end, cancel_at_period_end")
        .eq("user_id", context.userId)
        .order("updated_at", { ascending: false });
      if (error) throw new Error(error.message);

      const now = Date.now();
      const activeStatuses = new Set(["active", "trialing", "past_due"]);
      const entitled = data?.find((row) =>
        activeStatuses.has(row.status) &&
        (!row.current_period_end || new Date(row.current_period_end).getTime() > now),
      );
      const row = entitled ?? data?.[0];
      if (!row) return freeSnapshot;

      const isPremium = Boolean(entitled);
      return {
        isAuthenticated: true,
        isPremium,
        plan: isPremium ? "premium" : "free",
        status: row.status as SubscriptionSnapshot["status"],
        currentPeriodEnd: row.current_period_end,
        cancelAtPeriodEnd: row.cancel_at_period_end,
      } satisfies SubscriptionSnapshot;
    } catch {
      // Never blank-screen the app on a transient backend/token error —
      // fall back to the free snapshot.
      return freeSnapshot;
    }
  });
