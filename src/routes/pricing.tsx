import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SiteShell } from "@/components/site-shell";

export const Route = createFileRoute("/pricing")({ component: Pricing });

const plans = [
  { name: "Free", price: "$0", desc: "For the curious.", cta: "Get started", features: ["Browse the marketplace", "Save up to 20 prompts", "All free prompts", "Basic AI Assistant"] },
  { name: "Premium", price: "$9", per: "/mo", desc: "The whole library.", highlight: true, cta: "Start Premium", features: ["Everything in Free", "Unlimited library access", "New packs every week", "Priority AI Assistant", "Early access to creator drops"] },
  { name: "Creator", price: "Earn 80%", desc: "Sell your own work.", cta: "Become a creator", features: ["Upload & sell prompts", "Bundles & subscriptions", "Real-time analytics", "Stripe payouts"] },
];

function Pricing() {
  return (
    <SiteShell>
      <section className="bg-aurora">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pricing</div>
            <h1 className="font-display mt-3 text-5xl tracking-tight sm:text-6xl">Friendly pricing. Real outcomes.</h1>
            <p className="mt-4 text-lg text-muted-foreground">Start free. Upgrade when you're ready for everything.</p>
          </div>
          <div className="mx-auto mt-14 grid max-w-5xl gap-5 md:grid-cols-3">
            {plans.map(p => (
              <div key={p.name} className={`relative rounded-3xl border p-7 ${p.highlight ? "border-foreground/20 bg-gradient-to-br from-violet-50 to-amber-50 shadow-xl" : "border-border/70 bg-card"}`}>
                {p.highlight && <Badge className="absolute -top-3 left-7 rounded-full">Most loved</Badge>}
                <div className="font-medium">{p.name}</div>
                <div className="font-display mt-2 flex items-baseline gap-1 text-5xl tracking-tight">{p.price}{p.per && <span className="text-base font-sans text-muted-foreground">{p.per}</span>}</div>
                <div className="mt-1 text-sm text-muted-foreground">{p.desc}</div>
                <ul className="mt-6 space-y-2.5 text-sm">
                  {p.features.map(f => <li key={f} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 text-violet-600" /> {f}</li>)}
                </ul>
                <Link to="/signup" className="mt-7 inline-flex w-full"><Button className="w-full rounded-full" variant={p.highlight ? "default" : "outline"} size="lg">{p.cta}</Button></Link>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-10 max-w-xl text-center text-xs text-muted-foreground">Cancel anytime. No-questions-asked refunds within 14 days.</p>
        </div>
      </section>
    </SiteShell>
  );
}
