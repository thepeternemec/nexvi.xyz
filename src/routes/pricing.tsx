import { createFileRoute, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Crown, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SiteShell } from "@/components/site-shell";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import { StripeEmbeddedCheckout } from "@/components/StripeEmbeddedCheckout";
import { useSubscription } from "@/hooks/use-subscription";
import { alternateHref, detectLocaleFromPath } from "@/lib/i18n";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Free & Pro Plans | ApplyWise" },
      { name: "description", content: "Start free with AI CVs, cover letters and ATS scoring. Upgrade to Pro for unlimited generations and the full prompt library." },
      { property: "og:title", content: "ApplyWise Pricing — Free & Pro" },
      { property: "og:description", content: "Free forever plan, plus Pro for unlimited AI job application tools." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/pricing" },
    ],
    links: [{ rel: "canonical", href: "/pricing" }],
  }),
  component: Pricing,
});


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
];



export function Pricing() {
  const sub = useSubscription();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const locale = detectLocaleFromPath(pathname);
  const href = (p: string) => alternateHref(locale, p);
  const [checkoutPrice, setCheckoutPrice] = useState<string | null>(null);

  function onUpgrade(priceId: "premium_monthly" | "premium_yearly") {
    if (!sub.isAuthenticated) {
      navigate({ to: "/signup" });
      return;
    }
    setCheckoutPrice(priceId);
  }

  return (
    <SiteShell>
      <PaymentTestModeBanner />
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

          <div className="mx-auto mt-14 grid max-w-3xl gap-5 md:grid-cols-2">
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
                      <a href={href("/subscription")} className="mt-7 inline-flex w-full">
                        <Button variant="outline" className="w-full rounded-full" size="lg">
                          <ExternalLink className="mr-2 h-4 w-4" /> Manage subscription
                        </Button>
                      </a>
                    ) : (
                      <div className="mt-7 grid gap-2">
                        <Button onClick={() => onUpgrade("premium_monthly")} className="w-full rounded-full" size="lg">
                          <Crown className="mr-2 h-4 w-4" />
                          {sub.isAuthenticated ? "Start Premium — $9/mo" : "Sign up to start"}
                        </Button>
                        <Button onClick={() => onUpgrade("premium_yearly")} variant="ghost" size="sm" className="rounded-full">
                          Or $90 / year (save 2 months)
                        </Button>
                      </div>
                    )
                  ) : (
        <a href={href("/signup")} className="mt-7 inline-flex w-full">
                      <Button className="w-full rounded-full" variant={p.highlight ? "default" : "outline"} size="lg">{p.cta}</Button>
        </a>
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
