import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const TITLE = "ATS Optimization + AI Humanizer: Beating AI HR Screening in 2026";
const DESCRIPTION =
  "How AI HR tools screen applications in 2026, why ATS optimization alone is no longer enough, and how humanizing AI-written CVs and cover letters keeps you in the shortlist.";
const URL = "https://nexvi.xyz/blog/ats-optimization-and-ai-humanizer";

const STAGES = [
  {
    title: "1. Parsing — the machine reads before a human does",
    body: "The tracking system converts your file into structured fields: title, employer, dates, skills, education. Multi-column layouts, tables, text boxes, headers and graphics break this step, and anything the parser drops simply does not exist for the rest of the process.",
  },
  {
    title: "2. Keyword and requirement matching",
    body: "Your parsed profile is scored against the posting's required skills, tools, seniority and location. This is where most applications quietly die: the experience is there, but it is worded differently from the job description.",
  },
  {
    title: "3. AI ranking and summarisation",
    body: "In 2026 most large employers layer an LLM on top of the ATS. It writes a short summary of each candidate, answers screening questions from your text and ranks the pool. Vague, duty-based bullets summarise badly; specific, measurable ones summarise well.",
  },
  {
    title: "4. AI-content and authenticity signals",
    body: "Recruiting suites increasingly flag applications that read as machine-generated — uniform sentence length, generic superlatives, template phrasing repeated across thousands of submissions. Flagged does not always mean rejected, but it removes the trust advantage.",
  },
  {
    title: "5. Human review of a very short list",
    body: "A recruiter sees six to ten profiles and spends seconds on each. At this point only two things matter: does the top third of the document prove you can do this specific job, and does it sound like a person wrote it.",
  },
];

const WHY_HUMANIZER = [
  {
    role: "Uniform rhythm",
    before:
      "I am a highly motivated professional with a proven track record of delivering exceptional results in fast-paced environments.",
    after:
      "I have spent six years running B2B SaaS demand generation — most recently taking organic pipeline from €0.9M to €1.5M in four quarters.",
  },
  {
    role: "Generic enthusiasm",
    before: "I am passionate about your company's innovative mission and culture of excellence.",
    after:
      "Your move into DACH mid-market is the part I want in on: I built the same motion at Kontor and it is where I do my best work.",
  },
  {
    role: "Stacked buzzwords",
    before: "Leveraged cross-functional synergies to optimise stakeholder-facing deliverables end to end.",
    after: "Ran the weekly release review with engineering, support and sales, cutting escalations 34% in two quarters.",
  },
];

const CHECKLIST = [
  "Single-column, reverse-chronological layout with standard headings so the parser gets every field.",
  "Cover the posting's critical requirements in real sentences — aim for high coverage of what you honestly have.",
  "Quantify at least half your bullets; AI summarisers repeat numbers and drop adjectives.",
  "Mirror the exact job title and the tools named in the posting, both spelled out and abbreviated once.",
  "Run the final text through a humanizer so the wording keeps your voice and reads as human-written.",
  "Re-score after humanizing to confirm keyword coverage survived the rewrite.",
];

const FAQS = [
  {
    q: "What is ATS optimization?",
    a: "ATS optimization is preparing a CV and cover letter so an applicant tracking system can parse them correctly and score them highly against a specific job description: a single-column layout, standard section headings, and wording that mirrors the posting's required skills, tools and job title.",
  },
  {
    q: "Do AI HR tools detect AI-written CVs?",
    a: "Many recruiting suites now include AI-content signals, and recruiters spot template phrasing on sight. Detection is probabilistic rather than definitive, but generic machine phrasing weakens an otherwise strong application, which is why humanizing the output matters.",
  },
  {
    q: "What does an AI text humanizer actually change?",
    a: "It varies sentence length and rhythm, replaces generic superlatives with concrete evidence, removes template phrasing, and restores a consistent personal voice — while keeping the facts, keywords and structure that the ATS scores.",
  },
  {
    q: "Does humanizing text hurt my ATS score?",
    a: "It should not. Keywords live in the nouns — tools, titles, certifications, metrics — and a good humanizer preserves them while rewriting the connective language. Always re-run the ATS check after humanizing to confirm coverage held.",
  },
  {
    q: "Is it against the rules to use AI for job applications?",
    a: "Using AI to align your real experience with a posting is normal and accepted. Inventing experience, employers or credentials is not — that is what gets candidates removed at reference or interview stage.",
  },
  {
    q: "What ATS score should I aim for?",
    a: "Treat 80% and above as application-ready for a role you are genuinely qualified for. Below roughly 60% usually means either a formatting problem or a real gap between your experience and the posting's core requirements.",
  },
];

