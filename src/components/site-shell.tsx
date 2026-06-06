import { Link } from "@tanstack/react-router";
import { Search, Menu, X, Sun, Moon, Briefcase } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

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
  { href: "/library", label: "Find a Job Library" },
  { href: "/cv", label: "CV Generator" },
  { href: "/cover-letter", label: "Cover Letter" },
  { href: "/ats", label: "ATS Optimizer" },
  { href: "/pricing", label: "Pricing" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 dark:border-border/80 bg-background/80 dark:bg-background/95 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 font-bold">
        <a href="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-foreground text-background">
            <Briefcase className="h-4 w-4" />
          </span>
          <span className="font-display text-xl tracking-tight">getHeired</span>
        </a>
        <nav className="hidden items-center gap-6 md:flex">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="text-sm text-muted-foreground dark:text-foreground/80 transition-colors hover:text-foreground">
              {n.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <Link to="/login"><Button variant="ghost" size="sm">Sign in</Button></Link>
          <a href="/library"><Button size="sm" className="rounded-full">Find a job prompt</Button></a>
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-border/60 bg-background md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="text-sm">{n.label}</a>
            ))}
            <div className="mt-2 flex gap-2">
              <Link to="/login" className="flex-1"><Button variant="outline" size="sm" className="w-full">Sign in</Button></Link>
              <a href="/library" className="flex-1"><Button size="sm" className="w-full">Find a job prompt</Button></a>
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
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-foreground text-background">
              <Briefcase className="h-4 w-4" />
            </span>
            <span className="font-display text-xl tracking-tight">getHeired</span>
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
            <li><a href="/cv">CV Generator</a></li>
            <li><a href="/cover-letter">Cover Letter Generator</a></li>
            <li><a href="/ats">ATS Optimizer</a></li>
            <li><a href="/library">Prompt Library</a></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-medium">Company</div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><a href="/pricing">Pricing</a></li>
            <li><a href="/login">Sign in</a></li>
            <li><a href="/signup">Create account</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:px-6">
          <div>© {new Date().getFullYear()} getHeired. Built for job seekers.</div>
          <div>Land your next role.</div>
        </div>
      </div>
    </footer>
  );
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
