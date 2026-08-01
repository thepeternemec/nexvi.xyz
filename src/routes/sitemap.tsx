import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { prompts } from "@/lib/mock-data";

export const Route = createFileRoute("/sitemap")({
  head: () => ({
    meta: [
      { title: "Sitemap — ApplyWise" },
      { name: "description", content: "Browse every ApplyWise page: AI CV generator, cover letters, ATS optimizer, Humanizer, prompt library and account pages." },
      { property: "og:title", content: "ApplyWise Sitemap" },
      { property: "og:description", content: "Every page on ApplyWise in one place." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/sitemap" },
    ],
    links: [{ rel: "canonical", href: "/sitemap" }],
  }),
  component: SitemapPage,
});

const groups: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Tools",
    links: [
      { href: "/cv", label: "CV Generator" },
      { href: "/cover-letter", label: "Cover Letter Generator" },
      { href: "/humanizer", label: "Humanizer" },
      { href: "/ats", label: "ATS Optimizer" },
      { href: "/library", label: "Prompt Library" },
      { href: "/marketplace", label: "Browse all prompts" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/login", label: "Sign in" },
      { href: "/signup", label: "Create account" },
      { href: "/dashboard", label: "Dashboard" },
      { href: "/account", label: "Account settings" },
      { href: "/subscription", label: "Subscription" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/", label: "Home" },
      { href: "/pricing", label: "Pricing" },
      { href: "/status", label: "System status" },
      { href: "/terms", label: "Terms & Privacy" },
      { href: "/cookies", label: "Cookies" },
      { href: "/sitemap.xml", label: "XML sitemap" },
    ],
  },
  {
    title: "Languages",
    links: [
      { href: "/de", label: "Deutsch" },
      { href: "/es", label: "Español" },
      { href: "/it", label: "Italiano" },
      { href: "/fr", label: "Français" },
    ],
  },
];

function SitemapPage() {
  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6">
        <h1 className="font-display text-3xl font-semibold tracking-tight">Sitemap</h1>
        <p className="mt-2 text-sm text-muted-foreground">Every page on ApplyWise, in one place.</p>

        <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {groups.map((g) => (
            <div key={g.title}>
              <div className="text-sm font-semibold">{g.title}</div>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {g.links.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} className="hover:text-foreground hover:underline">{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <div className="text-sm font-semibold">Prompts</div>
          <ul className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2 lg:grid-cols-3">
            {prompts.map((p) => (
              <li key={p.slug}>
                <a href={`/prompt/${p.slug}`} className="hover:text-foreground hover:underline">{p.title}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SiteShell>
  );
}
