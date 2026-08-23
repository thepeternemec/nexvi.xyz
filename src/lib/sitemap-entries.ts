import { prompts } from "@/lib/mock-data";

export const BASE_URL = "https://nexvi.xyz";

/** Locales that have a full mirrored set of public route files. */
export const SITEMAP_LOCALES = ["de", "es", "it", "fr"] as const;

/** Every locale that gets its own sitemap file ("en" is the unprefixed root). */
export const SITEMAP_ALL_LOCALES = ["en", ...SITEMAP_LOCALES] as const;

export type Changefreq =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

export interface SitemapEntry {
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
export const SITEMAP_ENTRIES: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/cv", changefreq: "weekly", priority: "0.9" },
  { path: "/cover-letter", changefreq: "weekly", priority: "0.9" },
  { path: "/humanizer", changefreq: "weekly", priority: "0.8" },
  { path: "/ats", changefreq: "weekly", priority: "0.8" },
  { path: "/copilot", changefreq: "weekly", priority: "0.9", englishOnly: true },
  { path: "/prompts", changefreq: "daily", priority: "0.9" },
  { path: "/assistant", changefreq: "weekly", priority: "0.6" },
  { path: "/pricing", changefreq: "monthly", priority: "0.7" },
  { path: "/about", changefreq: "monthly", priority: "0.6" },
  { path: "/creators", changefreq: "monthly", priority: "0.5" },
  { path: "/status", changefreq: "weekly", priority: "0.5" },
  { path: "/terms", changefreq: "yearly", priority: "0.3" },
  { path: "/cookies", changefreq: "yearly", priority: "0.3" },
  { path: "/blog", changefreq: "weekly", priority: "0.7" },
  { path: "/blog/how-to-write-a-resume", changefreq: "monthly", priority: "0.8" },
  { path: "/blog/ats-optimization-and-ai-humanizer", changefreq: "monthly", priority: "0.8" },
  { path: "/blog/nexvi-copilot", changefreq: "monthly", priority: "0.8" },
  ...prompts.map((p) => ({
    path: `/prompt/${p.slug}`,
    changefreq: "monthly" as Changefreq,
    priority: "0.6",
  })),
];

export function localeUrl(locale: string, path: string) {
  if (locale === "en") return `${BASE_URL}${path}`;
  return path === "/" ? `${BASE_URL}/${locale}` : `${BASE_URL}/${locale}${path}`;
}

function alternates(entry: SitemapEntry) {
  if (entry.englishOnly) return [];
  return [
    `    <xhtml:link rel="alternate" hreflang="en" href="${localeUrl("en", entry.path)}"/>`,
    ...SITEMAP_LOCALES.map(
      (l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${localeUrl(l, entry.path)}"/>`,
    ),
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${localeUrl("en", entry.path)}"/>`,
  ];
}

export function isSitemapLocale(value: string): boolean {
  return (SITEMAP_ALL_LOCALES as readonly string[]).includes(value);
}

/** Renders the urlset for one locale. */
export function renderLocaleSitemap(locale: string): string {
  const urls: string[] = [];

  for (const entry of SITEMAP_ENTRIES) {
    if (entry.englishOnly && locale !== "en") continue;
    urls.push(
      [
        `  <url>`,
        `    <loc>${localeUrl(locale, entry.path)}</loc>`,
        ...alternates(entry),
        `    <changefreq>${entry.changefreq}</changefreq>`,
        `    <priority>${locale === "en" ? entry.priority : "0.5"}</priority>`,
        `  </url>`,
      ].join("\n"),
    );
  }

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`,
    ...urls,
    `</urlset>`,
  ].join("\n");
}

export function localeSitemapPath(locale: string) {
  return `/sitemap-${locale}.xml`;
}

/** Renders the sitemap index pointing at every locale sitemap. */
export function renderSitemapIndex(): string {
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...SITEMAP_ALL_LOCALES.map((l) =>
      [`  <sitemap>`, `    <loc>${BASE_URL}${localeSitemapPath(l)}</loc>`, `  </sitemap>`].join(
        "\n",
      ),
    ),
    `</sitemapindex>`,
  ].join("\n");
}

export const XML_HEADERS = {
  "Content-Type": "application/xml; charset=utf-8",
  "Cache-Control": "public, max-age=3600",
};
