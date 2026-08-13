import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { prompts } from "@/lib/mock-data";

const BASE_URL = "https://applywise.eu";

/** Locales that have a full mirrored set of public route files. */
const LOCALES = ["de", "es", "it", "fr"] as const;

type Changefreq = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

interface SitemapEntry {
  /** Path without locale prefix, e.g. "/cv" or "/". */
  path: string;
  changefreq: Changefreq;
  priority: string;
  /** true when the path exists only in English (no localized route files). */
  englishOnly?: boolean;
}

/**
 * Public, indexable paths only. Every non-englishOnly path has a real route
 * file under src/routes/{de,es,it,fr}/ — nothing here resolves to a 404,
 * which is what makes the hreflang alternate set valid.
 */
const ENTRIES: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/cv", changefreq: "weekly", priority: "0.9" },
  { path: "/cover-letter", changefreq: "weekly", priority: "0.9" },
  { path: "/humanizer", changefreq: "weekly", priority: "0.8" },
  { path: "/ats", changefreq: "weekly", priority: "0.8" },
  { path: "/marketplace", changefreq: "daily", priority: "0.9" },
  { path: "/library", changefreq: "weekly", priority: "0.7" },
  { path: "/bundles", changefreq: "weekly", priority: "0.6" },
  { path: "/assistant", changefreq: "weekly", priority: "0.6" },
  { path: "/pricing", changefreq: "monthly", priority: "0.7" },
  { path: "/about", changefreq: "monthly", priority: "0.6" },
  { path: "/creators", changefreq: "monthly", priority: "0.5" },
  { path: "/sitemap", changefreq: "weekly", priority: "0.3" },
  { path: "/terms", changefreq: "yearly", priority: "0.3" },
  { path: "/cookies", changefreq: "yearly", priority: "0.3" },
  // English-only content routes (no localized route files exist for these).
  { path: "/blog", changefreq: "weekly", priority: "0.7", englishOnly: true },
  { path: "/blog/how-to-write-a-resume", changefreq: "monthly", priority: "0.8", englishOnly: true },
  {
    path: "/blog/ats-optimization-and-ai-humanizer",
    changefreq: "monthly",
    priority: "0.8",
    englishOnly: true,
  },
];

for (const p of prompts) {
  ENTRIES.push({ path: `/prompt/${p.slug}`, changefreq: "monthly", priority: "0.6" });
}

function url(locale: string | null, path: string) {
  if (!locale) return `${BASE_URL}${path}`;
  return path === "/" ? `${BASE_URL}/${locale}` : `${BASE_URL}/${locale}${path}`;
}

function alternates(entry: SitemapEntry) {
  if (entry.englishOnly) return [];
  return [
    `    <xhtml:link rel="alternate" hreflang="en" href="${url(null, entry.path)}"/>`,
    ...LOCALES.map(
      (l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${url(l, entry.path)}"/>`,
    ),
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${url(null, entry.path)}"/>`,
  ];
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const urls: string[] = [];

        for (const entry of ENTRIES) {
          const locales: (string | null)[] = entry.englishOnly
            ? [null]
            : [null, ...LOCALES];
          for (const locale of locales) {
            urls.push(
              [
                `  <url>`,
                `    <loc>${url(locale, entry.path)}</loc>`,
                ...alternates(entry),
                `    <changefreq>${entry.changefreq}</changefreq>`,
                `    <priority>${locale ? "0.5" : entry.priority}</priority>`,
                `  </url>`,
              ].join("\n"),
            );
          }
        }

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "X-Robots-Tag": "noindex",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
