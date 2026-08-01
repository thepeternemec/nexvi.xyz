import { useEffect, useState } from "react";

export type CookieCategory = "essential" | "functional" | "analytics";

export type CookieConsent = {
  essential: true;
  functional: boolean;
  analytics: boolean;
  version: number;
  decidedAt: string;
};

export const CONSENT_VERSION = 1;
const STORAGE_KEY = "applywise:cookie-consent";
const EVENT = "applywise:cookie-consent-change";

export const ALL_ACCEPTED: Omit<CookieConsent, "version" | "decidedAt"> = {
  essential: true,
  functional: true,
  analytics: true,
};

export const ESSENTIAL_ONLY: Omit<CookieConsent, "version" | "decidedAt"> = {
  essential: true,
  functional: false,
  analytics: false,
};

export function readConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CookieConsent;
    if (!parsed || typeof parsed !== "object") return null;
    if (parsed.version !== CONSENT_VERSION) return null;
    return {
      essential: true,
      functional: Boolean(parsed.functional),
      analytics: Boolean(parsed.analytics),
      version: CONSENT_VERSION,
      decidedAt: parsed.decidedAt ?? new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function saveConsent(choice: { functional: boolean; analytics: boolean }): CookieConsent {
  const next: CookieConsent = {
    essential: true,
    functional: choice.functional,
    analytics: choice.analytics,
    version: CONSENT_VERSION,
    decidedAt: new Date().toISOString(),
  };
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable — consent stays session-only */
    }
    window.dispatchEvent(new CustomEvent<CookieConsent>(EVENT, { detail: next }));
  }
  return next;
}

export function clearConsent() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: null }));
}

/** Opens the consent preferences dialog from anywhere (e.g. footer link). */
export function openCookiePreferences() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("applywise:open-cookie-preferences"));
}

export function useCookieConsent() {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setConsent(readConsent());
    setHydrated(true);

    const onChange = (event: Event) => {
      setConsent((event as CustomEvent<CookieConsent | null>).detail ?? null);
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) setConsent(readConsent());
    };
    window.addEventListener(EVENT, onChange);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(EVENT, onChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return { consent, hydrated };
}
