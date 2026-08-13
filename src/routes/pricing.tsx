import { createFileRoute, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ExternalLink, Sparkles, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SiteShell } from "@/components/site-shell";
import { TrustedBy } from "@/components/trusted-by";
import { FaqSection, faqs } from "@/components/faq-section";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import { StripeEmbeddedCheckout } from "@/components/StripeEmbeddedCheckout";
import { PricingComparison } from "@/components/pricing-comparison";
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
      { property: "og:url", content: "https://applywise.eu/pricing" },
    ],
    links: [{ rel: "canonical", href: "https://applywise.eu/pricing" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: "ApplyWise Pro",
          description: "Unlimited AI CV generation, cover letters, ATS scoring and humanizing for job seekers.",
          brand: { "@type": "Brand", name: "ApplyWise" },
          offers: [
            { "@type": "Offer", name: "Free", price: "0", priceCurrency: "USD", url: "https://applywise.eu/pricing" },
            { "@type": "Offer", name: "Pro", priceCurrency: "USD", url: "https://applywise.eu/pricing", availability: "https://schema.org/InStock" },
          ],
        }),
      },
    ],
  }),
  component: Pricing,
});


const tools = ["CV Generator", "Cover Letter", "Humanizer", "ATS Optimizer"];

const plans = [
  {
    key: "free",
    name: "Free",
    price: "$0",
    desc: "3 free generations on every tool.",
    cta: "Get started free",
    features: [
      "3 CVs",
      "3 Cover Letters",
      "3 ATS Scores",
      "3 Humanizer Generations",
      "Free prompt library",
    ],
  },
  {
    key: "premium",
    name: "Premium",
    price: "$7",
    per: "/mo",
    desc: "Unlimited generations on every tool — less than a coffee a week.",
    highlight: true,

    cta: "Start Premium",
    features: [
      "Unlimited CV Generator",
      "Unlimited Cover Letters",
      "Unlimited ATS Scoring",
      "Unlimited AI Humanizer",
      "Faster AI generation",
      "Priority support",
      "Access to future premium features",
    ],
  },
];




