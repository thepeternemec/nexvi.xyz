import { createFileRoute, Link, useRouterState } from "@tanstack/react-router";
import { FileText, Mail, Target, Crown, Sparkles, ArrowRight, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteShell } from "@/components/site-shell";
import { PromptCard } from "@/components/prompt-card";
import { DashboardAccountSections } from "@/components/dashboard-account-sections";
import { UsageHistory } from "@/components/usage-history";
import { UsageMeters } from "@/components/usage-meters";

import { prompts } from "@/lib/mock-data";
import { alternateHref, detectLocaleFromPath } from "@/lib/i18n";
import { useAuth } from "@/hooks/use-auth";
import { useSubscription } from "@/hooks/use-subscription";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Your dashboard — Nexvi" },
      { name: "description", content: "Your Nexvi tools, saved prompts and recent activity." },
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
          <div className="relative mb-10 overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-br from-background via-muted/40 to-primary/[0.06] p-8 text-foreground shadow-sm sm:p-10 dark:border-white/10 dark:from-[#0b1220] dark:via-[#111a2e] dark:to-[#0b1220] dark:text-neutral-50 dark:shadow-lg">
            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/70 px-3 py-1 text-xs font-semibold uppercase tracking-wider dark:border-white/15 dark:bg-white/10">
                  <Crown className="h-3.5 w-3.5" /> Upgrade to Premium
                </div>
                <h2 className="font-display mt-4 text-3xl tracking-tight sm:text-4xl">Apply to every job without limits.</h2>
                <p className="mt-3 text-sm text-muted-foreground dark:text-neutral-300">Unlimited CVs, cover letters, ATS rewrites, the Humanizer and the full premium prompt library — one plan, cancel anytime.</p>
                <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-foreground/80 dark:text-neutral-200">
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
                <a href={href("/pricing")} className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline dark:text-neutral-400 dark:hover:text-neutral-200">Compare plans</a>
              </div>
            </div>
          </div>
        )}

        <UsageMeters />
        <div className="mt-4 text-xs text-muted-foreground">
          Plan: <span className="font-medium text-foreground">{planLoading ? "…" : plan.charAt(0).toUpperCase() + plan.slice(1)}</span>
        </div>


        <DashboardAccountSections />

        <UsageHistory />


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
          <a href={href("/prompts")} className="text-sm text-muted-foreground hover:text-foreground">Browse library →</a>
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
