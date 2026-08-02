import type { LucideIcon } from "lucide-react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Step = { label: string; text: string };

export function ToolHero({
  eyebrow,
  title,
  titleEm,
  titleAfter,
  sub,
  bullets,
  steps,
  icon: Icon,
}: {
  eyebrow: string;
  title: string;
  titleEm?: string;
  titleAfter?: string;
  sub: string;
  bullets: string[];
  steps?: Step[];
  icon?: LucideIcon;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div className="absolute inset-0 -z-20 bg-grid mask-fade-b opacity-70" />
      <div className="absolute inset-0 -z-10 bg-signal" />
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:gap-14">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-[11px] tracking-wide text-muted-foreground backdrop-blur">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              {eyebrow}
            </div>

            <h1 className="mt-6 font-display text-[1.9rem] leading-[1.12] tracking-tight sm:text-[2.25rem] lg:text-[2.5rem]">
              {title} {titleEm && <span className="text-primary">{titleEm}</span>} {titleAfter}
            </h1>

            <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-muted-foreground">{sub}</p>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border/60 pt-6 text-[11px] tracking-wide text-muted-foreground">
              {bullets.map((b) => (
                <span key={b} className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" /> {b}
                </span>
              ))}
            </div>
          </div>

          {steps && steps.length > 0 && (
            <div className="relative">
              <div className="overflow-hidden rounded-2xl border border-border/70 bg-card/80 shadow-[0_24px_60px_-40px_rgba(15,15,40,0.45)] backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-border/60 px-4 py-2.5">
                  <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    {Icon && <Icon className="h-3.5 w-3.5" />} how it works
                  </div>
                  <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] tracking-wide text-primary">
                    ~60s
                  </span>
                </div>
                <ol className="divide-y divide-border/60">
                  {steps.map((s, i) => (
                    <li key={s.label} className="flex gap-4 px-5 py-4">
                      <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-border/70 text-[11px] text-muted-foreground">
                        {i + 1}
                      </span>
                      <div>
                        <div className="text-[13px]">{s.label}</div>
                        <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">{s.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function ToolOutro({
  title,
  text,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: {
  title: string;
  text: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6">
      <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/70 p-8 backdrop-blur sm:p-10">
        <div className="absolute inset-0 -z-10 bg-signal opacity-80" />
        <h2 className="font-display text-[1.35rem] tracking-tight sm:text-[1.6rem]">{title}</h2>
        <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-muted-foreground">{text}</p>
        <div className="mt-6 flex flex-wrap gap-2.5">
          <a href={primaryHref}>
            <Button className="rounded-full px-5">
              {primaryLabel} <ArrowRight className="h-4 w-4" />
            </Button>
          </a>
          {secondaryLabel && secondaryHref && (
            <a href={secondaryHref}>
              <Button variant="outline" className="rounded-full px-5 font-normal">
                {secondaryLabel}
              </Button>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
