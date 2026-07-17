import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { detectLocaleFromPath, type Locale, locales } from "./i18n";

const STORAGE_KEY = "aw:locale";

type LocaleCtx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
};

const Ctx = createContext<LocaleCtx>({ locale: "en", setLocale: () => {} });

function readStored(): Locale | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    if (v && (locales as string[]).includes(v)) return v as Locale;
  } catch {
    /* ignore */
  }
  return null;
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  // Initial: SSR-safe, use URL. Hydration effect below reconciles with storage.
  const [locale, setLocaleState] = useState<Locale>(() => detectLocaleFromPath(pathname));

  // Hydration: prefer stored locale if user has explicitly chosen one.
  useEffect(() => {
    const stored = readStored();
    if (stored && stored !== locale) setLocaleState(stored);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If URL has a locale prefix that differs, adopt it (deep link / back nav).
  useEffect(() => {
    const fromPath = detectLocaleFromPath(pathname);
    // Only follow URL if it's explicitly localized; bare "/" paths shouldn't
    // override an explicit user selection.
    const hasPrefix = fromPath !== "en" || /^\/(en)(\/|$)/.test(pathname);
    if (hasPrefix && fromPath !== locale) {
      setLocaleState(fromPath);
      try {
        window.localStorage.setItem(STORAGE_KEY, fromPath);
      } catch {
        /* ignore */
      }
    }
  }, [pathname, locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
    try {
      document.documentElement.lang = l;
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(() => ({ locale, setLocale }), [locale, setLocale]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLocale() {
  return useContext(Ctx);
}
