import { Check, X, Sparkles, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type CellValue = boolean | string;

interface ComparisonRow {
  feature: string;
  hint?: string;
  free: CellValue;
  premium: CellValue;
}

interface ComparisonGroup {
  title: string;
  rows: ComparisonRow[];
}

const GROUPS: ComparisonGroup[] = [
  {
    title: "Generation limits",
    rows: [
      { feature: "CV generations", hint: "Tailored to any job description", free: "3 / month", premium: "Unlimited" },
      { feature: "Cover letter generations", hint: "Matched to tone and role", free: "3 / month", premium: "Unlimited" },
      { feature: "ATS score checks", hint: "Keyword and formatting breakdown", free: "3 / month", premium: "Unlimited" },
      { feature: "AI Humanizer runs", hint: "Removes robotic AI phrasing", free: "3 / month", premium: "Unlimited" },
    ],
  },
  {
    title: "Nexvi Copilot",
    rows: [
      { feature: "Copilot chat workspace", hint: "Run every tool from one thread", free: true, premium: true },
      { feature: "Copilot messages", free: "3 / month", premium: "Unlimited" },
      { feature: "Saved Copilot threads", hint: "Pick up where you left off", free: "1 thread", premium: "Unlimited" },
      { feature: "File uploads in Copilot", free: false, premium: true },
    ],
  },
];

function ValueCell({ value, emphasis }: { value: CellValue; emphasis?: boolean }) {
  if (value === true) {
    return (
      <div className="flex justify-center">
        <span
          className={`flex h-6 w-6 items-center justify-center rounded-full ${
            emphasis ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
          }`}
        >
          <Check className="h-3.5 w-3.5" aria-label="Included" />
        </span>
      </div>
    );
  }
  if (value === false) {
    return (
      <div className="flex justify-center">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-muted-foreground/60">
          <X className="h-3.5 w-3.5" aria-label="Not included" />
        </span>
      </div>
    );
  }
  return (
    <span
      className={`block text-center text-sm ${
        emphasis ? "font-semibold text-foreground" : "font-medium text-muted-foreground"
      }`}
    >
      {value}
    </span>
  );
}

export function PricingComparison() {
  return (
    <div className="mx-auto mt-20 max-w-4xl">
      <div className="mb-8 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> Compare plans
        </span>
        <h2 className="font-display mt-4 text-3xl tracking-tight sm:text-4xl">
          Everything on Free. Everything unlocked on Premium.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
          Same tools, same Copilot workspace — Premium just removes every limit for $7 a month.
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-border/70 bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_40px_-24px_rgba(0,0,0,0.25)]">
        <div className="grid grid-cols-[1.6fr_1fr_1fr] border-b border-border/70">
          <div className="px-5 py-6 sm:px-7">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Features
            </div>
          </div>
          <div className="border-l border-border/70 px-3 py-6 text-center">
            <div className="text-sm font-semibold">Free</div>
            <div className="font-display mt-1 text-2xl tracking-tight">$0</div>
            <div className="text-[11px] text-muted-foreground">forever</div>
          </div>
          <div className="relative border-l border-border/70 bg-primary/[0.04] px-3 py-6 text-center dark:bg-primary/[0.08]">
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              <span className="text-sm font-semibold">Premium</span>
              <Badge className="rounded-full px-2 py-0 text-[10px] font-semibold">Best value</Badge>
            </div>
            <div className="font-display mt-1 flex items-baseline justify-center gap-1 text-2xl tracking-tight">
              $7
              <span className="font-sans text-xs font-normal text-muted-foreground">/mo</span>
            </div>
            <div className="text-[11px] text-muted-foreground">cancel anytime</div>
          </div>
        </div>

        {GROUPS.map((group) => (
          <div key={group.title}>
            <div className="grid grid-cols-[1.6fr_1fr_1fr] border-b border-border/60 bg-muted/40">
              <div className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground sm:px-7">
                {group.title}
              </div>
              <div className="border-l border-border/60" />
              <div className="border-l border-border/60 bg-primary/[0.03] dark:bg-primary/[0.06]" />
            </div>
            {group.rows.map((row) => (
              <div
                key={row.feature}
                className="group grid grid-cols-[1.6fr_1fr_1fr] border-b border-border/50 last:border-b-0 transition-colors hover:bg-muted/30"
              >
                <div className="px-5 py-3.5 sm:px-7">
                  <div className="text-sm font-medium">{row.feature}</div>
                  {row.hint && (
                    <div className="mt-0.5 text-xs text-muted-foreground">{row.hint}</div>
                  )}
                </div>
                <div className="flex items-center justify-center border-l border-border/50 px-3 py-3.5">
                  <ValueCell value={row.free} />
                </div>
                <div className="flex items-center justify-center border-l border-border/50 bg-primary/[0.03] px-3 py-3.5 dark:bg-primary/[0.06]">
                  <ValueCell value={row.premium} emphasis />
                </div>
              </div>
            ))}
          </div>
        ))}

        <div className="grid grid-cols-[1.6fr_1fr_1fr] border-t border-border/70 bg-muted/20">
          <div className="hidden px-7 py-5 text-xs text-muted-foreground sm:block">
            14-day refund · secure Stripe checkout
          </div>
          <div className="col-span-3 flex items-center justify-center px-4 py-5 sm:col-span-2 sm:justify-end sm:pr-5">
            <a href="#top" className="inline-flex">
              <Button size="lg" className="group rounded-full shadow-lg shadow-primary/20">
                Go unlimited — $7/mo
                <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-0.5" />
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
