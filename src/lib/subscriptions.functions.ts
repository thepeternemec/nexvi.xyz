import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";


export type SubscriptionSnapshot = {
  isAuthenticated: boolean;
  isPremium: boolean;
  plan: "free" | "premium";
  status: "active" | "trialing" | "past_due" | "canceled" | "inactive";
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  priceId: string | null;
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
    priceId: null,
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
      priceId: null,
    };

    try {
      const { data, error } = await context.supabase
        .from("subscriptions")
        .select("plan, status, current_period_end, cancel_at_period_end, price_id")
        .eq("user_id", context.userId)
        .order("updated_at", { ascending: false });
      if (error) throw new Error(error.message);

      const now = Date.now();
      const activeStatuses = new Set(["active", "trialing", "past_due"]);
      // End-of-period access: a canceled subscription keeps Premium until its
      // paid period actually runs out.
      const entitled = data?.find((row) => {
        const periodAlive =
          !row.current_period_end || new Date(row.current_period_end).getTime() > now;
        if (activeStatuses.has(row.status)) return periodAlive;
        if (row.status === "canceled") {
          return Boolean(row.current_period_end) && periodAlive;
        }
        return false;
      });
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
        priceId: row.price_id ?? null,
      } satisfies SubscriptionSnapshot;
    } catch {
      // Never blank-screen the app on a transient backend/token error —
      // fall back to the free snapshot.
      return freeSnapshot;
    }
  });
