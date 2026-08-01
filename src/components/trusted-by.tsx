import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const companies = [
  { name: "ServiceNow", className: "font-sans font-semibold tracking-tight" },
  { name: "Apple", className: "font-sans font-normal tracking-tight" },
  { name: "Bloomberg", className: "font-sans font-bold tracking-tighter" },
  { name: "BNP PARIBAS", className: "font-sans font-semibold tracking-wide text-sm" },
  { name: "Google", className: "font-sans font-normal tracking-tight" },
  { name: "JPMorganChase", className: "font-serif font-medium tracking-tight" },
  { name: "Siemens", className: "font-sans font-medium tracking-widest text-sm" },
];

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

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 opacity-70 grayscale">
          {companies.map((c) => (
            <span
              key={c.name}
              className={`text-lg text-foreground/70 transition-opacity hover:opacity-100 ${c.className}`}
            >
              {c.name}
            </span>
          ))}
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

        <p className="mx-auto mt-8 max-w-2xl text-xs leading-relaxed text-muted-foreground">
          * We respect user privacy and don't track employment details. The companies shown
          represent professionals who have chosen our platform for building their resumes.
        </p>
      </div>
    </section>
  );
}