export function Pricing() {
  const sub = useSubscription();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const locale = detectLocaleFromPath(pathname);
  const href = (p: string) => alternateHref(locale, p);
  const [checkoutPrice, setCheckoutPrice] = useState<string | null>(null);
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const isYearly = billing === "yearly";

  // Exact savings: 12 × $7 = $84 vs $70 yearly
  const monthlyTotal = 84;
  const yearlyPrice = 70;
  const savings = monthlyTotal - yearlyPrice; // $14
  const savingsPct = Math.round((savings / monthlyTotal) * 100); // 17%

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
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Launch price — $7/mo
            </div>
            <h1 className="font-display mt-4 text-5xl tracking-tight sm:text-6xl">Land more interviews for the price of a coffee.</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Every free account gets 3 generations on each tool — CVs, cover letters, ATS scores and the Humanizer. Premium unlocks unlimited runs for just $7 a month.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {tools.map((t) => (
                <span key={t} className="rounded-full border border-border/70 bg-card px-3 py-1 text-xs text-muted-foreground">
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-primary" /> 14-day refund</span>
              <span className="inline-flex items-center gap-1.5"><Zap className="h-4 w-4 text-primary" /> Cancel anytime</span>
              <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-primary" /> No credit card to start</span>
            </div>

            {sub.isPremium && (
              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-50 px-4 py-2 text-sm text-amber-900 dark:border-amber-300/30 dark:bg-amber-500/10 dark:text-amber-100">
                You're on Premium
                {sub.currentPeriodEnd && <span className="text-amber-900/70 dark:text-amber-100/70">· renews {new Date(sub.currentPeriodEnd).toLocaleDateString()}</span>}
              </div>
            )}
          </div>

          <TrustedBy
            ctaLabel={sub.isPremium ? "Open your dashboard" : "Start free — 3 generations per tool"}
            ctaHref={href(sub.isPremium ? "/dashboard" : "/signup")}
          />

          <div className="mt-12 flex flex-col items-center gap-3">
            <div className="inline-flex items-center rounded-full border border-border/70 bg-card p-1">
              <button
                type="button"
                onClick={() => setBilling("monthly")}
                aria-pressed={!isYearly}
                className={`rounded-full px-5 py-2 text-sm font-medium transition ${!isYearly ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBilling("yearly")}
                aria-pressed={isYearly}
                className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition ${isYearly ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`}
              >
                Yearly
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${isYearly ? "bg-primary-foreground/20" : "bg-primary/10 text-primary"}`}>
                  Save {savingsPct}%
                </span>
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              {isYearly
                ? `$${yearlyPrice} billed once a year — you save $${savings} vs $${monthlyTotal} paying monthly (2 months free).`
                : `$7 billed monthly — $${monthlyTotal} a year. Switch to yearly and pay $${yearlyPrice}, saving $${savings}.`}
            </p>
          </div>

          <div className="mx-auto mt-8 grid max-w-3xl gap-5 md:grid-cols-2">
            {plans.map(p => {
              const isPremiumCard = p.key === "premium";
              const owned = isPremiumCard && sub.isPremium;
              const showYearly = isPremiumCard && isYearly;
              return (
                <div key={p.name} className={`relative rounded-3xl border p-7 ${p.highlight ? "border-foreground/20 bg-gradient-to-br from-violet-50 to-amber-50 shadow-xl dark:border-foreground/30 dark:from-violet-500/15 dark:to-amber-500/10 dark:shadow-2xl dark:shadow-violet-900/30" : "border-border/70 bg-card"}`}>
                  {p.highlight && <Badge className="absolute -top-3 left-7 rounded-full">Most popular</Badge>}
                  <div className="font-medium">{p.name}</div>
                  <div className="font-display mt-2 flex items-baseline gap-2 text-5xl tracking-tight">
                    {p.highlight && <span className="text-2xl text-muted-foreground line-through">{showYearly ? `$${monthlyTotal}` : "$9"}</span>}
                    {showYearly ? `$${yearlyPrice}` : p.price}
                    {p.per && <span className="text-base font-sans text-muted-foreground">{showYearly ? "/yr" : p.per}</span>}
                  </div>
                  {showYearly && (
                    <div className="mt-1 text-sm font-medium text-primary">
                      ${(yearlyPrice / 12).toFixed(2)}/mo — save ${savings} ({savingsPct}%)
                    </div>
                  )}
                  <div className="mt-1 text-sm text-muted-foreground">{p.desc}</div>
                  <ul className="mt-6 space-y-2.5 text-sm">
                    {p.features.map(f => <li key={f} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 text-primary" /> {f}</li>)}
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
                        <Button
                          onClick={() => onUpgrade(isYearly ? "premium_yearly" : "premium_monthly")}
                          className="group w-full rounded-full shadow-lg shadow-primary/25 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/35"
                          size="lg"
                        >
                          {isYearly ? `Go unlimited — $${yearlyPrice}/yr` : sub.isAuthenticated ? "Go unlimited — $7/mo" : "Unlock unlimited for $7/mo"}
                          <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-0.5" />
                        </Button>
                        <Button
                          onClick={() => setBilling(isYearly ? "monthly" : "yearly")}
                          variant="ghost"
                          size="sm"
                          className="rounded-full"
                        >
                          {isYearly ? "Or pay $7 monthly" : `Or $${yearlyPrice} / year — save $${savings}`}
                        </Button>
                        <p className="text-center text-xs text-muted-foreground">

                        <p className="text-center text-xs text-muted-foreground">
                          Cancel anytime · 14-day refund · secure Stripe checkout
                        </p>
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

          <PricingComparison />

          {checkoutPrice && (
            <div className="mx-auto mt-10 max-w-3xl rounded-3xl border border-border/70 bg-card p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="text-sm font-medium">
                  Checkout · {checkoutPrice === "premium_yearly" ? "Premium yearly" : "Premium monthly"}
                </div>
                <Button variant="ghost" size="sm" className="rounded-full" onClick={() => setCheckoutPrice(null)}>
                  Cancel
                </Button>
              </div>
              <StripeEmbeddedCheckout
                priceId={checkoutPrice}
                returnUrl={`${window.location.origin}/subscription?checkout=success`}
              />
            </div>
          )}
          <FaqSection />

          <p className="mx-auto mt-10 max-w-xl text-center text-xs text-muted-foreground">
            Cancel anytime. No-questions-asked refunds within 14 days.
          </p>
        </div>
      </section>
    </SiteShell>
  );

}
