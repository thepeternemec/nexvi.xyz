import { useRouterState } from "@tanstack/react-router";
import { Crown, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { alternateHref, detectLocaleFromPath } from "@/lib/i18n";
import { useUsage } from "@/hooks/use-usage";
import { FREE_LIMITS, TOOL_KEYS, TOOL_META } from "@/lib/plan-limits";

/** Credit summary rendered inside the header account menu. */
export function NavCredits() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const href = (p: string) => alternateHref(detectLocaleFromPath(pathname), p);
  const { isAuthenticated, isPremium, used, loading } = useUsage();

  if (!isAuthenticated || loading) return null;

  if (isPremium) {
    return (
      <div className="border-b border-border/60 px-3 py-3">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[11px] font-semibold">
          <Crown className="h-3 w-3 text-primary" /> Premium
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">Unlimited AI generations.</p>
      </div>
    );
  }

  return (
    <div className="border-b border-border/60 px-3 py-3">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Free Plan</div>
      <div className="mt-2 space-y-1.5">
        {TOOL_KEYS.map((t) => {
          const left = Math.max(0, FREE_LIMITS[t] - used[t]);
          return (
            <div key={t} className="flex items-center justify-between gap-3 text-[12px]">
              <span className="text-muted-foreground">{TOOL_META[t].plural}</span>
              <span className={`font-medium tabular-nums ${left === 0 ? "text-rose-500" : ""}`}>
                {left} / {FREE_LIMITS[t]} remaining
              </span>
            </div>
          );
        })}
      </div>
      <a href={href("/pricing")} className="mt-3 block">
        <Button size="sm" className="h-7 w-full rounded-full text-[11px]">
          <Zap className="h-3 w-3" /> Upgrade
        </Button>
      </a>
    </div>
  );
}
