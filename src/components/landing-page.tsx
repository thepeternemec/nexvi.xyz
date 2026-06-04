import { Link } from "@tanstack/react-router";
import { ArrowRight, FileText, Mail, Target, Sparkles, CheckCircle2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteShell } from "@/components/site-shell";

export function LandingPage() {
  return (
    <SiteShell>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-foreground/[0.04] via-background to-background dark:from-foreground/[0.08]" />
        <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/60 px-3 py-1.5 text-xs font-medium text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5" />
              AI-powered • ATS-optimized • Tailored to every role
            </div>
            <h1 className="mt-6 font-display text-5xl tracking-tight sm:text-6xl lg:text-7xl">
              Get hired with CVs that <em className="italic text-muted-foreground">actually</em> beat the bots.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
              Paste any job description. We generate a tailored CV and cover letter, score it against the ATS, and tell you exactly what to fix.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/signup"><Button size="lg" className="rounded-full">Generate my CV <ArrowRight className="h-4 w-4" /></Button></Link>
              <a href="/ats"><Button size="lg" variant="outline" className="rounded-full">Check my ATS score</Button></a>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5" /> Free to try</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5" /> No credit card</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5" /> Built on top AI models</span>
            </div>
          </div>
        </div>
      </section>

      {/* TOOLS */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
        <div className="text-center">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Three tools. One outcome.</div>
          <h2 className="font-display mt-3 text-3xl tracking-tight sm:text-4xl">Everything you need to land the job.</h2>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            { icon: FileText, title: "CV Generator", desc: "A tailored, ATS-friendly CV in seconds — keyword-optimized for the exact job description you paste in.", href: "/cv", badge: "Most popular" },
            { icon: Mail, title: "Cover Letter Generator", desc: "Personalized cover letters that connect your real experience to what the company actually wants.", href: "/cover-letter" },
            { icon: Target, title: "ATS Optimizer", desc: "Score your CV against any job. Get matched keywords, gaps, and rewrite tips in plain English.", href: "/ats" },
          ].map((t) => (
            <a key={t.href} href={t.href} className="group relative flex flex-col rounded-3xl border border-border/70 bg-card p-7 transition hover:border-foreground/30 hover:shadow-lg">
              {t.badge && (
                <span className="absolute right-5 top-5 rounded-full bg-foreground px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-background">
                  {t.badge}
                </span>
              )}
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-foreground/5 text-foreground">
                <t.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{t.title}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{t.desc}</p>
              <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
                Open tool <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-y border-border/60 bg-muted/20">
        <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">How it works</div>
              <h2 className="font-display mt-3 text-3xl tracking-tight sm:text-4xl">From job description to interview-ready in 60 seconds.</h2>
              <p className="mt-4 text-muted-foreground">No more rewriting your CV for every application. Paste the job description, paste your background, and we do the tailoring — keyword by keyword.</p>
              <ul className="mt-8 space-y-5">
                {[
                  ["Paste the job description", "Any role, any industry. We extract the keywords that matter."],
                  ["Add your background", "Past roles, skills, education, or your existing CV — however you have it."],
                  ["Get tailored, ATS-ready docs", "A CV, a cover letter, and an ATS score with concrete fixes."],
                ].map(([t, d], i) => (
                  <li key={t} className="flex gap-4">
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-foreground text-sm font-semibold text-background">{i + 1}</div>
                    <div>
                      <div className="font-medium">{t}</div>
                      <div className="text-sm text-muted-foreground">{d}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-border/70 bg-background p-6 shadow-sm">
              <div className="rounded-xl bg-muted/40 p-4 font-mono text-xs">
                <div className="text-muted-foreground">// Job description</div>
                <div className="mt-1 line-clamp-3">Senior Product Designer at Linear. Lead end-to-end design for new B2B SaaS workflows. Ship fast. Collaborate with PMs and eng…</div>
              </div>
              <div className="mt-3 rounded-xl bg-muted/40 p-4 font-mono text-xs">
                <div className="text-muted-foreground">// Your background</div>
                <div className="mt-1 line-clamp-2">5 years product design, fintech &amp; SaaS. Led design systems at Stripe-style startups…</div>
              </div>
              <div className="mt-5 rounded-2xl border border-foreground/20 bg-foreground/[0.03] p-5">
                <div className="flex items-center gap-2 text-sm font-semibold"><Zap className="h-4 w-4" /> ATS Match Score</div>
                <div className="mt-3 flex items-end gap-3">
                  <div className="font-display text-5xl">92</div>
                  <div className="pb-1 text-xs text-muted-foreground">/ 100 — Excellent match</div>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-[92%] bg-foreground" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6">
        <div className="text-center">
          <h2 className="font-display text-3xl tracking-tight sm:text-4xl">Built for the modern job hunt.</h2>
          <p className="mt-3 text-muted-foreground">Most CVs get filtered before a human sees them. We fix that.</p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {[
            ["75%", "of CVs are rejected by ATS before a recruiter sees them."],
            ["3×", "more interviews when your CV is tailored per role."],
            ["60s", "to generate a fully tailored CV and cover letter."],
          ].map(([n, d]) => (
            <div key={n} className="rounded-3xl border border-border/70 bg-card p-8 text-center">
              <div className="font-display text-5xl tracking-tight">{n}</div>
              <div className="mt-3 text-sm text-muted-foreground">{d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6">
        <div className="rounded-3xl bg-foreground p-12 text-background sm:p-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-4xl tracking-tight sm:text-5xl">Your next job is one paste away.</h2>
            <p className="mt-4 text-background/70">Free forever. Premium when you're ready for unlimited generations and saved history.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/signup"><Button size="lg" variant="secondary" className="rounded-full">Create free account</Button></Link>
              <a href="/library"><Button size="lg" variant="outline" className="rounded-full border-background/30 bg-transparent text-background hover:bg-background hover:text-foreground">Browse prompt library</Button></a>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
