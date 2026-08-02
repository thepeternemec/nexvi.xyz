import { Link, useNavigate, useRouter, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Search, Menu, X, Sun, Moon, Globe, Check, Instagram, User, LogOut, LayoutDashboard, Settings, CreditCard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

import { openCookiePreferences } from "@/lib/cookie-consent";

function XLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className={className}>
      <path d="M18.244 2H21l-6.52 7.45L22 22h-6.594l-5.163-6.75L4.4 22H1.64l6.98-7.97L2 2h6.75l4.67 6.17L18.244 2Zm-1.156 18.4h1.827L7.02 3.5H5.06L17.088 20.4Z" />
    </svg>
  );
}

function LinkedinLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className={className}>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}
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
  { href: "/cv", label: "CV Generator" },
  { href: "/cover-letter", label: "Cover Letter" },
  { href: "/humanizer", label: "Humanizer" },
  { href: "/ats", label: "ATS Optimizer" },
  { href: "/library", label: "Prompt Library" },
  { href: "/pricing", label: "Pricing", mobileOnly: true },
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
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: href("/login"), replace: true });
  };

  return (
    <header className="sticky top-0 z-50 w-full px-3 pt-3">
      <div className="mx-auto flex h-13 w-full max-w-6xl items-center justify-between gap-4 rounded-[18px] border border-border/50 bg-background/60 px-2 pl-5 shadow-[0_1px_0_rgba(255,255,255,0.65)_inset,0_1px_2px_rgba(16,24,64,0.04),0_12px_32px_-16px_rgba(16,24,64,0.22)] backdrop-blur-2xl dark:border-white/10 dark:bg-background/50 dark:shadow-[0_1px_0_rgba(255,255,255,0.07)_inset,0_12px_32px_-16px_rgba(0,0,0,0.6)] sm:px-3 sm:pl-6">
        <a href={href("/")} className="group flex shrink-0 items-center gap-2">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-primary/40 transition group-hover:animate-ping" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
          </span>
          <span className="font-display text-[15px] font-medium tracking-tight transition-opacity group-hover:opacity-70">ApplyWise</span>
        </a>
        <nav className="hidden items-center gap-0.5 lg:flex">
          {NAV.filter((n) => !n.mobileOnly).map((n) => {
            const active = barePath === n.href || barePath.startsWith(n.href + "/");
            return (
              <a
                key={n.href}
                href={href(n.href)}
                aria-current={active ? "page" : undefined}
                className={`group relative whitespace-nowrap rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition-colors ${
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {n.label}
                <span
                  className={`pointer-events-none absolute inset-x-2.5 -bottom-0.5 h-[1.5px] rounded-full bg-primary transition-transform duration-200 ${
                    active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </a>
            );
          })}

        </nav>
        <div className="hidden shrink-0 items-center gap-1.5 lg:flex">
          <LanguageSwitcher locale={locale} />
          <ThemeToggle />
          <span className="mx-1 h-5 w-px bg-border/70" aria-hidden="true" />
          <a href={href("/pricing")}><Button variant="ghost" size="sm" className="h-8 rounded-lg text-[13px] font-medium text-muted-foreground hover:text-foreground">Pricing</Button></a>
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 gap-1.5 rounded-lg text-[13px]">
                  <User className="h-4 w-4" /> Account
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[15rem] p-0">
                
                <div className="p-1">
                <DropdownMenuItem asChild>
                  <a href={href("/dashboard")} className="flex items-center gap-2 cursor-pointer">
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href={href("/account")} className="flex items-center gap-2 cursor-pointer">
                    <Settings className="h-4 w-4" /> Account settings
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href={href("/subscription")} className="flex items-center gap-2 cursor-pointer">
                    <CreditCard className="h-4 w-4" /> Subscription
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2 cursor-pointer">
                  <LogOut className="h-4 w-4" /> Sign out
                </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <a href={href("/login")}><Button size="sm" className="h-8 whitespace-nowrap rounded-lg bg-primary px-3 text-[13px] font-medium text-primary-foreground shadow-[0_1px_0_rgba(255,255,255,0.4)_inset,0_1px_2px_rgba(0,0,0,0.12)] hover:bg-primary/90">Sign in</Button></a>
          )}

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
            <div className="mt-2 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <a href={href("/dashboard")} className="w-full"><Button variant="outline" size="sm" className="w-full">Dashboard</Button></a>
                  <a href={href("/account")} className="w-full"><Button variant="outline" size="sm" className="w-full">Account settings</Button></a>
                  <a href={href("/subscription")} className="w-full"><Button variant="outline" size="sm" className="w-full">Subscription</Button></a>
                  <Button size="sm" variant="outline" className="w-full" onClick={handleSignOut}>Sign out</Button>
                </>
              ) : (
                <>
                  <a href={href("/pricing")} className="w-full"><Button variant="outline" size="sm" className="w-full">Pricing</Button></a>
                  <a href={href("/login")} className="w-full"><Button size="sm" className="w-full">Sign in</Button></a>
                </>
              )}

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
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#0b1230] text-slate-200">
      <div
        className="pointer-events-none absolute inset-0 -z-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 70% 60% at 12% 0%, rgba(79,70,229,0.35), transparent 65%), radial-gradient(ellipse 60% 55% at 88% 5%, rgba(37,99,235,0.28), transparent 62%), linear-gradient(180deg, #101a44 0%, #0b1230 55%, #070c20 100%)",
        }}
      />
      <div className="relative mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="font-display text-lg tracking-tight text-white">ApplyWise</span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-slate-300/80">
            Land more interviews with AI-tailored CVs, cover letters, and ATS scoring — built for every job description, in 60 seconds.
          </p>
          <a
            href="mailto:hello@applywise.eu"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3.5 py-2 text-xs text-slate-200 backdrop-blur transition hover:border-white/30 hover:bg-white/[0.12] hover:text-white"
          >
            <Search className="h-3.5 w-3.5" /> Ask us anything you would like to see on ApplyWise.
          </a>
          <div className="mt-6 flex items-center gap-3">
            <a
              href="#"
              aria-label="LinkedIn"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.07] text-slate-200 backdrop-blur transition hover:border-white/30 hover:bg-white/[0.14] hover:text-white"
            >
              <LinkedinLogo className="h-4 w-4" />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.07] text-slate-200 backdrop-blur transition hover:border-white/30 hover:bg-white/[0.14] hover:text-white"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href="#"
              aria-label="X"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.07] text-slate-200 backdrop-blur transition hover:border-white/30 hover:bg-white/[0.14] hover:text-white"
            >
              <XLogo className="h-4 w-4" />
            </a>
          </div>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Tools</div>
          <ul className="mt-3 space-y-2 text-sm text-slate-300/70">
            <li><a href={href("/cv")} className="hover:text-white">CV Generator</a></li>
            <li><a href={href("/cover-letter")} className="hover:text-white">Cover Letter Generator</a></li>
            <li><a href={href("/humanizer")} className="hover:text-white">Humanizer</a></li>
            <li><a href={href("/ats")} className="hover:text-white">ATS Optimizer</a></li>
            <li><a href={href("/library")} className="hover:text-white">Prompt Library</a></li>
          </ul>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Company</div>
          <ul className="mt-3 space-y-2 text-sm text-slate-300/70">
            <li><a href={href("/pricing")} className="hover:text-white">Pricing</a></li>
            <li><a href={href("/login")} className="hover:text-white">Sign in</a></li>
            <li><a href={href("/signup")} className="hover:text-white">Create account</a></li>
          </ul>
        </div>
      </div>
      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 text-xs text-slate-300/70 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <a href={href("/status")} className="inline-flex items-center gap-2 text-slate-300 transition hover:text-white">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            All Systems Operational
          </a>
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <a href={href("/terms")} className="underline-offset-4 transition hover:text-white hover:underline">Terms &amp; Privacy</a>
            <a href={href("/sitemap")} className="underline-offset-4 transition hover:text-white hover:underline">Sitemap</a>
            <a href={href("/cookies")} className="underline-offset-4 transition hover:text-white hover:underline">Cookies</a>
            <button
              type="button"
              onClick={() => openCookiePreferences()}
              className="underline-offset-4 transition hover:text-white hover:underline"
            >
              Cookie settings
            </button>
          </nav>
        </div>
      </div>
      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-slate-300/70 sm:flex-row sm:px-6">
          <div>© {new Date().getFullYear()} ApplyWise. Built for job seekers with ❤️ in Berlin</div>
          <div>We help you land your dream jobs in weeks.</div>
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

