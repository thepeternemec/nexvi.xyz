/**
 * Invisible (crawler-only) SEO metadata helpers.
 *
 * Everything here renders into <head> — users never see it, but it is what
 * Google, Bing and AI answer engines read when someone searches things like
 * "CV generator", "ATS resume checker" or "cover letter generator".
 */

export const SITE_URL = "https://nexvi.xyz";
export const SITE_NAME = "Nexvi";

/** Locales that live under a URL prefix. English is the unprefixed root. */
const HREFLANG_LOCALES = [
  { code: "de", hreflang: "de" },
  { code: "es", hreflang: "es" },
  { code: "fr", hreflang: "fr" },
  { code: "it", hreflang: "it" },
] as const;

type LinkTag = { rel: string; href: string; hrefLang?: string };

/**
 * Canonical + full hreflang set for a page. Pass the English path ("/cv").
 * Emit ONLY on leaf routes — TanStack concatenates links without dedupe.
 */
export function canonicalAndAlternates(path: string): LinkTag[] {
  const suffix = path === "/" ? "" : path;
  const en = `${SITE_URL}${suffix || "/"}`;
  return [
    { rel: "canonical", href: en },
    { rel: "alternate", hrefLang: "x-default", href: en },
    { rel: "alternate", hrefLang: "en", href: en },
    ...HREFLANG_LOCALES.map((l) => ({
      rel: "alternate",
      hrefLang: l.hreflang,
      href: `${SITE_URL}/${l.code}${suffix}`,
    })),
  ];
}

/**
 * Crawler directives + search-keyword signals that never render on screen.
 * `max-image-preview:large` unlocks large thumbnails in Google results.
 */
export function crawlerMeta(keywords: string[]) {
  return [
    { name: "robots", content: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" },
    { name: "googlebot", content: "index, follow" },
    { name: "keywords", content: keywords.join(", ") },
    { name: "author", content: SITE_NAME },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:locale", content: "en_US" },
  ];
}

/** Breadcrumb trail so Google shows "nexvi.xyz › Tools › CV Generator". */
export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  return {
    type: "application/ld+json" as const,
    children: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: trail.map((t, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: t.name,
        item: `${SITE_URL}${t.path === "/" ? "" : t.path}` || SITE_URL,
      })),
    }),
  };
}

/** Rich SoftwareApplication entry — what "free CV generator" queries match on. */
export function toolJsonLd(opts: {
  name: string;
  path: string;
  description: string;
  category?: string;
  featureList: string[];
}) {
  return {
    type: "application/ld+json" as const,
    children: JSON.stringify({
      "@context": "https://schema.org",
      "@type": ["SoftwareApplication", "WebApplication"],
      name: opts.name,
      url: `${SITE_URL}${opts.path}`,
      description: opts.description,
      applicationCategory: opts.category ?? "BusinessApplication",
      applicationSubCategory: "Resume & Job Application Tools",
      operatingSystem: "Any (web-based)",
      browserRequirements: "Requires a modern web browser",
      inLanguage: ["en", "de", "es", "fr", "it"],
      isAccessibleForFree: true,
      featureList: opts.featureList,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        description: "Free tier with optional Premium upgrade",
      },
      publisher: {
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
      },
    }),
  };
}

/** Step-by-step markup: helps Google understand and surface the workflow. */
export function howToJsonLd(opts: { name: string; description: string; steps: string[] }) {
  return {
    type: "application/ld+json" as const,
    children: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: opts.name,
      description: opts.description,
      totalTime: "PT2M",
      step: opts.steps.map((s, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        name: s.split(".")[0],
        text: s,
      })),
    }),
  };
}
