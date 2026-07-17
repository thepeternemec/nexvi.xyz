import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { Check, Crown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SiteShell } from "@/components/site-shell";
import { useSubscription } from "@/hooks/use-subscription";
import { startSubscription, cancelSubscription } from "@/lib/subscriptions.functions";

export const Route = createFileRoute("/pricing")({ component: Pricing });

const plans = [
  {
    key: "free",
    name: "Free",
    price: "$0",
    desc: "Land your first interview.",
    cta: "Get started",
    features: ["3 CV generations / month", "3 cover letters / month", "Basic ATS score", "Free prompt library"],
  },
  {
    key: "premium",
    name: "Premium",
    price: "$9",
    per: "/mo",
    desc: "Run a real job search.",
    highlight: true,
    cta: "Start Premium",
    features: ["Unlimited CV & cover letter generations", "Full ATS optimizer with rewrites", "Saved CVs, letters & reports", "Entire premium prompt library", "Priority AI models"],
  },
  {
    key: "coach",
    name: "Career Coach",
    price: "$29",
    per: "/mo",
    desc: "Land senior & exec roles.",
    cta: "Talk to us",
    features: ["Everything in Premium", "1:1 CV review every month", "Interview & negotiation playbooks", "Recruiter outreach templates", "Priority email support"],
  },
];


export function Pricing() {
  const sub = useSubscription();
  const navigate = useNavigate();
  const start = useServerFn(startSubscription);
  const cancel = useServerFn(cancelSubscription);
  const [busy, setBusy] = useState<string | null>(null);

  async function onUpgrade(plan: "premium_monthly" | "trial") {
    if (!sub.isAuthenticated) {
      navigate({ to: "/signup" });
      return;
    }
    setBusy(plan);
    try {
      await start({ data: { plan } });
      await sub.refresh();
      toast.success(plan === "trial" ? "Your free trial is active." : "Welcome to Premium!");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not start subscription");
    } finally {
      setBusy(null);
    }
  }

  async function onCancel() {
    setBusy("cancel");
    try {
      await cancel();
      await sub.refresh();
      toast.success("Subscription canceled.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not cancel");
    } finally {
      setBusy(null);
    }
  }

  return (
    <SiteShell>
      <section className="bg-aurora">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pricing</div>
            <h1 className="font-display mt-3 text-5xl tracking-tight sm:text-6xl">Pay once you're getting interviews.</h1>
            <p className="mt-4 text-lg text-muted-foreground">Free to try every tool. Upgrade when you're applying for real.</p>
            {sub.isPremium && (
              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-50 px-4 py-2 text-sm text-amber-900 dark:border-amber-300/30 dark:bg-amber-500/10 dark:text-amber-100">
                <Crown className="h-4 w-4" /> You're on Premium
                {sub.currentPeriodEnd && <span className="text-amber-900/70 dark:text-amber-100/70">· renews {new Date(sub.currentPeriodEnd).toLocaleDateString()}</span>}
              </div>
            )}
          </div>

          <div className="mx-auto mt-14 grid max-w-5xl gap-5 md:grid-cols-3">
            {plans.map(p => {
              const isPremiumCard = p.key === "premium";
              const owned = isPremiumCard && sub.isPremium;
              return (
                <div key={p.name} className={`relative rounded-3xl border p-7 ${p.highlight ? "border-foreground/20 bg-gradient-to-br from-violet-50 to-amber-50 shadow-xl dark:border-foreground/30 dark:from-violet-500/15 dark:to-amber-500/10 dark:shadow-2xl dark:shadow-violet-900/30" : "border-border/70 bg-card"}`}>
                  {p.highlight && <Badge className="absolute -top-3 left-7 rounded-full">Most loved</Badge>}
                  <div className="font-medium">{p.name}</div>
                  <div className="font-display mt-2 flex items-baseline gap-1 text-5xl tracking-tight">{p.price}{p.per && <span className="text-base font-sans text-muted-foreground">{p.per}</span>}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{p.desc}</div>
                  <ul className="mt-6 space-y-2.5 text-sm">
                    {p.features.map(f => <li key={f} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 text-violet-600" /> {f}</li>)}
                  </ul>

                  {isPremiumCard ? (
                    owned ? (
                      <Button onClick={onCancel} disabled={busy === "cancel"} variant="outline" className="mt-7 w-full rounded-full" size="lg">
                        {busy === "cancel" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Cancel Premium
                      </Button>
                    ) : (
                      <div className="mt-7 grid gap-2">
                        <Button onClick={() => onUpgrade("premium_monthly")} disabled={!!busy} className="w-full rounded-full" size="lg">
                          {busy === "premium_monthly" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Crown className="mr-2 h-4 w-4" />}
                          {sub.isAuthenticated ? "Start Premium" : "Sign up to start"}
                        </Button>
                        {sub.isAuthenticated && (
                          <Button onClick={() => onUpgrade("trial")} disabled={!!busy} variant="ghost" size="sm" className="rounded-full">
                            Start 14-day free trial
                          </Button>
                        )}
                      </div>
                    )
                  ) : (
                    <Link to={p.key === "free" ? "/signup" : "/signup"} className="mt-7 inline-flex w-full">
                      <Button className="w-full rounded-full" variant={p.highlight ? "default" : "outline"} size="lg">{p.cta}</Button>
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
          <p className="mx-auto mt-10 max-w-xl text-center text-xs text-muted-foreground">
            Cancel anytime. No-questions-asked refunds within 14 days.
          </p>
        </div>
      </section>
    </SiteShell>
  );
}
