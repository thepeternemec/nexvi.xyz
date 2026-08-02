import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const TITLE = "How to Write a Resume in 2026 (Step-by-Step + Examples)";
const DESCRIPTION =
  "A step-by-step guide to writing a resume that passes ATS filters: structure, wording, keywords, role-specific examples and a free ATS score check.";
const URL = "https://applywise.eu/blog/how-to-write-a-resume";

const STEPS = [
  {
    title: "1. Start from the job description, not a template",
    body: "Applicant tracking systems rank your resume on overlap with the posting. Paste the job description next to your draft and mirror its exact job title, tools and responsibilities wherever they honestly apply to your experience.",
  },
  {
    title: "2. Use a single-column, ATS-safe layout",
    body: "One column, standard section headings (Summary, Experience, Skills, Education), no tables, text boxes, icons or images, and a common font. Save as PDF unless the posting asks for .docx.",
  },
  {
    title: "3. Write a 3-line summary that names the role",
    body: "Open with your job title, years of experience and two proof points with numbers. Example: \"Marketing manager with 6 years in B2B SaaS. Grew organic pipeline 62% in 12 months and cut CAC by 18%.\"",
  },
  {
    title: "4. Turn duties into achievements with numbers",
    body: "Use the formula action verb + what you did + measurable result. \"Responsible for reporting\" becomes \"Rebuilt weekly reporting in Looker, cutting manual prep from 6 hours to 20 minutes.\"",
  },
  {
    title: "5. Match keywords honestly, in context",
    body: "List the tools, methods and certifications named in the posting inside real bullet points, not a keyword block. Include both spelled-out and abbreviated forms once, such as \"search engine optimization (SEO)\".",
  },
  {
    title: "6. Keep it to one or two pages",
    body: "One page for under 10 years of experience, two pages beyond that. Cut roles older than 12–15 years to a single line each and drop anything unrelated to the target job.",
  },
  {
    title: "7. Score it before you send it",
    body: "Run the finished resume and the job description through an ATS checker, fix missing critical keywords and formatting warnings, then export. Repeat this per application — one generic resume cannot beat a tailored one.",
  },
];

const EXAMPLES = [
  {
    role: "Software engineer",
    before: "Worked on the backend team and helped improve performance.",
    after:
      "Cut p95 API latency 480ms → 120ms by adding Redis caching and query indexes across 14 Node.js services used by 2M monthly users.",
  },
  {
    role: "Sales / account executive",
    before: "Sold software to enterprise customers and hit targets.",
    after:
      "Closed €1.8M new ARR at 112% of quota in FY25, building a 40-account enterprise pipeline in DACH from outbound.",
  },
  {
    role: "Marketing manager",
    before: "Managed social media, email campaigns and the blog.",
    after:
      "Grew email list 8k → 46k in 18 months with a 31% average open rate, driving 24% of all trial signups.",
  },
  {
    role: "Nurse / healthcare",
    before: "Cared for patients on a busy ward.",
    after:
      "Led care for a 28-bed cardiac unit across 12-hour shifts, cutting documented medication errors to zero over 14 months.",
  },
  {
    role: "Recent graduate",
    before: "University degree, some internships and volunteering.",
    after:
      "BSc Economics (2:1, Distinction thesis). Built a Python model in a 3-month internship that reduced forecast error 22%; led a 40-volunteer campus fundraiser raising €11k.",
  },
];

const FAQS = [
  {
    q: "What is the best resume format for ATS?",
    a: "A reverse-chronological, single-column layout with standard headings (Summary, Experience, Skills, Education) saved as a PDF. Avoid tables, columns, headers/footers, text boxes, icons and graphics — parsers frequently drop that content.",
  },
  {
    q: "How long should a resume be?",
    a: "One page if you have less than about 10 years of relevant experience, two pages beyond that. Recruiters scan for 6–8 seconds first, so put the strongest, most role-relevant evidence in the top third of page one.",
  },
  {
    q: "Should I tailor my resume for every job?",
    a: "Yes. ATS ranking is based on the overlap between your resume and that specific posting, so a tailored version consistently scores higher than one generic file. Tailoring the summary, skills and top five bullets is usually enough.",
  },
  {
    q: "How many keywords should I include?",
    a: "Cover every critical requirement in the posting at least once, in a real sentence. Aim for roughly 70–80% coverage of the required skills you genuinely have; keyword stuffing is penalised by recruiters even when the parser accepts it.",
  },
  {
    q: "Do I need a photo, address or date of birth?",
    a: "In the US, UK and Ireland, no — leave all three off. In parts of continental Europe a photo is still common, but city and country is enough for the address, and date of birth is never required.",
  },
  {
    q: "Is it OK to write a resume with AI?",
    a: "Yes, as long as every claim is true and the final text sounds like you. Use AI to align your real experience with the posting and to check ATS coverage, then edit the wording so it reads naturally.",
  },
];

