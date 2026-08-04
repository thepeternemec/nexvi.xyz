import { locales, type Locale } from "./i18n";
import { staticTranslations } from "./static-translations";

const SKIP_TAGS = new Set(["script", "style", "noscript", "template", "code", "pre"]);

function decodeEntities(s: string) {
  return s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
}

function encodeEntities(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Locale prefix of a pathname, or null for English/unprefixed paths. */
export function localeFromPathname(pathname: string): Locale | null {
  const seg = pathname.split("/")[1]?.toLowerCase();
  if (!seg) return null;
  if (seg === "en") return null;
  return locales.includes(seg as Locale) && seg !== "en" ? (seg as Locale) : null;
}

/**
 * Rewrites server-rendered HTML text nodes using the static translation
 * dictionary so localized pages ship translated markup that crawlers can
 * index without executing JavaScript.
 */
export function translateSsrHtml(html: string, locale: Locale): string {
  const dict = staticTranslations[locale];
  if (!dict) return html;

  let out = "";
  let i = 0;
  let skipDepth = 0;
  let currentSkipTag: string | null = null;

  while (i < html.length) {
    const lt = html.indexOf("<", i);
    if (lt === -1) {
      out += html.slice(i);
      break;
    }

    // Text node between i and lt
    if (lt > i) {
      const raw = html.slice(i, lt);
      if (skipDepth > 0) {
        out += raw;
      } else {
        const trimmed = raw.trim();
        if (trimmed.length > 1) {
          const key = decodeEntities(trimmed);
          const translated = dict[key];
          if (translated && translated.trim() !== key.trim()) {
            const start = raw.indexOf(trimmed);
            out += raw.slice(0, start) + encodeEntities(translated) + raw.slice(start + trimmed.length);
          } else {
            out += raw;
          }
        } else {
          out += raw;
        }
      }
    }

    const gt = html.indexOf(">", lt);
    if (gt === -1) {
      out += html.slice(lt);
      break;
    }
    const tagSource = html.slice(lt, gt + 1);
    const nameMatch = tagSource.match(/^<\/?\s*([a-zA-Z0-9-]+)/);
    const name = nameMatch?.[1]?.toLowerCase();
    const isClosing = tagSource.startsWith("</");

    if (name && SKIP_TAGS.has(name) && !tagSource.endsWith("/>")) {
      if (isClosing) {
        if (currentSkipTag === name && skipDepth > 0) {
          skipDepth -= 1;
          if (skipDepth === 0) currentSkipTag = null;
        }
      } else if (skipDepth === 0 || currentSkipTag === name) {
        currentSkipTag = name;
        skipDepth += 1;
      }
    }

    out += skipDepth > 0 ? tagSource : translateTagAttributes(tagSource, dict);
    i = gt + 1;
  }

  return out.replace(/<html([^>]*?)\slang="[^"]*"/i, `<html$1 lang="${locale}"`);
}

const TRANSLATABLE_ATTRS = ["placeholder", "aria-label", "title", "alt", "content"];

function translateTagAttributes(tag: string, dict: Record<string, string>): string {
  if (!tag.includes("=")) return tag;
  let result = tag;
  for (const attr of TRANSLATABLE_ATTRS) {
    result = result.replace(new RegExp(`\\s${attr}="([^"]*)"`, "gi"), (whole, value: string) => {
      const key = decodeEntities(value.trim());
      if (key.length < 2) return whole;
      const translated = dict[key];
      if (!translated || translated.trim() === key.trim()) return whole;
      return ` ${attr}="${encodeEntities(translated)}"`;
    });
  }
  return result;
}
