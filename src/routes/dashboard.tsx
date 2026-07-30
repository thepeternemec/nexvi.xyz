import { createFileRoute, Link, useRouterState } from "@tanstack/react-router";
import { FileText, Mail, Target, Crown, Sparkles, ArrowRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteShell } from "@/components/site-shell";
import { PromptCard } from "@/components/prompt-card";
import { prompts } from "@/lib/mock-data";
import { alternateHref, detectLocaleFromPath } from "@/lib/i18n";
import { useAuth } from "@/hooks/use-auth";
import { useSubscription } from "@/hooks/use-subscription";

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
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{isAuthenticated ? (user?.email ? `Signed in as ${user.email}` : "Your account") : "Your job search HQ"}</div>
          <h1 className="font-display mt-2 text-4xl tracking-tight sm:text-5xl">{isAuthenticated ? `Welcome back${user?.name ? `, ${user.name}` : ""}.` : "Welcome back."}</h1>
          <p className="mt-2 max-w-xl text-muted-foreground">{isAuthenticated ? "Here is everything you need to land your next role." : "Pick a tool, paste a JD, ship the application."}</p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-4">
          {[
            { label: "CVs generated", v: "0" },
            { label: "Cover letters", v: "0" },
            { label: "ATS reports", v: "0" },
            { label: "Plan", v: planLoading ? "…" : plan.charAt(0).toUpperCase() + plan.slice(1) },
          ].map(s => (
            <div key={s.label} className="rounded-2xl border border-border/70 bg-card p-5">
              <div className="text-xs text-muted-foreground">{s.label}</div>
              <div className="font-display mt-2 text-3xl tracking-tight">{s.v}</div>
            </div>
          ))}
        </div>

        {isAuthenticated && user && (
          <div className="mt-6 rounded-2xl border border-border/70 bg-card p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-foreground/5 text-foreground">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Signed in as</div>
                  <div className="font-display text-lg font-medium">{user.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">{planLoading ? "…" : plan.charAt(0).toUpperCase() + plan.slice(1)}</span>
                <a href={href("/pricing")}><Button variant="outline" size="sm" className="rounded-full">Upgrade</Button></a>
              </div>
            </div>
          </div>
        )}

        <h2 className="font-display mt-12 text-2xl tracking-tight">Jump back in</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
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

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          <a href={href("/assistant")} className="rounded-3xl border border-border/70 bg-card p-7 hover:border-foreground/30">
            <div className="flex items-center gap-2 text-sm font-medium"><Sparkles className="h-4 w-4" /> Not sure where to start?</div>
            <div className="font-display mt-3 text-2xl tracking-tight">Ask the AI career guide.</div>
            <p className="mt-2 text-sm text-muted-foreground">Tell it your target role. It picks the right prompts and walks you through them.</p>
          </a>
          <div className="rounded-3xl border border-border/70 bg-foreground p-7 text-background">
            <div className="flex items-center gap-2 text-sm font-medium"><Crown className="h-4 w-4" /> Upgrade to Premium</div>
            <div className="font-display mt-3 text-2xl tracking-tight">Unlimited applications.</div>
            <p className="mt-2 text-sm text-background/80">Unlimited CVs, cover letters, ATS rewrites and the full premium library.</p>
            <a href={href("/pricing")}><Button variant="secondary" className="mt-5 rounded-full">See pricing</Button></a>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
