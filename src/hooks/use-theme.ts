import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "theme";

type Theme = "light" | "dark";

const listeners = new Set<() => void>();

function readDomTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function applyTheme(next: Theme) {
  const root = document.documentElement;
  if (next === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

export function useTheme() {
  // Start with "light" so SSR and first client render agree; sync after mount.
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    const sync = () => setThemeState(readDomTheme());
    sync();
    listeners.add(sync);
    window.addEventListener("storage", sync);
    return () => {
      listeners.delete(sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const setTheme = useCallback((next: Theme) => {
    applyTheme(next);
  }, []);

  const toggleTheme = useCallback(() => {
    applyTheme(readDomTheme() === "dark" ? "light" : "dark");
  }, []);

  return { theme, setTheme, toggleTheme, isDark: theme === "dark" };
}

export function getInitialThemeScript(): string {
  return `
    (function() {
      try {
        var theme = localStorage.getItem('${STORAGE_KEY}');
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        }
      } catch (e) {}
    })();
  `;
}
