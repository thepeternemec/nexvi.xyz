import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, TrendingUp, DollarSign, Eye, Package, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SiteShell } from "@/components/site-shell";
import { prompts } from "@/lib/mock-data";

export const Route = createFileRoute("/creator")({ component: Creator });

function Creator() {
  const mine = prompts.slice(0, 5);
  return (
    <SiteShell>
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-foreground/[0.04] via-background to-background dark:from-foreground/[0.08]" />
        <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Coach dashboard</div>
              <h1 className="font-display mt-2 text-4xl tracking-tight sm:text-5xl">Hey Maya 👋</h1>
              <p className="mt-2 text-muted-foreground">Your prompts helped 1,284 job seekers get interviews this month.</p>
            </div>
            <Button size="lg" className="rounded-full"><Plus className="mr-1.5 h-4 w-4" /> New prompt</Button>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-4">
          <Stat icon={<DollarSign className="h-4 w-4" />} label="Revenue (30d)" value="$4,820" trend="+18%" />
          <Stat icon={<Eye className="h-4 w-4" />} label="Views (30d)" value="58.2k" trend="+12%" />
          <Stat icon={<Package className="h-4 w-4" />} label="Active prompts" value="42" />
          <Stat icon={<TrendingUp className="h-4 w-4" />} label="Conversion" value="6.4%" trend="+0.8%" />
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-3xl border border-border/70 bg-card p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl tracking-tight">My products</h2>
              <Button variant="outline" size="sm" className="rounded-full">Manage</Button>
            </div>
            <div className="mt-5 divide-y divide-border/60">
              {mine.map(p => (
                <div key={p.id} className="flex items-center justify-between gap-4 py-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`h-12 w-12 shrink-0 rounded-xl bg-gradient-to-br ${p.cover}`} />
                    <div className="min-w-0">
                      <Link to="/prompt/$slug" params={{ slug: p.slug }} className="font-medium truncate block hover:underline">{p.title}</Link>
                      <div className="text-xs text-muted-foreground">{p.uses.toLocaleString()} uses · ★ {p.rating}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {p.price === 0 ? <Badge variant="secondary" className="rounded-full">Free</Badge> : <Badge className="rounded-full">${p.price}</Badge>}
                    <Button size="sm" variant="ghost">Edit</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-5">
            <div className="rounded-3xl border border-border/70 bg-card p-6">
              <div className="flex items-center gap-2 text-sm font-medium"><BarChart3 className="h-4 w-4" /> Top performers</div>
              <ol className="mt-4 space-y-3 text-sm">
                {mine.slice(0, 3).map((p, i) => (
                  <li key={p.id} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-muted-foreground">{i + 1}.</span>
                      <span className="truncate">{p.title}</span>
                    </div>
                    <span className="text-muted-foreground">{p.uses.toLocaleString()}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="rounded-3xl border border-border/70 bg-gradient-to-br from-foreground to-zinc-800 p-6 text-background">
              <div className="text-xs uppercase tracking-wider text-background/70">Bundle idea</div>
              <div className="font-display mt-2 text-2xl tracking-tight">Career Switcher Pack</div>
              <p className="mt-2 text-sm text-background/80">Bundle your 4 career prompts together for $24. People buying bundles spend 2.3x more.</p>
              <Button size="sm" variant="secondary" className="mt-4 rounded-full">Create bundle</Button>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

function Stat({ icon, label, value, trend }: { icon: React.ReactNode; label: string; value: string; trend?: string }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card p-5">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">{icon} {label}</div>
      <div className="mt-2 flex items-baseline gap-2">
        <div className="font-display text-3xl tracking-tight">{value}</div>
        {trend && <span className="text-xs font-medium text-emerald-600">{trend}</span>}
      </div>
    </div>
  );
}
