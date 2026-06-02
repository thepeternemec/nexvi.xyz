import { Link } from "@tanstack/react-router";
import { Search, Menu, X, Languages } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { type Locale, localePathPrefix, t } from "@/lib/i18n";

function LanguageSwitcher({ locale }: { locale: Locale }) {
  const other: Locale = locale === "en" ? "de" : "en";
  const href = localePathPrefix[other] || "/";
  const label = other === "de" ? "DE" : "EN";
  return (
    <a
      href={href}
      hrefLang={other}
      aria-label={`Switch to ${other === "de" ? "Deutsch" : "English"}`}
      className="inline-flex items-center gap-1.5 rounded-full border border-border/70 dark:border-border/90 bg-background/60 dark:bg-background/80 px-3 py-1.5 text-xs font-medium text-muted-foreground dark:text-foreground/80 transition hover:bg-background hover:text-foreground dark:hover:text-foreground"
    >
      <Languages className="h-3.5 w-3.5" />
      <span>{locale.toUpperCase()}</span>
      <span className="text-muted-foreground/50 dark:text-foreground/40">/</span>
      <span>{label}</span>
    </a>
  );
}

export function SiteHeader({ locale = "en" as Locale }: { locale?: Locale }) {
  const [open, setOpen] = useState(false);
  const prefix = localePathPrefix[locale];
  const nav = t[locale].nav;
  const homeHref = prefix || "/";
  const link = (p: string) => `${prefix}${p}`;
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 dark:border-border/80 bg-background/80 dark:bg-background/95 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 font-bold">
        <a href={homeHref} className="flex items-center">
          <span className="font-display text-xl tracking-tight">Prompt Academia</span>
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          <a href={link("/marketplace")} className="text-sm text-muted-foreground dark:text-foreground/80 transition-colors hover:text-foreground">{nav.marketplace}</a>
          <a href={link("/bundles")} className="text-sm text-muted-foreground dark:text-foreground/80 transition-colors hover:text-foreground">{nav.bundles}</a>
          <a href={link("/assistant")} className="text-sm text-muted-foreground dark:text-foreground/80 transition-colors hover:text-foreground">{nav.assistant}</a>
          <a href={link("/creators")} className="text-sm text-muted-foreground dark:text-foreground/80 transition-colors hover:text-foreground">{nav.creators}</a>
          <a href={link("/pricing")} className="text-sm text-muted-foreground dark:text-foreground/80 transition-colors hover:text-foreground">{nav.pricing}</a>
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <LanguageSwitcher locale={locale} />
          <Link to="/login"><Button variant="ghost" size="sm">{t[locale].signIn}</Button></Link>
          <Link to="/signup"><Button size="sm" className="rounded-full">{t[locale].getStarted}</Button></Link>
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher locale={locale} />
          <button onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-border/60 bg-background md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4">
            <a href={link("/marketplace")} onClick={() => setOpen(false)} className="text-sm">{nav.marketplace}</a>
            <a href={link("/bundles")} onClick={() => setOpen(false)} className="text-sm">{nav.bundles}</a>
            <a href={link("/assistant")} onClick={() => setOpen(false)} className="text-sm">{nav.assistant}</a>
            <a href={link("/creators")} onClick={() => setOpen(false)} className="text-sm">{nav.creators}</a>
            <a href={link("/pricing")} onClick={() => setOpen(false)} className="text-sm">{nav.pricing}</a>
            <div className="mt-2 flex gap-2">
              <Link to="/login" className="flex-1"><Button variant="outline" size="sm" className="w-full">{t[locale].signIn}</Button></Link>
              <Link to="/signup" className="flex-1"><Button size="sm" className="w-full">{t[locale].getStarted}</Button></Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-muted/30">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-5">
        <div className="md:col-span-2">
          <div className="flex items-center">
            <span className="font-display text-xl tracking-tight">Prompt Academia</span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            The friendly home for AI prompts that help everyday people get real outcomes.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/60 px-3 py-1.5 text-xs text-muted-foreground">
            <Search className="h-3.5 w-3.5" /> Search prompts, creators, outcomes
          </div>
        </div>
        <div>
          <div className="text-sm font-medium">Product</div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/marketplace">Marketplace</Link></li>
            <li><Link to="/bundles">Bundles</Link></li>
            <li><Link to="/assistant">AI Assistant</Link></li>
            <li><Link to="/pricing">Pricing</Link></li>
            <li><Link to="/creators">Creators</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-medium">For creators</div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/creator">Creator dashboard</Link></li>
            <li><Link to="/creator">Sell prompts</Link></li>
            <li><Link to="/pricing">Commissions</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-medium">Company</div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><a href="#faq">FAQ</a></li>
            <li><a href="#">Privacy</a></li>
            <li><a href="#">Terms</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:px-6">
          <div>© {new Date().getFullYear()} Prompt Academia. Made for curious humans.</div>
          <div>Crafted with care.</div>
        </div>
      </div>
    </footer>
  );
}

export function SiteShell({ children, locale = "en" }: { children: React.ReactNode; locale?: Locale }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader locale={locale} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