export const Route = createFileRoute("/blog/ats-optimization-and-ai-humanizer")({
  head: () => ({
    meta: [
      { title: "ATS Optimization + AI Humanizer — Beat AI HR Screening" },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: TITLE,
          description: DESCRIPTION,
          datePublished: "2026-08-02",
          mainEntityOfPage: { "@type": "WebPage", "@id": URL },
          author: { "@type": "Organization", name: "Nexvi", url: "https://nexvi.xyz" },
          publisher: { "@type": "Organization", name: "Nexvi", url: "https://nexvi.xyz" },
          inLanguage: "en",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://nexvi.xyz/" },
            { "@type": "ListItem", position: 2, name: "Blog", item: "https://nexvi.xyz/blog" },
            { "@type": "ListItem", position: 3, name: "ATS optimization and AI humanizer", item: URL },
          ],
        }),
      },
    ],
  }),
  component: AtsHumanizerPost,
});

function AtsHumanizerPost() {
  return (
    <SiteShell>
      <article className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-signal" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-[0.5] mask-fade-b" />

        <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
          <nav aria-label="Breadcrumb" className="text-[12px] text-muted-foreground">
            <a href="/" className="hover:text-primary">Home</a> <span aria-hidden="true">/</span>{" "}
            <a href="/blog" className="hover:text-primary">Blog</a> <span aria-hidden="true">/</span>{" "}
            <span className="text-foreground">ATS optimization and the AI humanizer</span>
          </nav>

          <h1 className="mt-5 font-display text-3xl leading-[1.1] tracking-tight sm:text-5xl">
            ATS optimization and why the humanizer matters when AI screens your application
          </h1>
          <p className="mt-5 text-[17px] leading-relaxed text-muted-foreground">
            Hiring in 2026 runs through two machines before a person is involved: an applicant tracking system that
            parses and scores your documents, and a language model that summarises and ranks you against everyone else.
            ATS optimization gets you past the first. Sounding human gets you past the second.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="cta-sheen">
              <a href="/ats">
                Check my ATS score <ArrowRight className="ml-1.5 h-4 w-4" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="/humanizer">Try AI text Humanizer</a>
            </Button>
          </div>

          <section className="mt-14">
            <h2 className="font-display text-2xl tracking-tight">Key takeaways</h2>
            <ul className="mt-5 space-y-3 text-[15px] leading-relaxed text-muted-foreground">
              {[
                "AI HR screening has two gates: machine parsing and keyword scoring, then LLM ranking and authenticity signals.",
                "ATS optimization is about structure and wording overlap with the specific posting — not a nicer template.",
                "Generic AI phrasing is the new rejection risk: it summarises badly and reads like a template.",
                "Humanizing keeps the facts and keywords but restores your voice, sentence rhythm and specificity.",
                "Score, humanize, then re-score — that order keeps both machines and the recruiter on your side.",
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-16">
            <h2 className="font-display text-2xl tracking-tight">How AI HR screening actually works</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
              Five stages sit between your submission and a recruiter's shortlist. Each one filters differently, and a
              document tuned for only one of them stalls at the next.
            </p>
            <div className="mt-6 space-y-px overflow-hidden rounded-2xl border border-border bg-border">
              {STAGES.map((s, i) => (
                <div key={s.title} id={`stage-${i + 1}`} className="bg-background px-6 py-6">
                  <h3 className="text-[15px] font-semibold tracking-tight">{s.title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">{s.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-16">
            <h2 className="font-display text-2xl tracking-tight">Why the humanizer is not cosmetic</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
              A high ATS score with template prose gets you read and then dismissed. These are the three patterns that
              mark text as machine-written, and what they look like once humanized.
            </p>
            <div className="mt-6 space-y-px overflow-hidden rounded-2xl border border-border bg-border">
              {WHY_HUMANIZER.map((e) => (
                <div key={e.role} className="bg-background px-6 py-6">
                  <h3 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-primary">{e.role}</h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
                    <span className="font-semibold text-foreground">AI-flat:</span> {e.before}
                  </p>
                  <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
                    <span className="font-semibold text-foreground">Humanized:</span> {e.after}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-16">
            <h2 className="font-display text-2xl tracking-tight">The pre-send checklist</h2>
            <ul className="mt-5 space-y-3 text-[15px] leading-relaxed text-muted-foreground">
              {CHECKLIST.map((c) => (
                <li key={c} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-16">
            <h2 className="font-display text-2xl tracking-tight">ATS and AI screening FAQ</h2>
            <div className="mt-6 space-y-px overflow-hidden rounded-2xl border border-border bg-border">
              {FAQS.map((f) => (
                <div key={f.q} className="bg-background px-6 py-6">
                  <h3 className="text-[15px] font-semibold tracking-tight">{f.q}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-16 rounded-2xl border border-border bg-background/70 p-8 backdrop-blur">
            <h2 className="font-display text-2xl tracking-tight">Score it, humanize it, send it</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
              Paste the job description and your CV. Nexvi scores keyword coverage and formatting with specific
              fixes, then the Humanizer rewrites the result so it keeps every keyword and still sounds like you.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg" className="cta-sheen">
                <a href="/ats">
                  Run the ATS Optimizer <ArrowRight className="ml-1.5 h-4 w-4" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="/blog/how-to-write-a-resume">Read: how to write a resume in 2026</a>
              </Button>
            </div>
          </section>
        </div>
      </article>
    </SiteShell>
  );
}
