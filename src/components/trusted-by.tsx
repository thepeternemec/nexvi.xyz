import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { BrandMarkColor, brands } from "@/components/brand-logos";

export function TrustedBy({
  ctaLabel,
  ctaHref,
  onCta,
}: {
  ctaLabel?: string;
  ctaHref?: string;
  onCta?: () => void;
}) {
  return (
    <section className="border-t border-border/60 bg-muted/30">
      <div className="mx-auto w-full max-w-6xl px-4 py-14 text-center sm:px-6">
        <div className="text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
          Trusted by professionals from
        </div>

        <div className="logo-marquee-mask group mt-8 overflow-hidden">
          <div className="animate-logo-marquee flex w-max items-center gap-x-16 group-hover:[animation-play-state:paused]">
            {[...brands, ...brands].map((b, i) => (
              <span
                key={`${b.key}-${i}`}
                className="flex shrink-0 items-center"
                aria-hidden={i >= brands.length}
                title={b.name}
              >
                <BrandMarkColor brand={b.key} className="h-9 w-9" />
              </span>
            ))}
          </div>
        </div>




        {ctaLabel && (
          <div className="mt-10">
            {ctaHref ? (
              <a href={ctaHref} className="inline-flex">
                <Button size="lg" className="rounded-full px-7">
                  {ctaLabel} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </a>
            ) : (
              <Button size="lg" className="rounded-full px-7" onClick={onCta}>
                {ctaLabel} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        )}

      </div>
    </section>
  );
}
