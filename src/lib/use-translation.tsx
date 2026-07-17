import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { translateBatch } from "./translate.functions";
import { detectLocaleFromPath, type Locale } from "./i18n";

type Ctx = {
  locale: Locale;
  t: (text: string) => string;
};

const TranslationContext = createContext<Ctx>({ locale: "en", t: (s) => s });

const STORAGE_PREFIX = "aw:i18n:";

function loadCache(locale: Locale): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + locale);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveCache(locale: Locale, cache: Record<string, string>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_PREFIX + locale, JSON.stringify(cache));
  } catch {
    // ignore quota
  }
}

export function TranslationProvider({ children, locale: propLocale }: { children: React.ReactNode; locale?: Locale }) {
  const detected = typeof window !== "undefined" ? detectLocaleFromPath(window.location.pathname) : "en";
  const locale = propLocale ?? detected;
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
      (t) => !(t in cacheRef.current) && !inflight.current.has(t),
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
      console.error("translation batch failed", e);
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
      if (cacheRef.current[text]) return cacheRef.current[text];
      if (cacheRef.current[trimmed]) return cacheRef.current[trimmed];
      if (!pending.current.has(text) && !inflight.current.has(text)) {
        pending.current.add(text);
        schedule();
      }
      return text;
    },
    [locale, schedule],
  );

  const value = useMemo(() => ({ locale, t }), [locale, t, cache]);

  return <TranslationContext.Provider value={value}>{children}</TranslationContext.Provider>;
}

export function useT() {
  return useContext(TranslationContext);
}

/** Auto-translates all visible text nodes on the current page. */
export function AutoTranslate() {
  const { locale, t } = useT();
  useEffect(() => {
    if (locale === "en") return;
    let raf = 0;
    const seen = new WeakSet<Text>();
    const originals = new WeakMap<Text, string>();

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
        const original = originals.get(node) ?? node.nodeValue ?? "";
        if (!originals.has(node)) originals.set(node, original);
        const trimmed = original.trim();
        const leading = original.slice(0, original.indexOf(trimmed));
        const trailing = original.slice(original.indexOf(trimmed) + trimmed.length);
        const translated = t(trimmed);
        const next = leading + translated + trailing;
        if (node.nodeValue !== next) {
          node.nodeValue = next;
        }
        seen.add(node);
      }
      // Translate common attributes
      const attrEls = document.querySelectorAll<HTMLElement>("[placeholder], [aria-label], [title], [alt]");
      attrEls.forEach((el) => {
        if (el.closest("[data-no-translate]")) return;
        for (const attr of ["placeholder", "aria-label", "title", "alt"]) {
          const v = el.getAttribute(attr);
          if (v && v.trim().length > 1 && !/^[\d\s.,%×+/-]+$/.test(v.trim())) {
            const translated = t(v);
            if (translated !== v) el.setAttribute(attr, translated);
          }
        }
      });
    };

    const observer = new MutationObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(scan);
    });

    scan();
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [locale, t]);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
