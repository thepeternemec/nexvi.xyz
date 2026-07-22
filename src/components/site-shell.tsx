import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import { Search, Menu, X, Sun, Moon, Globe, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { locales, localeLabel, localeFlag, alternateHref, type Locale } from "@/lib/i18n";
import { useLocale } from "@/lib/locale-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function useActiveLocale(explicit?: Locale): Locale {
  const { locale } = useLocale();
  return explicit ?? locale;
}

function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/70 dark:border-border/90 bg-background/60 dark:bg-background/80 text-muted-foreground dark:text-foreground/80 transition hover:bg-background hover:text-foreground dark:hover:text-foreground"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

const NAV = [
  { href: "/library", label: "Prompt Library" },
  { href: "/cv", label: "CV Generator" },
  { href: "/cover-letter", label: "Cover Letter" },
  { href: "/humanizer", label: "Humanizer" },
  { href: "/ats", label: "ATS Optimizer" },
  { href: "/pricing", label: "Pricing" },
];

function LanguageSwitcher({ locale = "en" }: { locale?: Locale }) {
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { setLocale } = useLocale();
  const barePath = (() => {
    const m = pathname.match(/^\/(de|ger|es|it|fr)(\/.*)?$/);
    return m ? (m[2] || "/") : pathname || "/";
  })();
  const handleSelect = (l: Locale) => (e: React.MouseEvent) => {
    e.preventDefault();
    setLocale(l);
    const target = alternateHref(l, barePath);
    // SPA navigation so provider state (locale, translations) persists and
    // AutoTranslate immediately rescans in the new language.
    router.navigate({ to: target, replace: false }).catch(() => {
      window.location.href = target;
    });
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Change language"
          className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border/70 dark:border-border/90 bg-background/60 dark:bg-background/80 px-3 text-[12px] font-medium text-muted-foreground transition hover:bg-background hover:text-foreground"
        >
          <Globe className="h-3.5 w-3.5" />
          <span className="uppercase">{locale}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[10rem]">
        {locales.map((l) => (
          <DropdownMenuItem key={l} asChild>
            <a
              href={alternateHref(l, barePath)}
              onClick={handleSelect(l)}
              className="flex items-center justify-between gap-3"
              data-no-translate
            >
              <span className="flex items-center gap-2" data-no-translate>
                <span data-no-translate>{localeFlag[l]}</span>
                <span data-no-translate>{localeLabel[l]}</span>
              </span>
              {l === locale && <Check className="h-3.5 w-3.5" />}
            </a>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


export function SiteHeader({ locale: explicitLocale }: { locale?: Locale }) {
  const locale = useActiveLocale(explicitLocale);
  const [open, setOpen] = useState(false);
  const href = (p: string) => alternateHref(locale, p);
  return (
    <header className="sticky top-0 z-50 w-full px-3 pt-3">
      <div className="mx-auto flex h-12 w-full max-w-6xl items-center justify-between gap-4 rounded-2xl border border-border/60 bg-background/70 px-3 pl-5 shadow-[0_1px_0_rgba(255,255,255,0.5)_inset,0_8px_24px_-12px_rgba(0,0,0,0.18)] backdrop-blur-2xl dark:bg-background/60 dark:shadow-[0_1px_0_rgba(255,255,255,0.06)_inset,0_8px_24px_-12px_rgba(0,0,0,0.5)] sm:px-4 sm:pl-6">
        <a href={href("/")} className="flex shrink-0 items-center gap-2">
          <span className="font-display text-[15px] font-semibold tracking-tight">ApplyWise</span>
        </a>
        <nav className="hidden items-center gap-5 lg:flex">
          {NAV.map((n) => (
            <a key={n.href} href={href(n.href)} className="whitespace-nowrap text-[13px] text-muted-foreground transition-colors hover:text-foreground">
              {n.label}
            </a>
          ))}
        </nav>
        <div className="hidden shrink-0 items-center gap-1.5 lg:flex">
          <LanguageSwitcher locale={locale} />
          <ThemeToggle />
          <a href={href("/pricing")}><Button variant="ghost" size="sm" className="h-8 rounded-lg text-[13px]">Pricing</Button></a>
          <a href={href("/login")}><Button size="sm" className="h-8 whitespace-nowrap rounded-lg bg-primary px-3 text-[13px] font-medium text-primary-foreground shadow-[0_1px_0_rgba(255,255,255,0.4)_inset,0_1px_2px_rgba(0,0,0,0.12)] hover:bg-primary/90">Sign in</Button></a>

        </div>
        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSwitcher locale={locale} />
          <ThemeToggle />
          <button onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-border/60 bg-background lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4">
            {NAV.map((n) => (
              <a key={n.href} href={href(n.href)} onClick={() => setOpen(false)} className="text-sm">{n.label}</a>
            ))}
            <div className="mt-2 flex gap-2">
              <a href={href("/pricing")} className="flex-1"><Button variant="outline" size="sm" className="w-full">Pricing</Button></a>
              <a href={href("/login")} className="flex-1"><Button size="sm" className="w-full">Sign in</Button></a>

            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export function SiteFooter({ locale = "en" }: { locale?: Locale }) {
  const href = (p: string) => alternateHref(locale, p);
  return (
    <footer className="border-t border-border/60 bg-muted/30">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="font-display text-xl tracking-tight">ApplyWise</span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            AI-powered CVs, cover letters, and ATS optimization — tailored to every job description.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/60 px-3 py-1.5 text-xs text-muted-foreground">
            <Search className="h-3.5 w-3.5" /> Paste a job description. Get hired.
          </div>
        </div>
        <div>
          <div className="text-sm font-medium">Tools</div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><a href={href("/cv")}>CV Generator</a></li>
            <li><a href={href("/cover-letter")}>Cover Letter Generator</a></li>
            <li><a href={href("/ats")}>ATS Optimizer</a></li>
            <li><a href={href("/library")}>Prompt Library</a></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-medium">Company</div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><a href={href("/pricing")}>Pricing</a></li>
            <li><a href={href("/login")}>Sign in</a></li>
            <li><a href={href("/signup")}>Create account</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:px-6">
          <div>© {new Date().getFullYear()} ApplyWise. Built for job seekers.</div>
          <div>Land your next role.</div>
        </div>
      </div>
    </footer>
  );
}

export function SiteShell({ children, locale: explicitLocale }: { children: React.ReactNode; locale?: Locale }) {
  const locale = useActiveLocale(explicitLocale);
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader locale={locale} />
      <main className="flex-1">{children}</main>
      <SiteFooter locale={locale} />
    </div>
  );
}

