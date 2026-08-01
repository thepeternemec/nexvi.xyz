import { createFileRoute, Link, useRouterState } from "@tanstack/react-router";
import { FileText, Mail, Target, Crown, Sparkles, ArrowRight, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteShell } from "@/components/site-shell";
import { PromptCard } from "@/components/prompt-card";
import { DashboardAccountSections } from "@/components/dashboard-account-sections";

import { prompts } from "@/lib/mock-data";
import { alternateHref, detectLocaleFromPath } from "@/lib/i18n";
import { useAuth } from "@/hooks/use-auth";
import { useSubscription } from "@/hooks/use-subscription";
import { useUsage } from "@/hooks/use-usage";
import { TOOL_META } from "@/lib/plan-limits";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Your dashboard — ApplyWise" },
      { name: "description", content: "Your ApplyWise tools, saved prompts and recent activity." },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: Dashboard,
});


const tools = [
  { icon: FileText, title: "CV Generator", desc: "Tailor your CV to any job description.", href: "/cv" },
  { icon: Mail, title: "Cover Letter", desc: "Personalized letters in under a minute.", href: "/cover-letter" },
  { icon: Target, title: "ATS Optimizer", desc: "Score your CV, fix the gaps.", href: "/ats" },
  { icon: Wand2, title: "Humanizer", desc: "Make AI-written text sound like you.", href: "/humanizer" },
];

export function Dashboard() {
  const recommended = prompts.slice(0, 3);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const locale = detectLocaleFromPath(pathname);
  const href = (p: string) => alternateHref(locale, p);
  const { user, isAuthenticated } = useAuth();
  const { plan, loading: planLoading } = useSubscription();
  const usage = useUsage();

  return (
    <SiteShell>
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-foreground/[0.04] via-background to-background dark:from-foreground/[0.08]" />
        <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
          
          <h1 className="font-display mt-2 text-4xl tracking-tight sm:text-5xl">{isAuthenticated ? `Welcome back${user?.name ? `, ${user.name}` : ""}.` : "Welcome back."}</h1>
          <p className="mt-2 max-w-xl text-muted-foreground">{isAuthenticated ? "Here is everything you need to land your next role." : "Pick a tool, paste a JD, ship the application."}</p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
        {plan !== "premium" && (
          <div className="relative mb-10 overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-800 p-8 text-neutral-50 shadow-lg sm:p-10 dark:border-white/10 dark:from-[#0b1220] dark:via-[#111a2e] dark:to-[#0b1220]">
            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/25 blur-3xl" />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                  <Crown className="h-3.5 w-3.5" /> Upgrade to Premium
                </div>
                <h2 className="font-display mt-4 text-3xl tracking-tight sm:text-4xl">Apply to every job without limits.</h2>
                <p className="mt-3 text-sm text-neutral-300">Unlimited CVs, cover letters, ATS rewrites, the Humanizer and the full premium prompt library — one plan, cancel anytime.</p>
                <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-neutral-200">
                  <li className="inline-flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5 text-primary" /> Unlimited generations</li>
                  <li className="inline-flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5 text-primary" /> Full prompt library</li>
                  <li className="inline-flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5 text-primary" /> Priority AI models</li>
                </ul>
              </div>
              <div className="flex shrink-0 flex-col items-start gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-stretch">
                <a href={href("/pricing")}>
                  <Button size="lg" className="w-full rounded-full">
                    Go Premium <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Button>
                </a>
                <a href={href("/pricing")} className="text-xs text-neutral-400 underline-offset-4 hover:text-neutral-200 hover:underline">Compare plans</a>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {usage.tools.map((t) => {
            const limit = usage.limits[t];
            const left = Math.max(0, limit - usage.used[t]);
            const pct = usage.isPremium ? 100 : Math.min(100, Math.round((usage.used[t] / limit) * 100));
            return (
              <div key={t} className="rounded-2xl border border-border/70 bg-card p-5">
                <div className="text-xs text-muted-foreground">{TOOL_META[t].plural}</div>
                <div className="font-display mt-2 text-3xl tracking-tight tabular-nums">
                  {usage.isPremium ? `${usage.used[t]} used` : `${left} / ${limit}`}
                </div>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ease-out ${usage.isPremium ? "bg-primary" : left === 0 ? "bg-rose-500" : "bg-foreground"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="mt-2 text-[11px] text-muted-foreground">
                  {usage.isPremium ? "Unlimited on Premium" : left === 0 ? "Limit reached — upgrade for unlimited" : `${usage.used[t]} used`}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 text-xs text-muted-foreground">
          Plan: <span className="font-medium text-foreground">{planLoading ? "…" : plan.charAt(0).toUpperCase() + plan.slice(1)}</span>
        </div>

        <DashboardAccountSections />


        <h2 className="font-display mt-12 text-2xl tracking-tight">Jump back in</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {tools.map(t => (
            <a key={t.href} href={href(t.href)} className="group flex flex-col rounded-3xl border border-border/70 bg-card p-7 transition hover:border-foreground/30 hover:shadow-lg">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-foreground/5 text-foreground">
                <t.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{t.title}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{t.desc}</p>
              <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
                Open <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </div>
            </a>
          ))}
        </div>

        <div className="mt-12 flex items-end justify-between">
          <h2 className="font-display text-2xl tracking-tight">Recommended prompts</h2>
          <a href={href("/marketplace")} className="text-sm text-muted-foreground hover:text-foreground">Browse library →</a>
        </div>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {recommended.map(p => <PromptCard key={p.id} prompt={p} />)}
        </div>

        <div className="mt-12">
          <a href={href("/assistant")} className="block rounded-3xl border border-border/70 bg-card p-7 hover:border-foreground/30">
            <div className="flex items-center gap-2 text-sm font-medium"><Sparkles className="h-4 w-4" /> Not sure where to start?</div>
            <div className="font-display mt-3 text-2xl tracking-tight">Ask the AI career guide.</div>
            <p className="mt-2 text-sm text-muted-foreground">Tell it your target role. It picks the right prompts and walks you through them.</p>
          </a>
        </div>
      </section>
    </SiteShell>
  );
}
