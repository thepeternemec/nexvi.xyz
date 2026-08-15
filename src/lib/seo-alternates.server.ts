const BASE_URL = "https://applywise.eu";

/** Locales that have their own URL prefix. English lives at the unprefixed root. */
export const SEO_LOCALES = ["de", "es", "it", "fr"] as const;

/** Paths that must never be indexed (private / auth / account surfaces). */
const PRIVATE_SEGMENTS = new Set([
  "login",
  "signup",
  "dashboard",
  "account",
  "admin",
  "subscription",
  "verify-email",
  "reset-password",
]);

/** Strips a locale prefix, returning the canonical English path ("/" for the root). */
export function stripLocalePrefix(pathname: string): { locale: string | null; path: string } {
  const clean = pathname.replace(/\/+$/, "") || "/";
  const seg = clean.split("/")[1]?.toLowerCase();
  if (seg === "ger") return { locale: "de", path: clean.slice(4) || "/" };
  if (seg && (SEO_LOCALES as readonly string[]).includes(seg)) {
    return { locale: seg, path: clean.slice(seg.length + 1) || "/" };
  }
  return { locale: null, path: clean };
}

export function isIndexablePath(pathname: string): boolean {
  const { path } = stripLocalePrefix(pathname);
  if (path.startsWith("/api") || path.startsWith("/.")) return false;
  const first = path.split("/")[1];
  if (first && PRIVATE_SEGMENTS.has(first)) return false;
  return true;
}

function localeHref(locale: string | null, path: string) {
  const suffix = path === "/" ? "" : path;
  return locale ? `${BASE_URL}/${locale}${suffix}` : `${BASE_URL}${suffix || "/"}`;
}

/** BCP-47 / Open Graph locale codes for every language the product ships in. */
const OG_LOCALES: Record<string, string> = {
  en: "en_US",
  de: "de_DE",
  es: "es_ES",
  it: "it_IT",
  fr: "fr_FR",
};

/** Sets <html lang> to the served locale so assistive tech and crawlers agree. */
function setHtmlLang(html: string, locale: string | null): string {
  const lang = locale ?? "en";
  return html.replace(/<html([^>]*)\slang="[^"]*"/i, `<html$1 lang="${lang}"`);
}

/**
 * Route-level head() entries are deduped by property, so repeated
 * og:locale:alternate tags collapse to a single one. Emit the full set here
 * from the raw HTML instead, after stripping whatever survived.
 */
function injectOgLocales(html: string, locale: string | null): string {
  const current = OG_LOCALES[locale ?? "en"];
  let out = html.replace(/<meta[^>]+property="og:locale(?::alternate)?"[^>]*>/gi, "");
  const tags = [`<meta property="og:locale" content="${current}">`];
  for (const [code, og] of Object.entries(OG_LOCALES)) {
    if (og !== current) tags.push(`<meta property="og:locale:alternate" content="${og}">`);
  }
  tags.push(`<meta http-equiv="content-language" content="${locale ?? "en"}">`);
  return out.replace(/<\/head>/i, `${tags.join("")}</head>`);
}


/**
 * Injects self-referencing canonical + full hreflang alternate set into the
 * server-rendered <head>, so every localized page is indexable and correctly
 * clustered with its translations by search engines.
 */
export function injectSeoAlternates(html: string, pathname: string): string {
  const { locale, path } = stripLocalePrefix(pathname);
  html = setHtmlLang(html, locale);

  if (!isIndexablePath(pathname)) {
    if (/<meta[^>]+name="robots"/i.test(html)) {
      return html.replace(/<meta([^>]*?)name="robots"[^>]*>/i, `<meta$1name="robots" content="noindex, nofollow">`);
    }
    return html.replace(/<head([^>]*)>/i, `<head$1><meta name="robots" content="noindex, nofollow">`);
  }

  html = injectOgLocales(html, locale);

  const self = localeHref(locale, path);

  const tags: string[] = [];

  if (!/<link[^>]+rel="canonical"/i.test(html)) {
    tags.push(`<link rel="canonical" href="${self}">`);
  }

  if (!/hreflang=/i.test(html)) {
    tags.push(`<link rel="alternate" hreflang="en" href="${localeHref(null, path)}">`);
    for (const l of SEO_LOCALES) {
      tags.push(`<link rel="alternate" hreflang="${l}" href="${localeHref(l, path)}">`);
    }
    tags.push(`<link rel="alternate" hreflang="x-default" href="${localeHref(null, path)}">`);
  }

  if (!/property="og:url"/i.test(html)) {
    tags.push(`<meta property="og:url" content="${self}">`);
  }

  if (!tags.length) return html;
  return html.replace(/<\/head>/i, `${tags.join("")}</head>`);
}

