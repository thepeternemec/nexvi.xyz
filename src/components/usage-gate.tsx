import { useCallback, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Crown, Check, Lock, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { alternateHref, detectLocaleFromPath } from "@/lib/i18n";
import { useUsage } from "@/hooks/use-usage";
import { FREE_LIMITS, PREMIUM_BENEFITS, TOOL_META, type ToolKey } from "@/lib/plan-limits";

function useHref() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const locale = detectLocaleFromPath(pathname);
  return (p: string) => alternateHref(locale, p);
}

/* ---------- Anonymous sign-up modal ---------- */
export function CreateAccountModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const href = useHref();
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg overflow-hidden rounded-3xl p-0">
        <div className="border-b border-border/60 bg-gradient-to-br from-background via-muted/50 to-primary/[0.06] p-7 text-foreground dark:border-white/10 dark:from-[#0b1220] dark:via-[#111a2e] dark:to-[#0b1220] dark:text-neutral-50">

          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" /> Free preview used
          </div>
          <DialogHeader className="mt-4 space-y-2 text-left">
            <DialogTitle className="font-display text-2xl tracking-tight text-neutral-50">
              Create your free account
            </DialogTitle>
            <DialogDescription className="text-sm text-neutral-300">
              You&apos;ve unlocked your free preview. Create a free account to continue building
              professional CVs, cover letters, ATS analyses, and AI-humanized content.
            </DialogDescription>
          </DialogHeader>
          <ul className="mt-5 grid gap-2 text-sm text-neutral-200">
            {(["cv", "coverLetter", "ats", "humanizer"] as ToolKey[]).map((t) => (
              <li key={t} className="inline-flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" /> {FREE_LIMITS[t]} free {TOOL_META[t].plural}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-2 p-6 pt-5 sm:flex-row">
          <a href={href("/signup")} className="sm:flex-1">
            <Button size="lg" className="w-full rounded-full">Create Free Account</Button>
          </a>
          <a href={href("/login")} className="sm:flex-1">
            <Button size="lg" variant="outline" className="w-full rounded-full">Log In</Button>
          </a>
          <Button size="lg" variant="ghost" className="rounded-full" onClick={onClose}>
            Maybe Later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ---------- Premium paywall ---------- */
export function PremiumPaywall({
  open,
  tool,
  onClose,
}: {
  open: boolean;
  tool: ToolKey;
  onClose: () => void;
}) {
  const href = useHref();
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl overflow-hidden rounded-3xl p-0">
        <div className="bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-800 p-7 text-neutral-50 dark:from-[#0b1220] dark:via-[#111a2e] dark:to-[#0b1220]">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
            <Lock className="h-3.5 w-3.5" /> {TOOL_META[tool].label}
          </div>
          <DialogHeader className="mt-4 space-y-2 text-left">
            <DialogTitle className="font-display text-3xl tracking-tight text-neutral-50">
              You&apos;ve reached your free limit.
            </DialogTitle>
            <DialogDescription className="text-sm text-neutral-300">
              Upgrade to Premium for unlimited AI-powered career tools.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            {PREMIUM_BENEFITS.map((b) => (
              <div
                key={b}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-neutral-100 transition hover:bg-white/10"
              >
                <Check className="h-4 w-4 shrink-0 text-primary" /> {b}
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2 p-6 pt-5 sm:flex-row sm:items-center">
          <a href={href("/pricing")} className="sm:flex-1">
            <Button size="lg" className="w-full rounded-full">
              <Crown className="h-4 w-4" /> Upgrade to Premium
            </Button>
          </a>
          <Button size="lg" variant="ghost" className="rounded-full" onClick={onClose}>
            Continue with Free Plan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ---------- Inline credit meter + last-credit warning ---------- */
export function ToolCreditBar({ tool }: { tool: ToolKey }) {
  const href = useHref();
  const { isAuthenticated, isPremium, used, loading } = useUsage();

  if (loading) return null;

  if (isPremium) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-foreground">
        <Crown className="h-3.5 w-3.5 text-primary" /> Premium — unlimited generations
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground">
        <Sparkles className="h-3.5 w-3.5 text-primary" /> 1 free preview generation — no account needed
      </div>
    );
  }

  const limit = FREE_LIMITS[tool];
  const left = Math.max(0, limit - used[tool]);
  const pct = Math.min(100, Math.round((used[tool] / limit) * 100));

  return (
    <div className="w-full max-w-sm space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium">
          {TOOL_META[tool].plural} · {left} / {limit} remaining
        </span>
        <a href={href("/pricing")} className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
          Upgrade
        </a>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-foreground transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      {left === 1 && (
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-primary/30 bg-primary/10 px-3 py-2 text-xs animate-in fade-in slide-in-from-bottom-1">
          <Zap className="h-3.5 w-3.5 text-primary" />
          <span>
            You&apos;re on your last free {TOOL_META[tool].plural.replace(/s$/, "")}. Upgrade anytime for
            unlimited AI generations.
          </span>
          <a href={href("/pricing")}>
            <Button size="sm" className="h-7 rounded-full px-3 text-xs">Upgrade to Premium</Button>
          </a>
        </div>
      )}
    </div>
  );
}

/* ---------- Orchestration hook used by every tool page ---------- */
export function useToolGate(tool: ToolKey) {
  const usage = useUsage();
  const [accountOpen, setAccountOpen] = useState(false);
  const [paywallOpen, setPaywallOpen] = useState(false);

  const locked =
    !usage.loading &&
    (usage.isAuthenticated
      ? !usage.isPremium && FREE_LIMITS[tool] - usage.used[tool] <= 0
      : usage.anonUsed);

  const before = useCallback(async () => {
    if (!usage.isAuthenticated) {
      if (usage.anonUsed) {
        setAccountOpen(true);
        return false;
      }
      return true;
    }
    if (usage.isPremium) return true;
    if (FREE_LIMITS[tool] - usage.used[tool] <= 0) {
      setPaywallOpen(true);
      return false;
    }
    return true;
  }, [tool, usage.anonUsed, usage.isAuthenticated, usage.isPremium, usage.used]);

  const after = useCallback(async () => {
    if (!usage.isAuthenticated) {
      usage.markAnonUsed();
      setAccountOpen(true);
      return;
    }
    if (usage.isPremium) return;
    // The credit itself is consumed server-side inside the AI handler
    // (src/lib/ai-guard.server.ts); this only re-syncs the displayed counters.
    try {
      await usage.refresh();
    } catch {
      /* usage tracking must never break a successful generation */
    }
  }, [usage]);

  const gates = (
    <>
      <CreateAccountModal open={accountOpen} onClose={() => setAccountOpen(false)} />
      <PremiumPaywall open={paywallOpen} tool={tool} onClose={() => setPaywallOpen(false)} />
    </>
  );

  return {
    ...usage,
    locked,
    before,
    after,
    gates,
    openPaywall: () => setPaywallOpen(true),
    openAccount: () => setAccountOpen(true),
  };
}

/* ---------- Locked overlay wrapper ---------- */
export function LockedOverlay({
  locked,
  reason,
  onAction,
  children,
}: {
  locked: boolean;
  reason: "account" | "premium";
  onAction: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <div className={locked ? "pointer-events-none select-none blur-sm transition duration-300" : "transition duration-300"}>
        {children}
      </div>
      {locked && (
        <div className="absolute inset-0 z-10 grid place-items-center rounded-3xl bg-background/40 backdrop-blur-[2px] animate-in fade-in">
          <div className="mx-4 max-w-sm rounded-3xl border border-border/70 bg-card/95 p-6 text-center shadow-xl">
            <div className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-foreground text-background">
              <Lock className="h-5 w-5" />
            </div>
            <div className="font-display mt-4 text-xl tracking-tight">
              {reason === "account" ? "Create your free account" : "You've reached your free limit."}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {reason === "account"
                ? "You've used your free preview. Sign up free to keep generating."
                : "Upgrade to Premium for unlimited AI-powered career tools."}
            </p>
            <Button className="mt-5 w-full rounded-full" onClick={onAction}>
              {reason === "account" ? "Continue" : "See Premium"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