export const Route = createFileRoute("/blog/how-to-write-a-resume")({
  head: () => ({
    meta: [
      { title: "How to Write a Resume in 2026 — Step-by-Step Guide" },
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
          mainEntityOfPage: { "@type": "WebPage", "@id": URL },
          author: { "@type": "Organization", name: "ApplyWise", url: "https://applywise.eu" },
          publisher: { "@type": "Organization", name: "ApplyWise", url: "https://applywise.eu" },
          inLanguage: "en",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "How to write a resume that passes ATS filters",
          description: DESCRIPTION,
          step: STEPS.map((s, i) => ({
            "@type": "HowToStep",
            position: i + 1,
            name: s.title.replace(/^\d+\.\s*/, ""),
            text: s.body,
            url: `${URL}#step-${i + 1}`,
          })),
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
            { "@type": "ListItem", position: 1, name: "Home", item: "https://applywise.eu/" },
            { "@type": "ListItem", position: 2, name: "Blog", item: "https://applywise.eu/blog" },
            { "@type": "ListItem", position: 3, name: "How to write a resume", item: URL },
          ],
        }),
      },
    ],
  }),
  component: ResumeGuidePage,
});

function ResumeGuidePage() {
  return (
    <SiteShell>
      <article className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-signal" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-[0.5] mask-fade-b" />

        <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
          <nav aria-label="Breadcrumb" className="text-[12px] text-muted-foreground">
            <a href="/" className="hover:text-primary">Home</a> <span aria-hidden="true">/</span>{" "}
            <a href="/blog" className="hover:text-primary">Blog</a> <span aria-hidden="true">/</span>{" "}
            <span className="text-foreground">How to write a resume</span>
          </nav>

          <h1 className="mt-5 font-display text-3xl leading-[1.1] tracking-tight sm:text-5xl">
            How to write a resume in 2026
          </h1>
          <p className="mt-5 text-[17px] leading-relaxed text-muted-foreground">
            Most resumes are rejected by software before a human reads them. This guide covers the seven steps that
            decide whether yours gets through: structure, wording, measurable achievements, keyword coverage, length,
            and how to score the result against the job description before you send it.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="cta-sheen">
              <a href="/cv">
                Generate a tailored CV <ArrowRight className="ml-1.5 h-4 w-4" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="/ats">Check my ATS score</a>
            </Button>
          </div>

          {/* Key takeaways — answer-engine friendly summary */}
          <section className="mt-14">
            <h2 className="font-display text-2xl tracking-tight">Key takeaways</h2>
            <ul className="mt-5 space-y-3 text-[15px] leading-relaxed text-muted-foreground">
              {[
                "Tailor the summary, skills and top bullets to each job description — ATS ranking is based on overlap with that posting.",
                "Use a single-column, reverse-chronological layout with standard section headings and no tables or graphics.",
                "Write achievements with numbers, not duty descriptions.",
                "One page under ~10 years of experience, two pages beyond that.",
                "Score the resume against the posting and fix missing critical keywords before applying.",
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Steps */}
          <section className="mt-16">
            <h2 className="font-display text-2xl tracking-tight">The seven steps</h2>
            <div className="mt-6 space-y-px overflow-hidden rounded-2xl border border-border bg-border">
              {STEPS.map((s, i) => (
                <div key={s.title} id={`step-${i + 1}`} className="bg-background px-6 py-6">
                  <h3 className="text-[15px] font-semibold tracking-tight">{s.title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">{s.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Examples */}
          <section className="mt-16">
            <h2 className="font-display text-2xl tracking-tight">Before and after, by role</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
              The same experience, rewritten as evidence. Use these as patterns for your own bullets.
            </p>
            <div className="mt-6 space-y-px overflow-hidden rounded-2xl border border-border bg-border">
              {EXAMPLES.map((e) => (
                <div key={e.role} className="bg-background px-6 py-6">
                  <h3 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-primary">{e.role}</h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
                    <span className="font-semibold text-foreground">Before:</span> {e.before}
                  </p>
                  <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
                    <span className="font-semibold text-foreground">After:</span> {e.after}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="mt-16">
            <h2 className="font-display text-2xl tracking-tight">Resume FAQ</h2>
            <div className="mt-6 space-y-px overflow-hidden rounded-2xl border border-border bg-border">
              {FAQS.map((f) => (
                <div key={f.q} className="bg-background px-6 py-6">
                  <h3 className="text-[15px] font-semibold tracking-tight">{f.q}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="mt-16 rounded-2xl border border-border bg-background/70 p-8 backdrop-blur">
            <h2 className="font-display text-2xl tracking-tight">Do all seven steps in one run</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
              Paste a job description and your current CV. ApplyWise rewrites the CV around the role, drafts a matching
              cover letter and scores the result against ATS criteria with specific fixes.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg" className="cta-sheen">
                <a href="/cv">
                  Generate my CV free <ArrowRight className="ml-1.5 h-4 w-4" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="/library">Browse job-search prompts</a>
              </Button>
            </div>
          </section>
        </div>
      </article>
    </SiteShell>
  );
}
