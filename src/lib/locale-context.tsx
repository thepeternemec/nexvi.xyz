import { createContext, useCallback, useContext, useEffect, useMemo } from "react";
import { useRouterState } from "@tanstack/react-router";
import { detectLocaleFromPath, type Locale } from "./i18n";

const STORAGE_KEY = "aw:locale";

type LocaleCtx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
};

const Ctx = createContext<LocaleCtx>({ locale: "en", setLocale: () => {} });

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // The URL is the single source of truth for language. English (unprefixed)
  // paths always render English — stored preferences never override the URL,
  // which previously made pages like /login appear in another language.
  const locale = detectLocaleFromPath(pathname);

  useEffect(() => {
    // Clean up the legacy stored preference so old sessions stop resurfacing it.
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      document.documentElement.lang = locale;
    } catch {
      /* ignore */
    }
  }, [locale]);

  // Kept for API compatibility: the switcher navigates to the localized URL,
  // which is what actually changes the language.
  const setLocale = useCallback((_l: Locale) => {}, []);

  const value = useMemo(() => ({ locale, setLocale }), [locale, setLocale]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLocale() {
  return useContext(Ctx);
}
