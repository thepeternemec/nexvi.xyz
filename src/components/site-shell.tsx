import { Link, useNavigate, useRouter, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Search, Menu, X, Sun, Moon, Globe, Check, Instagram, User, LogOut, LayoutDashboard, Settings, CreditCard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BrandMark } from "@/components/brand-mark";
import { useAuth } from "@/hooks/use-auth";

import { openCookiePreferences } from "@/lib/cookie-consent";

function XLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className={className}>
      <path d="M18.244 2H21l-6.52 7.45L22 22h-6.594l-5.163-6.75L4.4 22H1.64l6.98-7.97L2 2h6.75l4.67 6.17L18.244 2Zm-1.156 18.4h1.827L7.02 3.5H5.06L17.088 20.4Z" />
    </svg>
  );
}

function ThreadsLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className={className}>
      <path d="M17.1 11.14a7.6 7.6 0 0 0-.29-.13c-.17-3.13-1.88-4.92-4.75-4.94h-.04c-1.72 0-3.15.73-4.03 2.07l1.58 1.08c.66-1 1.69-1.21 2.45-1.21h.03c.95 0 1.66.28 2.12.82.33.39.56.94.67 1.62a15.1 15.1 0 0 0-2.75-.14c-2.77.16-4.55 1.77-4.43 4.02.06 1.14.63 2.12 1.6 2.76.82.54 1.88.8 2.98.75 1.45-.08 2.57-.63 3.35-1.64.6-.77.97-1.76 1.14-3.01.68.41 1.19.95 1.47 1.6.48 1.1.5 2.9-.97 4.37-1.29 1.29-2.84 1.85-5.19 1.86-2.6-.02-4.57-.85-5.85-2.48C4.98 17.42 4.36 15.28 4.34 12c.02-3.28.64-5.42 1.85-6.94C7.47 3.43 9.44 2.6 12.04 2.58c2.62.02 4.6.86 5.9 2.49.64.8 1.12 1.81 1.44 2.99l1.85-.49c-.39-1.45-1-2.7-1.83-3.74C17.74 1.75 15.28.66 12.05.64h-.01C8.81.66 6.38 1.76 4.8 3.9 3.4 5.79 2.67 8.43 2.65 11.99v.02c.02 3.56.75 6.2 2.16 8.09 1.58 2.13 4.01 3.23 7.23 3.25h.01c2.86-.02 4.88-.77 6.54-2.43 2.17-2.17 2.1-4.89 1.39-6.55-.51-1.19-1.49-2.16-2.83-2.8Zm-4.93 5.01c-1.22.07-2.48-.48-2.54-1.66-.05-.87.62-1.85 2.62-1.96.23-.02.45-.02.67-.02.73 0 1.4.07 2.02.21-.23 2.88-1.58 3.37-2.77 3.43Z" />
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
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const barePath = (() => {
    const m = pathname.match(/^\/(de|ger|es|it|fr)(\/.*)?$/);
    return m ? (m[2] || "/") : pathname || "/";
  })();
  const { isAuthenticated, user } = useAuth();
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
        <a href={href("/")} className="group flex shrink-0 items-center">
          <BrandMark size="sm" className="transition-opacity group-hover:opacity-70" />
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
              <DropdownMenuContent
                align="end"
                sideOffset={10}
                className="w-[17.5rem] overflow-hidden rounded-xl border border-border/70 bg-card p-0 shadow-[0_1px_2px_rgba(16,24,40,0.06),0_12px_32px_-8px_rgba(16,24,40,0.18)]"
              >
                <div className="border-b border-border/60 bg-muted/40 px-3.5 py-3">
                  <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Signed in as</div>
                  <div className="mt-1 truncate text-[13px] font-medium text-foreground">
                    {user?.name ?? user?.email ?? "Your account"}
                  </div>
                  {user?.email && user?.name ? (
                    <div className="truncate text-[11px] text-muted-foreground">{user.email}</div>
                  ) : null}
                </div>
                <div className="p-1.5">
                  {[
                    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard", hint: "Usage & activity" },
                    { to: "/account", icon: Settings, label: "Account settings", hint: "Profile & security" },
                    { to: "/subscription", icon: CreditCard, label: "Subscription", hint: "Plan & billing" },
                  ].map((item) => (
                    <DropdownMenuItem key={item.to} asChild className="rounded-lg px-2 py-2 focus:bg-muted/70">
                      <a href={href(item.to)} className="flex cursor-pointer items-center gap-2.5">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border/70 bg-background text-muted-foreground">
                          <item.icon className="h-3.5 w-3.5" />
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-[13px] font-medium text-foreground">{item.label}</span>
                          <span className="block truncate text-[11px] text-muted-foreground">{item.hint}</span>
                        </span>
                      </a>
                    </DropdownMenuItem>
                  ))}
                </div>
                <div className="border-t border-border/60 p-1.5">
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 text-[13px] focus:bg-muted/70"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border/70 bg-background text-muted-foreground">
                      <LogOut className="h-3.5 w-3.5" />
                    </span>
                    Sign out
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
    <footer className="relative overflow-hidden border-t border-border bg-background text-foreground">
      {/* light-theme: same soft signal wash as the hero */}
      <div className="pointer-events-none absolute inset-0 -z-0 bg-signal dark:hidden" />
      <div className="pointer-events-none absolute inset-0 -z-0 bg-grid opacity-60 dark:hidden" />
      {/* dark-theme gradient: near-black graphite */}
      <div
        className="pointer-events-none absolute inset-0 -z-0 hidden dark:block"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 70% 60% at 15% -10%, rgba(99,102,241,0.20), transparent 60%), radial-gradient(ellipse 60% 50% at 90% 0%, rgba(148,163,184,0.10), transparent 58%), linear-gradient(180deg, #14141a 0%, #0c0c11 55%, #06060a 100%)",
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-4 py-20 sm:px-6 md:grid-cols-4">

        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <BrandMark size="lg" className="text-foreground" />
          </div>
          <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
            Land more interviews with AI-tailored CVs, cover letters, and ATS scoring — built for every job description, in 60 seconds.
          </p>

          <a
            href="mailto:hello@applywise.eu"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-foreground/[0.04] px-3.5 py-2 text-xs text-foreground backdrop-blur transition hover:border-foreground/30 hover:bg-foreground/[0.08] hover:text-primary"
          >
            <Search className="h-3.5 w-3.5" /> Ask us anything you would like to see on ApplyWise.
          </a>
          <div className="mt-6 flex items-center gap-3">
            <a
              href="#"
              aria-label="LinkedIn"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-foreground/[0.04] text-foreground backdrop-blur transition hover:border-foreground/30 hover:bg-foreground/[0.08] hover:text-primary"
            >
              <LinkedinLogo className="h-4 w-4" />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-foreground/[0.04] text-foreground backdrop-blur transition hover:border-foreground/30 hover:bg-foreground/[0.08] hover:text-primary"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href="#"
              aria-label="X"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-foreground/[0.04] text-foreground backdrop-blur transition hover:border-foreground/30 hover:bg-foreground/[0.08] hover:text-primary"
            >
              <XLogo className="h-4 w-4" />
            </a>
            <a
              href="https://www.threads.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Threads"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-foreground/[0.04] text-foreground backdrop-blur transition hover:border-foreground/30 hover:bg-foreground/[0.08] hover:text-primary"
            >
              <ThreadsLogo className="h-4 w-4" />
            </a>
          </div>

        </div>
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Tools</div>
          <ul className="mt-4 space-y-2.5 text-[14px] text-muted-foreground">
            {[["/cv", "CV Generator"], ["/cover-letter", "Cover Letter Generator"], ["/humanizer", "Humanizer"], ["/ats", "ATS Optimizer"], ["/library", "Prompt Library"]].map(([to, label]) => (
              <li key={to}>
                <a href={href(to)} className="inline-block transition-colors hover:text-primary">{label}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Company</div>
          <ul className="mt-4 space-y-2.5 text-[14px] text-muted-foreground">
            {[["/pricing", "Pricing"], ["/login", "Sign in"], ["/signup", "Create account"]].map(([to, label]) => (
              <li key={to}>
                <a href={href(to)} className="inline-block transition-colors hover:text-primary">{label}</a>
              </li>
            ))}
          </ul>
        </div>

      </div>
      <div className="relative border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <a href={href("/status")} className="inline-flex items-center gap-2 text-foreground transition hover:text-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            All Systems Operational
          </a>
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <a href={href("/terms")} className="underline-offset-4 transition hover:text-primary hover:underline">Terms &amp; Privacy</a>
            <a href={href("/sitemap")} className="underline-offset-4 transition hover:text-primary hover:underline">Sitemap</a>
            <a href={href("/cookies")} className="underline-offset-4 transition hover:text-primary hover:underline">Cookies</a>
            <button
              type="button"
              onClick={() => openCookiePreferences()}
              className="underline-offset-4 transition hover:text-primary hover:underline"
            >
              Cookie settings
            </button>
          </nav>
        </div>
      </div>
      <div className="relative border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:px-6">
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

