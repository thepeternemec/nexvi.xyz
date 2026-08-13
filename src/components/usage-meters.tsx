import { FileText, Mail, Target, Wand2, Infinity as InfinityIcon, Crown } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { TOOL_META, type ToolKey } from "@/lib/plan-limits";
import { useUsage } from "@/hooks/use-usage";
import { cn } from "@/lib/utils";

const ICONS: Record<ToolKey, LucideIcon> = {
  cv: FileText,
  coverLetter: Mail,
  ats: Target,
  humanizer: Wand2,
};

function Ring({ used, limit, premium }: { used: number; limit: number; premium: boolean }) {
  const pct = premium ? 1 : limit > 0 ? Math.min(1, used / limit) : 0;
  const r = 22;
  const c = 2 * Math.PI * r;
  const full = !premium && used >= limit;
  return (
    <div className="relative h-14 w-14 shrink-0">
      <svg viewBox="0 0 56 56" className="h-14 w-14 -rotate-90">
        <circle cx="28" cy="28" r={r} fill="none" strokeWidth="4" className="stroke-muted" />
        <circle
          cx="28"
          cy="28"
          r={r}
          fill="none"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          className={cn(
            "transition-[stroke-dashoffset] duration-700 ease-out",
            premium ? "stroke-primary" : full ? "stroke-rose-500" : "stroke-foreground",
          )}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-[13px] font-semibold tabular-nums">
        {premium ? <InfinityIcon className="h-4 w-4 text-primary" /> : used}
      </div>
    </div>
  );
}

export function UsageMeters() {
  const usage = useUsage();
  const premium = usage.isPremium;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="font-display text-2xl tracking-tight">Your usage</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {premium
              ? "Premium — unlimited generations across every tool."
              : "Free plan credits, refreshed as you upgrade or reset."}
          </p>
        </div>
        {premium && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Crown className="h-3.5 w-3.5" /> Premium
          </span>
        )}
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {usage.tools.map((t) => {
          const Icon = ICONS[t];
          const limit = usage.limits[t];
          const used = Math.min(usage.used[t], premium ? usage.used[t] : limit);
          const left = premium ? Infinity : Math.max(0, limit - used);
          const full = !premium && left === 0;
          return (
            <div
              key={t}
              className={cn(
                "group relative overflow-hidden rounded-2xl border bg-card p-5 transition hover:shadow-md",
                full ? "border-rose-500/30" : "border-border/70",
              )}
            >
              <div className="flex items-start gap-4">
                <Ring used={used} limit={limit} premium={premium} />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-sm font-medium">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{TOOL_META[t].plural}</span>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground tabular-nums">
                    {usage.loading
                      ? "Loading…"
                      : premium
                        ? `${used} generated · unlimited`
                        : `${used} of ${limit} used`}
                  </div>
                </div>
              </div>

              {!premium && (
                <div className="mt-4 flex gap-1" aria-hidden>
                  {Array.from({ length: limit }).map((_, i) => (
                    <span
                      key={i}
                      className={cn(
                        "h-1.5 flex-1 rounded-full transition-colors duration-500",
                        i < used ? (full ? "bg-rose-500" : "bg-foreground") : "bg-muted",
                      )}
                    />
                  ))}
                </div>
              )}

              <div className="mt-3 text-[11px] font-medium">
                {premium ? (
                  <span className="text-primary">Unlimited on Premium</span>
                ) : full ? (
                  <a href="/pricing" className="text-rose-500 underline-offset-4 hover:underline">
                    Limit reached — upgrade
                  </a>
                ) : (
                  <span className="text-muted-foreground">
                    {left} {left === 1 ? "credit" : "credits"} left
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
