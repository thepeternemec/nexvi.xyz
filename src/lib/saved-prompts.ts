import { useCallback, useEffect, useState } from "react";

export const SAVED_KEY = "applywise:saved-prompts";
const EVENT = "applywise:saved-changed";

export function readSaved(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SAVED_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function writeSaved(next: string[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SAVED_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent(EVENT));
  } catch {
    /* ignore */
  }
}

/** Reactive list of saved prompt slugs, shared across the app. */
export function useSavedPrompts() {
  const [saved, setSaved] = useState<string[]>([]);

  useEffect(() => {
    setSaved(readSaved());
    const sync = () => setSaved(readSaved());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const isSaved = useCallback((slug: string) => saved.includes(slug), [saved]);

  const toggle = useCallback((slug: string) => {
    const current = readSaved();
    const next = current.includes(slug) ? current.filter(s => s !== slug) : [...current, slug];
    writeSaved(next);
    return next.includes(slug);
  }, []);

  const saveMany = useCallback((slugs: string[]) => {
    const current = readSaved();
    const next = Array.from(new Set([...current, ...slugs]));
    writeSaved(next);
    return next.length - current.length;
  }, []);

  const removeMany = useCallback((slugs: string[]) => {
    const current = readSaved();
    writeSaved(current.filter(s => !slugs.includes(s)));
  }, []);

  return { saved, isSaved, toggle, saveMany, removeMany };
}
