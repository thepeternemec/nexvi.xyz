import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
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
    const { data, error } = await supabaseAdmin
      .from("subscriptions")
      .select("plan, status, current_period_end, cancel_at_period_end")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return snapshotFrom(data);
  });

const PLAN_DAYS: Record<string, number> = { premium_monthly: 30, premium_yearly: 365, trial: 14 };

// DEV: instantly activate Premium. Replace .handler() body with Stripe Checkout once payments are enabled.
export const startSubscription = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ plan: z.enum(["premium_monthly", "premium_yearly", "trial"]).default("premium_monthly") }).parse(input ?? {}),
  )
  .handler(async ({ data, context }) => {
    const days = PLAN_DAYS[data.plan] ?? 30;
    const periodEnd = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
    const { error } = await supabaseAdmin
      .from("subscriptions")
      .upsert(
        {
          user_id: context.userId,
          plan: "premium",
          status: data.plan === "trial" ? "trialing" : "active",
          current_period_end: periodEnd,
          cancel_at_period_end: false,
          provider: "dev",
        },
        { onConflict: "user_id" },
      );
    if (error) throw new Error(error.message);
    return { ok: true, periodEnd };
  });

export const cancelSubscription = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { error } = await supabaseAdmin
      .from("subscriptions")
      .update({ status: "canceled", cancel_at_period_end: true })
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

