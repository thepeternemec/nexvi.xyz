import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { blogPosts } from "@/lib/blog-posts";

const TITLE = "Nexvi Blog — Resume, ATS and job search guides";
const DESCRIPTION =
  "Practical guides on writing resumes and cover letters that pass ATS filters, tailored to real job descriptions.";
const URL = "https://nexvi.xyz/blog";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "Nexvi Blog",
          description: DESCRIPTION,
          url: URL,
          publisher: { "@type": "Organization", name: "Nexvi", url: "https://nexvi.xyz" },
          blogPost: blogPosts.map((p) => ({
            "@type": "BlogPosting",
            headline: p.title,
            description: p.excerpt,
            datePublished: p.date,
            url: `${URL}/${p.slug}`,
          })),
        }),
      },
    ],
  }),
  component: BlogIndexPage,
});

export function BlogIndexPage() {
  return (
    <SiteShell>
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-signal" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-[0.5] mask-fade-b" />

      <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
        <nav aria-label="Breadcrumb" className="text-[12px] text-muted-foreground">
          <a href="/" className="hover:text-primary">Home</a> <span aria-hidden="true">/</span>{" "}
          <span className="text-foreground">Blog</span>
        </nav>

        <h1 className="mt-5 font-display text-3xl leading-[1.1] tracking-tight sm:text-5xl">Blog</h1>
        <p className="mt-5 text-[17px] leading-relaxed text-muted-foreground">
          Guides on resumes, cover letters and getting past ATS filters — written from what actually moves a match
          score, not generic career advice.
        </p>

        <div className="mt-12 space-y-px overflow-hidden rounded-2xl border border-border bg-border">
          {blogPosts.map((post) => (
            <a
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block bg-background px-6 py-7 transition-colors hover:bg-muted/40"
            >
              <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                <span>{post.category}</span>
                <span className="text-muted-foreground/60" aria-hidden="true">·</span>
                <span className="text-muted-foreground">{post.readingTime}</span>
              </div>
              <h2 className="mt-3 font-display text-xl tracking-tight transition-colors group-hover:text-primary">
                {post.title}
              </h2>
              <p className="mt-2.5 text-[14px] leading-relaxed text-muted-foreground">{post.excerpt}</p>
              <span className="mt-4 inline-flex items-center text-[13px] font-medium text-primary">
                Read post <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </a>
          ))}
        </div>

        <section className="mt-14 rounded-2xl border border-border bg-background/70 p-8 backdrop-blur">
          <h2 className="font-display text-2xl tracking-tight">Skip the reading, run the tools</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            Paste a job description and your current CV. Nexvi rewrites it around the role and scores it against
            ATS criteria with specific fixes.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg" className="cta-sheen">
              <a href="/cv">
                Generate my CV free <ArrowRight className="ml-1.5 h-4 w-4" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="/ats">Check my ATS score</a>
            </Button>
          </div>
        </section>
      </div>
    </div>
    </SiteShell>
  );
}
