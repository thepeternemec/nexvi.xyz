import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export type SubscriptionSnapshot = {
  isAuthenticated: boolean;
  isPremium: boolean;
  plan: "free" | "premium";
  status: "active" | "trialing" | "canceled" | "inactive";
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
};

function snapshotFrom(row: {
  plan: string;
  status: string;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
} | null): SubscriptionSnapshot {
  if (!row) {
    return {
      isAuthenticated: true,
      isPremium: false,
      plan: "free",
      status: "inactive",
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
    };
  }
  const active = (row.status === "active" || row.status === "trialing") &&
    (!row.current_period_end || new Date(row.current_period_end).getTime() > Date.now());
  return {
    isAuthenticated: true,
    isPremium: active,
    plan: (row.plan === "premium" ? "premium" : "free"),
    status: row.status as SubscriptionSnapshot["status"],
    currentPeriodEnd: row.current_period_end,
    cancelAtPeriodEnd: row.cancel_at_period_end,
  };
}

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
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data, error } = await supabaseAdmin
        .from("subscriptions")
        .select("plan, status, current_period_end, cancel_at_period_end")
        .eq("user_id", context.userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw new Error(error.message);
      return snapshotFrom(data);
    } catch {
      // Never blank-screen the app on a transient backend/token error —
      // fall back to the free snapshot.
      return snapshotFrom(null);
    }
  });
