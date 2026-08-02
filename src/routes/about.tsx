import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, Gauge, Globe2, ShieldCheck, Sparkles, Target } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About ApplyWise — AI that aligns your CV to the job" },
      {
        name: "description",
        content:
          "ApplyWise builds AI tools that align CVs and cover letters to real job descriptions and score them against ATS filters. Meet the mission, principles and team.",
      },
      { property: "og:title", content: "About ApplyWise" },
      {
        property: "og:description",
        content: "Why we build AI tools that align CVs and cover letters to the job description, not generic resume templates.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://applywise.eu/about" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://applywise.eu/about" }],
  }),
  component: AboutPage,
});

const STATS = [
  ["50,000+", "candidates helped"],
  ["60s", "to a tailored CV"],
  ["5", "languages supported"],
  ["2", "frontier models"],
];

const PRINCIPLES = [
  {
    icon: Target,
    title: "Alignment over templates",
    body: "A beautiful CV that ignores the job description still gets filtered out. Every tool starts from the role you are applying for.",
  },
  {
    icon: Gauge,
    title: "Measurable, not vibes",
    body: "ATS scoring breaks results into keywords, formatting and length so you can see exactly what to fix before you send.",
  },
  {
    icon: Bot,
    title: "Frontier models only",
    body: "Our generators run on the latest Claude and GPT models, so output reads like a person wrote it — because you did.",
  },
  {
    icon: ShieldCheck,
    title: "Your data stays yours",
    body: "We never sell your data, never train on your CV, and keep only what you ask us to keep in your account.",
  },
  {
    icon: Globe2,
    title: "Built for cross-border careers",
    body: "English, German, Spanish, Italian and French — because the best role is often in another market.",
  },
  {
    icon: Sparkles,
    title: "Fast beats perfect",
    body: "Applications compound. We optimise for getting a strong, tailored application out today, not next weekend.",
  },
];

const TIMELINE = [
  [
    "It started open source",
    "We released our first prompt library for free as promptacademia.com. By April 2026 thousands of job seekers were using it to rewrite their CVs — proof that the demand was for alignment, not another template.",
  ],
  [
    "From prompts to products",
    "In June we put frontier AI models behind the best-performing prompts, turning them into two real tools: a CV generator that optimises your experience against the job text, and a cover letter writer that references the actual role.",
  ],
  [
    "Beating the bots",
    "The same story kept appearing in our inbox and across social feeds: strong candidates filtered out before a human ever looked. So through June and July we used the top AI models to build the ATS Optimizer and the Humanizer — one shows exactly why you are being screened out, the other makes the writing sound like you again.",
  ],
];

export function AboutPage() {
  return (
    <SiteShell>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-signal" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-[0.55] mask-fade-b" />
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-[11px] font-medium tracking-wide text-muted-foreground backdrop-blur">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 rounded-full bg-primary/60 motion-safe:animate-ping" />
                <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              About ApplyWise
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-6 max-w-3xl font-display text-4xl leading-[1.08] tracking-tight sm:text-6xl">
              We align your experience with the job that is actually open.
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-muted-foreground">
              ApplyWise is not a resume builder. It is an AI layer between your experience and a specific job
              description — rewriting, scoring and humanizing your application so it survives the ATS and reads like
              you at your best.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="cta-sheen">
                <a href="/cv">
                  Generate my CV <ArrowRight className="ml-1.5 h-4 w-4" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="/library">Browse the prompt library</a>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Stats — hairline grid */}
      <section className="border-y border-border">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-2 divide-border sm:grid-cols-4 sm:divide-x">
          {STATS.map(([value, label], i) => (
            <Reveal key={label} delay={i * 70} className="border-b border-border px-6 py-8 sm:border-b-0">
              <div className="font-display text-3xl tracking-tight">{value}</div>
              <div className="mt-1 text-[13px] text-muted-foreground">{label}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid gap-12 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <Reveal>
            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Our mission</div>
            <h2 className="mt-4 font-display text-3xl leading-tight tracking-tight sm:text-4xl">
              Hiring filters shouldn't decide your career.
            </h2>
          </Reveal>
          <Reveal delay={90} className="space-y-4 text-[15px] leading-relaxed text-muted-foreground">
            <p>
              Most strong candidates are rejected before a human reads a word. Applicant tracking systems rank on
              keyword overlap, structure and clarity — signals that have nothing to do with whether you can do the job.
            </p>
            <p>
              We built ApplyWise so that gap closes in a minute instead of a weekend. Paste the job description, and our
              tools rewrite your CV around it, draft a cover letter that references the actual role, score the result
              against ATS criteria and tell you precisely what to fix.
            </p>
            <p className="text-foreground">
              The goal is simple: more interviews, less guesswork, no fabricated experience.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Principles */}
      <section className="border-t border-border">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
          <Reveal>
            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              What we optimise for
            </div>
            <h2 className="mt-4 max-w-2xl font-display text-3xl leading-tight tracking-tight sm:text-4xl">
              Six principles behind every tool we ship.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {PRINCIPLES.map(({ icon: Icon, title, body }, i) => (
              <Reveal key={title} delay={i * 60} className="group bg-background p-7 transition-colors hover:bg-foreground/[0.02]">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-foreground/[0.03] text-primary transition-transform group-hover:-translate-y-0.5">
                  <Icon className="h-4 w-4" />
                </span>
                <h3 className="mt-5 text-[15px] font-semibold tracking-tight">{title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">{body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="border-t border-border">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
          <Reveal>
            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">How we got here</div>
          </Reveal>
          <div className="mt-10 space-y-px overflow-hidden rounded-2xl border border-border bg-border">
            {TIMELINE.map(([title, body], i) => (
              <Reveal key={title} delay={i * 80} className="grid gap-2 bg-background px-7 py-7 sm:grid-cols-[110px_minmax(0,1fr)] sm:gap-8">
                <div className="font-mono text-[12px] tracking-[0.14em] text-primary">0{i + 1}</div>
                <div>
                  <div className="text-[15px] font-semibold tracking-tight">{title}</div>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-muted-foreground">{body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border">
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-signal" />
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-20 sm:px-6 md:grid-cols-2 md:items-center">
            <Reveal>
              <h2 className="font-display text-3xl leading-tight tracking-tight sm:text-4xl">
                Your next job is a few clicks away.
              </h2>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
                Start free — no credit card, no template wizard. Paste a job description and see the difference in one
                run.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="cta-sheen">
                  <a href="/signup">
                    Create free account <ArrowRight className="ml-1.5 h-4 w-4" />
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href="/pricing">See pricing</a>
                </Button>
              </div>
            </Reveal>
            <Reveal delay={120} className="rounded-2xl border border-border bg-background/70 p-7 backdrop-blur-xl">
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Questions, ideas, feedback
              </div>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                We read every message and ship a surprising amount of what people ask for.
              </p>
              <a
                href="mailto:hello@applywise.eu"
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-foreground/[0.04] px-4 py-2 text-[13px] text-foreground transition hover:border-foreground/30 hover:text-primary"
              >
                hello@applywise.eu <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </Reveal>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
