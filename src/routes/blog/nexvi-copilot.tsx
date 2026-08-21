import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const TITLE = "Nexvi Copilot: One Chat for Your Entire Job Search";
const DESCRIPTION =
  "Nexvi Copilot puts CV generation, cover letters, ATS scoring, humanizer and prompt library inside one chat workspace that remembers your resume and the job description.";
const URL = "https://nexvi.xyz/blog/nexvi-copilot";

const PROBLEM = [
  {
    title: "Templates that ignore the posting",
    body: "A generic CV never scores well against a specific job description. ATS filters reward overlap, and recruiters reward relevance. Most tools produce one document and leave the tailoring to you.",
  },
  {
    title: "Five tabs, five logins",
    body: "Job seekers jump between a CV builder, a cover letter generator, a keyword checker, an AI humanizer and a notes app. Context gets lost, and every tool asks for the same inputs again.",
  },
  {
    title: "Output that sounds like a machine",
    body: "Even good AI writers can fall into uniform sentence length and generic phrasing. When the same templates reach thousands of candidates, the result stops feeling personal.",
  },
];

const FEATURES = [
  {
    title: "CV Generator",
    body: "Paste a job description and your background. Copilot rewrites your experience as role-specific, measurable bullets and exports a clean PDF ready for ATS parsing.",
  },
  {
    title: "Cover Letter Lab",
    body: "Builds a letter that connects your evidence to the company's stated needs, not a generic introduction. One click copies or downloads the result.",
  },
  {
    title: "ATS Optimizer",
    body: "Scores your CV against the posting and returns a match percentage plus a concrete breakdown: missing keywords, formatting risks and keyword coverage by section.",
  },
  {
    title: "AI Humanizer",
    body: "Takes AI-written text and restores sentence rhythm, specificity and your own voice while keeping the facts and keywords intact.",
  },
  {
    title: "Prompt Library",
    body: "Browse job-search prompts for networking, recruiter outreach, interview prep and salary negotiation, then run any of them without leaving the chat.",
  },
  {
    title: "Ask Copilot",
    body: "Ask follow-up questions about your documents, the role or the hiring process. Gemini Flash Lite answers from the context of your saved resume and current job description.",
  },
];

const WORKFLOW = [
  {
    title: "1. Upload your background once",
    body: "Add your CV or work history to the context panel. It stays attached to every thread, so you never have to re-paste the same information.",
  },
  {
    title: "2. Paste the job description",
    body: "Copilot uses the posting as the north star. Every tool it runs is scored against that role's required skills, tools and responsibilities.",
  },
  {
    title: "3. Pick a tool or just ask",
    body: "Switch between CV, cover letter, ATS, humanizer and prompt modes from the sidebar, or type a natural request and let Copilot route it.",
  },
  {
    title: "4. Iterate in the same thread",
    body: "Each conversation keeps the full history. Refine the tone, add a missing project, shorten a section or re-score after edits — all without starting over.",
  },
];

const FAQS = [
  {
    q: "What is Nexvi Copilot?",
    a: "Nexvi Copilot is a unified chat workspace for job applications. It combines a CV generator, cover letter writer, ATS optimizer, AI humanizer, prompt library and Q&A assistant in one interface that shares your resume and job description across every tool.",
  },
  {
    q: "Do I need to sign in to use Copilot?",
    a: "You can try Copilot without an account. Creating a free account lets you save your resume, keep chat threads and unlock higher usage limits.",
  },
  {
    q: "How is Copilot different from ChatGPT for job applications?",
    a: "Copilot is purpose-built for the job search workflow. It has structured tools that generate ATS-friendly documents, score them against a real posting, and store your background so you do not have to paste it repeatedly.",
  },
  {
    q: "Can I download my CV and cover letter?",
    a: "Yes. Every generated document has a download button that exports a clean PDF formatted for applicant tracking systems.",
  },
  {
    q: "What does the ATS score mean?",
    a: "The ATS score measures how well your CV matches a specific job description across keyword coverage, formatting safety and required skills. It is role-specific, not a generic grade.",
  },
  {
    q: "Is my resume stored securely?",
    a: "Saved resumes are tied to your account and stored in the backend database with row-level security. You can delete your data at any time from your account settings.",
  },
];

export const Route = createFileRoute("/blog/nexvi-copilot")({
  head: () => ({
    meta: [
      { title: "Nexvi Copilot — One Chat for Your Entire Job Search" },
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
          datePublished: "2026-08-20",
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
            { "@type": "ListItem", position: 3, name: "Nexvi Copilot", item: URL },
          ],
        }),
      },
    ],
  }),
  component: CopilotPost,
});

