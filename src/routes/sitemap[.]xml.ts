import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { prompts } from "@/lib/mock-data";

const BASE_URL = "https://applywise.eu";

const LOCALES = ["de", "es", "it", "fr"] as const;

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/cv", changefreq: "weekly", priority: "0.9" },
          { path: "/cover-letter", changefreq: "weekly", priority: "0.9" },
          { path: "/humanizer", changefreq: "weekly", priority: "0.8" },
          { path: "/ats", changefreq: "weekly", priority: "0.8" },
          { path: "/marketplace", changefreq: "daily", priority: "0.9" },
          { path: "/blog", changefreq: "weekly", priority: "0.7" },
          { path: "/blog/how-to-write-a-resume", changefreq: "monthly", priority: "0.9" },
          { path: "/blog/ats-optimization-and-ai-humanizer", changefreq: "monthly", priority: "0.9" },

          { path: "/about", changefreq: "monthly", priority: "0.6" },
          { path: "/assistant", changefreq: "weekly", priority: "0.6" },
          { path: "/creators", changefreq: "monthly", priority: "0.4" },
          { path: "/pricing", changefreq: "monthly", priority: "0.7" },
          { path: "/sitemap", changefreq: "weekly", priority: "0.4" },
          { path: "/terms", changefreq: "yearly", priority: "0.3" },
          { path: "/cookies", changefreq: "yearly", priority: "0.3" },
          { path: "/status", changefreq: "daily", priority: "0.3" },
        ];

        for (const p of prompts) {
          entries.push({ path: `/prompt/${p.slug}`, changefreq: "monthly", priority: "0.6" });
        }

        // Every public English path also exists under each locale prefix.
        const localizable = entries.map((e) => e.path);
        for (const l of LOCALES) {
          for (const path of localizable) {
            entries.push({
              path: path === "/" ? `/${l}` : `/${l}${path}`,
              changefreq: "weekly",
              priority: "0.5",
            });
          }
        }

        const alternatesFor = (path: string) => {
          const enPath = LOCALES.some((l) => path === `/${l}` || path.startsWith(`/${l}/`))
            ? path.replace(/^\/[a-z]{2}/, "") || "/"
            : path;
          const href = (loc: string | null) =>
            loc ? `${BASE_URL}/${loc}${enPath === "/" ? "" : enPath}` : `${BASE_URL}${enPath}`;
          return [
            `    <xhtml:link rel="alternate" hreflang="en" href="${href(null)}"/>`,
            ...LOCALES.map(
              (l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${href(l)}"/>`,
            ),
            `    <xhtml:link rel="alternate" hreflang="x-default" href="${href(null)}"/>`,
          ].join("\n");
        };

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            alternatesFor(e.path),
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );


        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
