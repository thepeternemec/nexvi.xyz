import { Link } from "@tanstack/react-router";
import { Sparkles, Search, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-amber-400 text-white shadow-sm">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="font-display text-xl tracking-tight">Prompt Academia</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <Link to="/marketplace" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Marketplace</Link>
          <Link to="/assistant" className="text-sm text-muted-foreground transition-colors hover:text-foreground">AI Assistant</Link>
          <Link to="/creators" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Creators</Link>
          <Link to="/pricing" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Pricing</Link>
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Link to="/login"><Button variant="ghost" size="sm">Sign in</Button></Link>
          <Link to="/signup"><Button size="sm" className="rounded-full">Get started</Button></Link>
        </div>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-border/60 bg-background md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4">
            <Link to="/marketplace" onClick={() => setOpen(false)} className="text-sm">Marketplace</Link>
            <Link to="/assistant" onClick={() => setOpen(false)} className="text-sm">AI Assistant</Link>
            <Link to="/creators" onClick={() => setOpen(false)} className="text-sm">Creators</Link>
            <Link to="/pricing" onClick={() => setOpen(false)} className="text-sm">Pricing</Link>
            <div className="mt-2 flex gap-2">
              <Link to="/login" className="flex-1"><Button variant="outline" size="sm" className="w-full">Sign in</Button></Link>
              <Link to="/signup" className="flex-1"><Button size="sm" className="w-full">Get started</Button></Link>
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
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-amber-400 text-white">
              <Sparkles className="h-4 w-4" />
            </div>
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

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