export function CopilotPost() {
  return (
    <SiteShell>
      <article className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-signal" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-[0.5] mask-fade-b" />

        <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
          <nav aria-label="Breadcrumb" className="text-[12px] text-muted-foreground">
            <a href="/" className="hover:text-primary">Home</a> <span aria-hidden="true">/</span>{" "}
            <a href="/blog" className="hover:text-primary">Blog</a> <span aria-hidden="true">/</span>{" "}
            <span className="text-foreground">Nexvi Copilot</span>
          </nav>

          <h1 className="mt-5 font-display text-3xl leading-[1.1] tracking-tight sm:text-5xl">
            Nexvi Copilot: one chat for your entire job search
          </h1>
          <p className="mt-5 text-[17px] leading-relaxed text-muted-foreground">
            Most job-search tools are built as separate apps. A CV builder here, a cover letter generator there, a keyword
            checker somewhere else. Nexvi Copilot brings CV generation, cover letters, ATS scoring, humanizer and prompt
            library into one chat workspace — and keeps your resume and the job description in context the whole time.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="cta-sheen">
              <a href="/copilot">
                Open Copilot <ArrowRight className="ml-1.5 h-4 w-4" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="/pricing">See plans</a>
            </Button>
          </div>

          <section className="mt-14">
            <h2 className="font-display text-2xl tracking-tight">Key takeaways</h2>
            <ul className="mt-5 space-y-3 text-[15px] leading-relaxed text-muted-foreground">
              {[
                "Copilot unifies CV, cover letter, ATS, humanizer, prompts and Q&A in one chat interface.",
                "Your resume and the job description stay attached to every thread, so tools share context.",
                "Each tool is scored against the real posting, not against generic advice.",
                "Thread-based history lets you iterate without losing earlier versions or starting from scratch.",
                "Generated documents export as ATS-safe PDFs with one click.",
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-16">
            <h2 className="font-display text-2xl tracking-tight">The problem with scattered tools</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
              Job seekers do not struggle because they lack tools. They struggle because the tools do not talk to each
              other. Here is what breaks when every step lives in a different tab.
            </p>
            <div className="mt-6 space-y-px overflow-hidden rounded-2xl border border-border bg-border">
              {PROBLEM.map((s) => (
                <div key={s.title} className="bg-background px-6 py-6">
                  <h3 className="text-[15px] font-semibold tracking-tight">{s.title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">{s.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-16">
            <h2 className="font-display text-2xl tracking-tight">What Copilot can do</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
              Each mode is a tool, but they all share the same context. You can switch between them in the sidebar or
              ask for what you need in plain language.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {FEATURES.map((f) => (
                <div key={f.title} className="rounded-2xl border border-border bg-background px-6 py-5">
                  <h3 className="text-[15px] font-semibold tracking-tight text-primary">{f.title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">{f.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-16">
            <h2 className="font-display text-2xl tracking-tight">How it works</h2>
            <div className="mt-6 space-y-px overflow-hidden rounded-2xl border border-border bg-border">
              {WORKFLOW.map((s, i) => (
                <div key={s.title} id={`step-${i + 1}`} className="bg-background px-6 py-6">
                  <h3 className="text-[15px] font-semibold tracking-tight">{s.title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">{s.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-16">
            <h2 className="font-display text-2xl tracking-tight">Built for the way people actually apply</h2>
            <ul className="mt-5 space-y-3 text-[15px] leading-relaxed text-muted-foreground">
              {[
                "Mobile-first layout: the workspace adapts to small screens and starts with context collapsed so the chat stays readable.",
                "Persistent threads: come back later and your conversation, resume and job description are still there.",
                "Context-aware answers: Ask Copilot draws on your uploaded background and the active posting, not just general advice.",
                "No template lock-in: every output can be edited, regenerated or humanized before you download it.",
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-16">
            <h2 className="font-display text-2xl tracking-tight">Copilot FAQ</h2>
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
            <h2 className="font-display text-2xl tracking-tight">Try Copilot on your next application</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
              Upload your CV, paste a job description, and run every Nexvi tool from one chat. No credit card required
              to start.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg" className="cta-sheen">
                <a href="/copilot">
                  Open Copilot free <ArrowRight className="ml-1.5 h-4 w-4" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="/blog/how-to-write-a-resume">Read: how to write a resume</a>
              </Button>
            </div>
          </section>
        </div>
      </article>
    </SiteShell>
  );
}
