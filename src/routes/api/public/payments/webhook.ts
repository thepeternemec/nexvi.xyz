import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { type StripeEnv, verifyWebhook } from "@/lib/stripe.server";
import { enqueueTransactionalEmail } from "@/lib/email/enqueue.server";

let _supabase: ReturnType<typeof createClient> | null = null;
function getSupabase(): any {
  if (!_supabase) {
    _supabase = createClient(
      process.env["SUPABASE_URL"]!,
      process.env["SUPABASE_SERVICE_ROLE_KEY"]!,
    );
  }
  return _supabase;
}

const iso = (seconds?: number | null) =>
  seconds ? new Date(seconds * 1000).toISOString() : null;

function planFrom(priceId?: string | null) {
  return priceId && priceId.startsWith("premium") ? "premium" : "free";
}

function planLabel(priceId?: string | null) {
  if (priceId === "premium_yearly") return "Premium yearly";
  if (priceId === "premium_monthly") return "Premium monthly";
  return "Nexvi Premium";
}

function amountLabel(priceId?: string | null) {
  if (priceId === "premium_yearly") return "$70 / year";
  if (priceId === "premium_monthly") return "$7 / month";
  return undefined;
}

function humanDate(value?: string | null) {
  if (!value) return undefined;
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function money(amountMinor?: number | null, currency?: string | null) {
  if (amountMinor == null) return undefined;
  const zeroDecimal = new Set(["jpy", "krw", "vnd", "clp", "isk"]);
  const c = (currency || "usd").toLowerCase();
  const value = zeroDecimal.has(c) ? amountMinor : amountMinor / 100;
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: c.toUpperCase() }).format(
      value,
    );
  } catch {
    return `${value}`;
  }
}

/** Resolve the account email + display name for a user id. */
async function userContact(userId?: string | null) {
  if (!userId) return { email: undefined as string | undefined, name: undefined as string | undefined };
  try {
    const { data } = await getSupabase().auth.admin.getUserById(userId);
    const email = data?.user?.email as string | undefined;
    const { data: profile } = await getSupabase()
      .from("profiles")
      .select("full_name")
      .eq("id", userId)
      .maybeSingle();
    const full = (profile?.full_name as string | null) ?? null;
    return { email, name: full ? full.split(" ")[0] : undefined };
  } catch (e) {
    console.error("Failed to resolve user contact", e);
    return { email: undefined, name: undefined };
  }
}

async function findUserIdByCustomer(customerId?: string | null, env?: StripeEnv) {
  if (!customerId) return null;
  const { data } = await getSupabase()
    .from("subscriptions")
    .select("user_id")
    .eq("provider_customer_id", customerId)
    .eq("environment", env)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data?.user_id as string | undefined) ?? null;
}

