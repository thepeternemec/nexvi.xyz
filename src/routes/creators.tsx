import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { creators, prompts } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";

const CREATORS_TITLE = "Career Coaches Behind ApplyWise Prompts";
const CREATORS_DESC =
  "Meet the ex-recruiters, career coaches and interview psychologists who write the CV, cover letter and ATS prompts in the ApplyWise library.";

export const Route = createFileRoute("/creators")({
  head: () => ({
    meta: [
      { title: CREATORS_TITLE },
      { name: "description", content: CREATORS_DESC },
      { property: "og:title", content: CREATORS_TITLE },
      { property: "og:description", content: CREATORS_DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://applywise.eu/creators" },
      { name: "twitter:title", content: CREATORS_TITLE },
      { name: "twitter:description", content: CREATORS_DESC },
    ],
    links: [{ rel: "canonical", href: "https://applywise.eu/creators" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: CREATORS_TITLE,
          url: "https://applywise.eu/creators",
          description: CREATORS_DESC,
          mainEntity: {
            "@type": "ItemList",
            name: "ApplyWise career coaches",
            numberOfItems: creators.length,
            itemListElement: creators.map((c, i) => ({
              "@type": "ListItem",
              position: i + 1,
              item: {
                "@type": "Person",
                name: c.name,
                description: c.bio,
                jobTitle: "Career coach",
              },
            })),
          },
        }),
      },
    ],
  }),
  component: Creators,
});

export function Creators() {
  return (
    <SiteShell>
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-foreground/[0.04] via-background to-background dark:from-foreground/[0.08]" />
        <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Career Coaches</div>
          <h1 className="font-display mt-2 text-5xl tracking-tight sm:text-6xl">People who've helped thousands get hired.</h1>
          <p className="mt-3 max-w-xl text-muted-foreground">Ex-recruiters, career coaches, and interview psychologists building the prompts that power getHeired.</p>
        </div>
      </section>
      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {creators.map(c => {
            const count = prompts.filter(p => p.creatorId === c.id).length;
            return (
              <div key={c.id} className="rounded-3xl border border-border/70 bg-card p-6">
                <div className="flex items-center gap-4">
                  <div className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-base font-semibold text-white">{c.avatar}</div>
                  <div>
                    <div className="font-medium">{c.name} {c.verified && <span className="text-xs text-violet-600">✓</span>}</div>
                    <div className="text-xs text-muted-foreground">{c.handle}</div>
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">{c.bio}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{count} prompts</span><span>{(c.followers/1000).toFixed(1)}k followers</span>
                </div>
                <Button variant="outline" className="mt-5 w-full rounded-full">View profile</Button>
              </div>
            );
          })}
        </div>

        <div className="mt-16 rounded-3xl border border-border bg-foreground p-10 text-background">
          <h2 className="font-display text-3xl tracking-tight sm:text-4xl">Are you a career coach?</h2>
          <p className="mt-2 max-w-xl text-background/80">Publish your prompts on getHeired and reach thousands of job seekers. We handle the platform; you keep 80% of every sale.</p>
          <Link to="/signup"><Button size="lg" variant="secondary" className="mt-5 rounded-full">Apply to become a coach</Button></Link>
        </div>
      </section>
    </SiteShell>
  );
}
