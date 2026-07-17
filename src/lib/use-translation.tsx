import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { translateBatch } from "./translate.functions";
import { type Locale } from "./i18n";
import { staticTranslations } from "./static-translations";
import { useLocale } from "./locale-context";

type Ctx = {
  locale: Locale;
  t: (text: string) => string;
};

const TranslationContext = createContext<Ctx>({ locale: "en", t: (s) => s });

const STORAGE_PREFIX = "aw:i18n:";

function removeIdentityMappings(cache: Record<string, string>) {
  return Object.fromEntries(Object.entries(cache).filter(([source, translated]) => source.trim() !== translated.trim()));
}

function loadCache(locale: Locale): Record<string, string> {
  const staticCache = staticTranslations[locale] ?? {};
  if (typeof window === "undefined") return staticCache;
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + locale);
    const stored = raw ? removeIdentityMappings(JSON.parse(raw)) : {};
    return { ...stored, ...staticCache };
  } catch {
    return staticCache;
  }
}

function saveCache(locale: Locale, cache: Record<string, string>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_PREFIX + locale, JSON.stringify(removeIdentityMappings({ ...cache, ...(staticTranslations[locale] ?? {}) })));
  } catch {
    // ignore quota
  }
}

export function TranslationProvider({ children, locale: propLocale }: { children: React.ReactNode; locale?: Locale }) {
  const { locale: ctxLocale } = useLocale();
  const locale = propLocale ?? ctxLocale;
  const [cache, setCache] = useState<Record<string, string>>(() => loadCache(locale));
  const cacheRef = useRef(cache);
  cacheRef.current = cache;
  const pending = useRef<Set<string>>(new Set());
  const inflight = useRef<Set<string>>(new Set());
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const runTranslate = useServerFn(translateBatch);

  // Reload cache when locale changes
  useEffect(() => {
    setCache(loadCache(locale));
    pending.current.clear();
    inflight.current.clear();
  }, [locale]);

  const flush = useCallback(async () => {
    if (locale === "en") {
      pending.current.clear();
      return;
    }
    const batch = Array.from(pending.current).filter(
      (t) => (!cacheRef.current[t] || cacheRef.current[t].trim() === t.trim()) && !inflight.current.has(t),
    );
    pending.current.clear();
    if (batch.length === 0) return;
    batch.forEach((b) => inflight.current.add(b));
    try {
      const res = await runTranslate({ data: { texts: batch, targetLocale: locale } });
      const merged = { ...cacheRef.current, ...res.translations };
      cacheRef.current = merged;
      setCache(merged);
      saveCache(locale, merged);
    } catch (e) {
      // Keep built-in/local cached translations active if runtime translation is unavailable.
    } finally {
      batch.forEach((b) => inflight.current.delete(b));
    }
  }, [locale, runTranslate]);

  const schedule = useCallback(() => {
    if (timer.current) return;
    timer.current = setTimeout(() => {
      timer.current = null;
      void flush();
    }, 80);
  }, [flush]);

  const t = useCallback(
    (text: string): string => {
      if (!text || locale === "en") return text;
      const trimmed = text.trim();
      if (!trimmed) return text;
      const staticTranslated = staticTranslations[locale]?.[text] ?? staticTranslations[locale]?.[trimmed];
      if (staticTranslated) return text === trimmed ? staticTranslated : text.replace(trimmed, staticTranslated);
      const cached = cacheRef.current[text] ?? cacheRef.current[trimmed];
      if (cached && cached.trim() !== trimmed) return cached;
      if (!pending.current.has(text) && !inflight.current.has(text)) {
        pending.current.add(text);
        schedule();
      }
      return text;
    },
    // include `cache` so consumers get a fresh identity when translations arrive,
    // which forces the AutoTranslate effect to rescan the DOM.
    [locale, schedule, cache],
  );

  const value = useMemo(() => ({ locale, t }), [locale, t, cache]);

  return <TranslationContext.Provider value={value}>{children}</TranslationContext.Provider>;
}

export function useT() {
  return useContext(TranslationContext);
}

// Module-scope originals so text can be reverted/re-translated across locale changes.
const originalsMap = new WeakMap<Text, string>();
const originalAttrs = new WeakMap<HTMLElement, Record<string, string>>();

/** Auto-translates all visible text nodes on the current page. */
export function AutoTranslate() {
  const { locale, t } = useT();
  useEffect(() => {
    let raf = 0;

    const scan = () => {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          const tag = parent.tagName;
          if (tag === "SCRIPT" || tag === "STYLE" || tag === "CODE" || tag === "PRE" || tag === "NOSCRIPT") return NodeFilter.FILTER_REJECT;
          if (parent.closest("[data-no-translate]")) return NodeFilter.FILTER_REJECT;
          const text = node.nodeValue ?? "";
          const trimmed = text.trim();
          if (trimmed.length < 2) return NodeFilter.FILTER_REJECT;
          // Skip pure numbers / short symbols
          if (/^[\d\s.,%×+/-]+$/.test(trimmed)) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        },
      });
      const nodes: Text[] = [];
      let n: Node | null = walker.nextNode();
      while (n) {
        nodes.push(n as Text);
        n = walker.nextNode();
      }
      for (const node of nodes) {
        const original = originalsMap.get(node) ?? node.nodeValue ?? "";
        if (!originalsMap.has(node)) originalsMap.set(node, original);
        const trimmed = original.trim();
        const leading = original.slice(0, original.indexOf(trimmed));
        const trailing = original.slice(original.indexOf(trimmed) + trimmed.length);
        const translated = locale === "en" ? trimmed : t(trimmed);
        const next = leading + translated + trailing;
        if (node.nodeValue !== next) {
          node.nodeValue = next;
        }
      }
      // Translate common attributes
      const attrEls = document.querySelectorAll<HTMLElement>("[placeholder], [aria-label], [title], [alt]");
      attrEls.forEach((el) => {
        if (el.closest("[data-no-translate]")) return;
        let stored = originalAttrs.get(el);
        for (const attr of ["placeholder", "aria-label", "title", "alt"]) {
          const current = el.getAttribute(attr);
          if (current == null) continue;
          if (!stored || !(attr in stored)) {
            stored = { ...(stored ?? {}), [attr]: current };
            originalAttrs.set(el, stored);
          }
          const orig = stored[attr];
          if (!orig || orig.trim().length < 2 || /^[\d\s.,%×+/-]+$/.test(orig.trim())) continue;
          const translated = locale === "en" ? orig : t(orig);
          if (translated !== current) el.setAttribute(attr, translated);
        }
      });
    };

    const observer = new MutationObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(scan);
    });

    const initialScan = window.setTimeout(scan, 300);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });

    return () => {
      observer.disconnect();
      window.clearTimeout(initialScan);
      cancelAnimationFrame(raf);
    };
  }, [locale, t]);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