async function upsertSubscription(subscription: any, env: StripeEnv) {
  const userId = subscription.metadata?.userId;
  if (!userId) {
    console.error("No userId in subscription metadata");
    return;
  }
  const item = subscription.items?.data?.[0];
  const priceId =
    item?.price?.lookup_key ||
    item?.price?.metadata?.lovable_external_id ||
    item?.price?.id;
  const periodEnd = item?.current_period_end ?? subscription.current_period_end;
  const cancelAtPeriodEnd = subscription.cancel_at_period_end || false;
  const isEntitled = ["active", "trialing", "past_due"].includes(subscription.status);

  const { data: existing } = await getSupabase()
    .from("subscriptions")
    .select("id, status, plan, price_id, cancel_at_period_end")
    .eq("user_id", userId)
    .eq("environment", env)
    .limit(1)
    .maybeSingle();

  const row = {
    user_id: userId,
    // Grace period: a subscription flagged to cancel keeps `premium` until
    // Stripe fires customer.subscription.deleted at period end.
    plan: isEntitled ? planFrom(priceId) : "free",
    status: subscription.status,
    price_id: priceId,
    provider: "stripe",
    provider_customer_id: subscription.customer,
    provider_subscription_id: subscription.id,
    current_period_end: iso(periodEnd),
    cancel_at_period_end: cancelAtPeriodEnd,
    environment: env,
    updated_at: new Date().toISOString(),
  };

  if (existing?.id) {
    await getSupabase().from("subscriptions").update(row).eq("id", existing.id);
  } else {
    await getSupabase().from("subscriptions").insert(row);
  }

  // ---- Notifications ----
  const wasEntitled = existing
    ? ["active", "trialing", "past_due"].includes(existing.status as string)
    : false;

  // Purchase confirmation: first time this account becomes entitled, or it
  // re-subscribes after a lapse.
  if (isEntitled && !wasEntitled) {
    const { email, name } = await userContact(userId);
    if (email) {
      await enqueueTransactionalEmail({
        templateName: "subscription-active",
        recipientEmail: email,
        idempotencyKey: `sub-active:${subscription.id}`,
        templateData: {
          name,
          planLabel: planLabel(priceId),
          amountLabel: amountLabel(priceId),
          renewsOn: humanDate(iso(periodEnd)),
        },
      });
    }
  }

  // Cancellation confirmation the moment cancel-at-period-end flips on.
  if (cancelAtPeriodEnd && !existing?.cancel_at_period_end) {
    const { email, name } = await userContact(userId);
    if (email) {
      await enqueueTransactionalEmail({
        templateName: "subscription-canceled",
        recipientEmail: email,
        idempotencyKey: `sub-cancel:${subscription.id}:${iso(periodEnd) ?? "na"}`,
        templateData: { name, accessUntil: humanDate(iso(periodEnd)) },
      });
    }
  }
}

async function cancelSubscriptionRow(subscription: any, env: StripeEnv) {
  const { data: row } = await getSupabase()
    .from("subscriptions")
    .select("id, user_id, cancel_at_period_end")
    .eq("provider_subscription_id", subscription.id)
    .eq("environment", env)
    .maybeSingle();

  await getSupabase()
    .from("subscriptions")
    .update({
      status: "canceled",
      plan: "free",
      cancel_at_period_end: false,
      updated_at: new Date().toISOString(),
    })
    .eq("provider_subscription_id", subscription.id)
    .eq("environment", env);

  // If the user cancelled immediately (never flagged cancel_at_period_end),
  // this is the first cancellation signal — confirm it by email.
  if (row && !row.cancel_at_period_end) {
    const { email, name } = await userContact(row.user_id as string);
    if (email) {
      await enqueueTransactionalEmail({
        templateName: "subscription-canceled",
        recipientEmail: email,
        idempotencyKey: `sub-ended:${subscription.id}`,
        templateData: { name },
      });
    }
  }
}

async function handlePaymentFailed(invoice: any, env: StripeEnv) {
  const userId =
    invoice.subscription_details?.metadata?.userId ||
    (await findUserIdByCustomer(invoice.customer, env));
  const { email, name } = await userContact(userId);
  if (!email) return;
  await enqueueTransactionalEmail({
    templateName: "payment-failed",
    recipientEmail: email,
    idempotencyKey: `invoice-failed:${invoice.id}:${invoice.attempt_count ?? 0}`,
    templateData: {
      name,
      amountLabel: money(invoice.amount_due, invoice.currency),
      retryOn: humanDate(iso(invoice.next_payment_attempt)),
    },
  });
}

async function handleWebhook(req: Request, env: StripeEnv) {
  const event = await verifyWebhook(req, env);

  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated":
      await upsertSubscription(event.data.object, env);
      break;
    case "customer.subscription.deleted":
      await cancelSubscriptionRow(event.data.object, env);
      break;
    case "invoice.payment_failed":
      await handlePaymentFailed(event.data.object, env);
      break;
    default:
      console.log("Unhandled event:", event.type);
  }
}

export const Route = createFileRoute("/api/public/payments/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const rawEnv = new URL(request.url).searchParams.get("env");
        if (rawEnv !== "sandbox" && rawEnv !== "live") {
          console.error("Webhook received with invalid env:", rawEnv);
          return Response.json({ received: true, ignored: "invalid env" });
        }
        try {
          await handleWebhook(request, rawEnv as StripeEnv);
          return Response.json({ received: true });
        } catch (e) {
          console.error("Webhook error:", e);
          return new Response("Webhook error", { status: 400 });
        }
      },
    },
  },
});
