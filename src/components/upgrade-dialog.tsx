import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { alternateHref, detectLocaleFromPath } from "@/lib/i18n";

const EVENT = "applywise:upgrade-prompt";

export type UpgradeContext = { title?: string; reason?: string };

/** Opens the premium upsell dialog from anywhere in the app. */
export function openUpgradeDialog(ctx: UpgradeContext = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<UpgradeContext>(EVENT, { detail: ctx }));
}

const BENEFITS = [
  "Every Premium prompt, unlocked",
  "AI CV, cover letter & ATS scoring",
  "Humanizer to de-robotise your drafts",
  "Apply-ready templates and packs",
];

export function UpgradeDialog() {
  const [open, setOpen] = useState(false);
  const [ctx, setCtx] = useState<UpgradeContext>({});
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const locale = detectLocaleFromPath(pathname);

  useEffect(() => {
    const handler = (e: Event) => {
      setCtx((e as CustomEvent<UpgradeContext>).detail ?? {});
      setOpen(true);
    };
    window.addEventListener(EVENT, handler);
    return () => window.removeEventListener(EVENT, handler);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl leading-tight">

            {ctx.title ? `“${ctx.title}” is a Premium prompt` : "This prompt is Premium"}
          </DialogTitle>
          <DialogDescription>
            {ctx.reason ?? "Start a free 7-day trial to open the full prompt — no charge until the trial ends, cancel anytime."}
          </DialogDescription>
        </DialogHeader>

        <ul className="grid gap-2 text-sm text-muted-foreground">
          {BENEFITS.map(b => (
            <li key={b} className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {b}
            </li>
          ))}
        </ul>

        <div className="mt-2 flex flex-col gap-2">
          <Button asChild className="rounded-full">
            <a href={`${alternateHref(locale, "/pricing")}?plan=pro&trial=1`}>Start free 7-day trial</a>
          </Button>
          <Button asChild variant="secondary" className="rounded-full">
            <a href={alternateHref(locale, "/pricing")}>Compare plans</a>
          </Button>
          <button
            onClick={() => setOpen(false)}
            className="mt-1 inline-flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            Keep browsing free prompts
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
