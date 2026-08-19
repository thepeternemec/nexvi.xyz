import { createFileRoute, useRouterState } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { Crown, ExternalLink, Loader2, CreditCard, CalendarClock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteShell } from "@/components/site-shell";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import { StripeEmbeddedCheckout } from "@/components/StripeEmbeddedCheckout";
import { useAuth } from "@/hooks/use-auth";
import { useSubscription } from "@/hooks/use-subscription";
import { createPortalSession } from "@/utils/payments.functions";
import { getStripeEnvironment } from "@/lib/stripe";
import { getSubscriptionStatusConfig, formatSubscriptionPeriod } from "@/lib/subscription-ui";
import { alternateHref, detectLocaleFromPath } from "@/lib/i18n";

export const Route = createFileRoute("/subscription")({
  head: () => ({
    meta: [
      { title: "Manage your subscription — Nexvi" },
      {
        name: "description",
        content:
          "Review your Nexvi plan, update your payment details, switch plans or cancel anytime from your billing portal.",
      },
      { property: "og:title", content: "Manage your Nexvi subscription" },
      { property: "og:description", content: "Update your plan, payment method or cancel anytime." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: SubscriptionPage,
});

export function SubscriptionPage() {
  const { user, isAuthenticated } = useAuth();
  const sub = useSubscription();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const locale = detectLocaleFromPath(pathname);
  const href = (p: string) => alternateHref(locale, p);
  const portal = useServerFn(createPortalSession);
  const [busy, setBusy] = useState<string | null>(null);
  const [checkoutPrice, setCheckoutPrice] = useState<string | null>(null);

  async function openPortal() {
    setBusy("portal");
    try {
      const result = await portal({
        data: { returnUrl: window.location.href, environment: getStripeEnvironment() },
      });
      if ("error" in result) throw new Error(result.error);
      window.open(result.url, "_blank", "noopener,noreferrer");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not open the billing portal");
    } finally {
      setBusy(null);
    }
  }

  const statusConfig = sub.loading ? null : getSubscriptionStatusConfig(sub.status);
  const StatusIcon = statusConfig ? statusConfig.icon : null;
  const periodText =
    sub.loading || !sub.currentPeriodEnd
      ? null
      : formatSubscriptionPeriod(sub.status, sub.currentPeriodEnd, sub.cancelAtPeriodEnd);
  const canManagePortal = ["active", "trialing", "past_due"].includes(sub.status || "");

  return (
    <SiteShell>
      <PaymentTestModeBanner />
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-foreground/[0.04] via-background to-background dark:from-foreground/[0.08]" />
        <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Billing
          </div>
          <h1 className="font-display mt-2 text-4xl tracking-tight sm:text-5xl">
            Manage your subscription.
          </h1>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Change plan, update your card, download invoices or cancel anytime — all from your secure
            billing portal.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
        {!isAuthenticated ? (
          <div className="rounded-3xl border border-border/70 bg-card p-8 text-center">
            <h2 className="font-display text-2xl tracking-tight">Sign in to manage billing</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Your plan and invoices live in your Nexvi account.
            </p>
            <a href={href("/login")} className="mt-6 inline-flex">
              <Button className="rounded-full">Sign in</Button>
            </a>
          </div>
        ) : (
          <>
            <div className="rounded-3xl border border-border/70 bg-card p-7">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground">Current plan</div>
                  <div className="font-display mt-1 flex items-center gap-2 text-3xl tracking-tight">
                    {sub.loading ? "…" : sub.plan === "premium" ? "Premium" : "Free"}
                    {sub.isPremium && <Crown className="h-5 w-5 text-primary" />}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                    {sub.loading ? (
                      <span className="text-muted-foreground">Loading…</span>
                    ) : statusConfig && StatusIcon ? (
                      <>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusConfig.badgeClass}`}
                        >
                          <StatusIcon className="h-3.5 w-3.5" />
                          {statusConfig.label}
                        </span>
                        {periodText && (
                          <span className="text-muted-foreground">· {periodText}</span>
                        )}
                      </>
                    ) : null}
                  </div>
                  {user?.email && (
                    <div className="mt-1 text-xs text-muted-foreground">Billed to {user.email}</div>
                  )}

                  {!sub.loading && statusConfig && (
                    <div className={`mt-4 rounded-2xl border p-4 text-sm ${statusConfig.bannerClass}`}>
                      <div className="flex items-start gap-3">
                        {StatusIcon && <StatusIcon className="mt-0.5 h-4 w-4 shrink-0" />}
                        <p>{statusConfig.description}</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2 sm:items-end">
                  {canManagePortal ? (
                    <Button
                      onClick={openPortal}
                      disabled={busy === "portal"}
                      className="rounded-full"
                      size="lg"
                    >
                      {busy === "portal" ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <ExternalLink className="mr-2 h-4 w-4" />
                      )}
                      {sub.status === "past_due"
                        ? "Fix payment method"
                        : sub.status === "trialing"
                          ? "Manage trial"
                          : "Open billing portal"}
                    </Button>
                  ) : (
                    <a href={href("/pricing")} className="inline-flex">
                      <Button className="rounded-full" size="lg">
                        <Crown className="mr-2 h-4 w-4" /> Upgrade to Premium
                      </Button>
                    </a>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {canManagePortal ? "Opens in a new tab" : "Unlock all tools"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {[
                { icon: CreditCard, title: "Payment details", desc: "Update your card or billing address." },
                { icon: CalendarClock, title: "Monthly plan", desc: "Premium renews every month." },
                { icon: ShieldCheck, title: "Cancel anytime", desc: "Keep access until the end of your period." },
              ].map((f) => (
                <div key={f.title} className="rounded-2xl border border-border/70 bg-card p-5">
                  <f.icon className="h-5 w-5 text-foreground" />
                  <div className="mt-3 text-sm font-semibold">{f.title}</div>
                  <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
                </div>
              ))}
            </div>


            {!sub.isPremium && (
              <div className="mt-8 rounded-3xl border border-border/70 bg-card p-7">
                <h2 className="font-display text-2xl tracking-tight">Start Premium</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Unlimited CVs, cover letters, ATS rewrites and the full premium prompt library.
                </p>
                {checkoutPrice ? (
                  <div className="mt-6">
                    <StripeEmbeddedCheckout
                      priceId={checkoutPrice}
                      returnUrl={`${window.location.origin}/subscription?checkout=success`}
                    />
                  </div>
                ) : (
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button className="rounded-full" onClick={() => setCheckoutPrice("premium_monthly")}>
                      <Crown className="mr-2 h-4 w-4" /> $7 / month
                    </Button>
                    <a href={href("/pricing")} className="inline-flex">
                      <Button variant="ghost" className="rounded-full">
                        Compare plans
                      </Button>
                    </a>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </section>
    </SiteShell>
  );
}
