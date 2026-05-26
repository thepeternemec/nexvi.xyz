import { createFileRoute, Link } from "@tanstack/react-router";
import { Bookmark, Clock, Receipt, Settings, Crown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SiteShell } from "@/components/site-shell";
import { PromptCard } from "@/components/prompt-card";
import { prompts } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard")({ component: Dashboard });

function Dashboard() {
  const saved = prompts.slice(0, 3);
  const recent = prompts.slice(3, 6);
  const purchases = prompts.filter(p => p.price > 0).slice(0, 2);

  return (
    <SiteShell>
      <section className="border-b border-border/60 bg-aurora">
        <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Your dashboard</div>
              <h1 className="font-display mt-2 text-4xl tracking-tight sm:text-5xl">Welcome back, Alex.</h1>
              <p className="mt-2 max-w-xl text-muted-foreground">Pick up where you left off — or ask the AI Assistant what to try next.</p>
            </div>
            <Link to="/assistant"><Button size="lg" className="rounded-full"><Sparkles className="mr-1.5 h-4 w-4" /> Ask the Assistant</Button></Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-4">
          {[
            { icon: <Bookmark className="h-4 w-4" />, label: "Saved", v: "12" },
            { icon: <Clock className="h-4 w-4" />, label: "Recently used", v: "8" },
            { icon: <Receipt className="h-4 w-4" />, label: "Purchases", v: "3" },
            { icon: <Crown className="h-4 w-4" />, label: "Plan", v: "Free" },
          ].map(s => (
            <div key={s.label} className="rounded-2xl border border-border/70 bg-card p-5">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">{s.icon} {s.label}</div>
              <div className="font-display mt-2 text-3xl tracking-tight">{s.v}</div>
            </div>
          ))}
        </div>

        <Section title="Saved prompts" linkText="View all" linkTo="/marketplace" items={saved} />
        <Section title="Recently used" linkText="Marketplace" linkTo="/marketplace" items={recent} />
        <Section title="Purchase history" linkText="Receipts" linkTo="/dashboard" items={purchases} empty="No purchases yet — explore the marketplace." />

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          <div className="rounded-3xl border border-border/70 bg-card p-6">
            <div className="flex items-center gap-2"><Settings className="h-4 w-4" /><div className="text-sm font-medium">Account settings</div></div>
            <div className="mt-4 space-y-3 text-sm">
              <Row label="Email" value="alex@example.com" />
              <Row label="Name" value="Alex Rivera" />
              <Row label="Notifications" value="Weekly digest" />
            </div>
            <Button variant="outline" className="mt-5 rounded-full">Edit settings</Button>
          </div>
          <div className="rounded-3xl border border-border/70 bg-gradient-to-br from-violet-600 to-fuchsia-600 p-6 text-white">
            <div className="flex items-center gap-2"><Crown className="h-4 w-4" /><div className="text-sm font-medium">Subscription</div></div>
            <div className="font-display mt-3 text-3xl tracking-tight">You're on Free.</div>
            <p className="mt-2 text-sm text-white/85">Unlock the whole library, new packs weekly, and priority AI Assistant.</p>
            <Button variant="secondary" className="mt-5 rounded-full">Upgrade to Premium — $9/mo</Button>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

function Section({ title, linkText, linkTo, items, empty }: { title: string; linkText: string; linkTo: string; items: typeof prompts; empty?: string }) {
  return (
    <div className="mt-12">
      <div className="flex items-end justify-between">
        <h2 className="font-display text-2xl tracking-tight">{title}</h2>
        <Link to={linkTo} className="text-sm text-muted-foreground hover:text-foreground">{linkText} →</Link>
      </div>
      <div className="mt-5">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-8 text-sm text-muted-foreground">{empty}</div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map(p => <PromptCard key={p.id} prompt={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border/60 pb-2 last:border-0 last:pb-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
