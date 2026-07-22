import { useEffect, useRef, useState } from "react";
import { ArrowRight, FileText, Mail, Target, Sparkles, CheckCircle2, Zap, Library, Search, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteShell } from "@/components/site-shell";
import { copy, type Locale, alternateHref } from "@/lib/i18n";

const ICONS = [Library, FileText, Mail, Target, Wand2];

export function LandingPage({ locale = "en" }: { locale?: Locale }) {
  const c = copy[locale];
  const href = (p: string) => alternateHref(locale, p);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const order = [1, 2, 3, 4, 0];

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      const cards = el.querySelectorAll<HTMLElement>("[data-tool-card]");
      if (!cards.length) return;
      const center = el.scrollLeft + el.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      cards.forEach((card, i) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const d = Math.abs(cardCenter - center);
        if (d < bestDist) { bestDist = d; best = i; }
      });
      setActiveIdx(best);
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToIdx = (i: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelectorAll<HTMLElement>("[data-tool-card]")[i];
    if (!card) return;
    el.scrollTo({ left: card.offsetLeft - (el.clientWidth - card.offsetWidth) / 2, behavior: "smooth" });
  };

  return (
    <SiteShell locale={locale}>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-foreground/[0.04] via-background to-background dark:from-foreground/[0.08]" />
        <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/60 px-3 py-1.5 text-xs font-medium text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5" />
              {c.badge}
            </div>
            <h1 className="mt-6 font-display text-5xl tracking-tight sm:text-6xl lg:text-7xl">
              {c.heroTitleA} <em className="italic text-muted-foreground">{c.heroTitleEm}</em> {c.heroTitleB}
            </h1>
            <p className="mt-6 text-lg text-muted-foreground sm:text-xl">{c.heroSub}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a href={href("/library")}><Button size="lg" className="rounded-full">{c.ctaFind} <ArrowRight className="h-4 w-4" /></Button></a>
              <a href={href("/cv")}><Button size="lg" variant="outline" className="rounded-full">{c.ctaGenerate}</Button></a>
              <a href={href("/ats")}><Button size="lg" variant="ghost" className="rounded-full">{c.ctaAts}</Button></a>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5" /> {c.free}</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5" /> {c.noCard}</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5" /> {c.topModels}</span>
            </div>
          </div>
        </div>
      </section>

      {/* TOOLS */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
        <div className="text-center">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{c.toolsKicker}</div>
          <h2 className="font-display mt-3 text-3xl tracking-tight sm:text-4xl">{c.toolsTitle}</h2>
        </div>
        <div ref={scrollerRef} className="mt-10 -mx-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 [scrollbar-width:thin]">
          <div className="flex gap-5 snap-x snap-mandatory">
            {order.map((i) => {
              const t = c.tools[i];
              const Icon = ICONS[i];
              const link = ["/library", "/cv", "/cover-letter", "/ats", "/humanizer"][i];
              return (
                <a key={link} data-tool-card href={href(link)} className="group relative flex w-[280px] shrink-0 snap-start flex-col rounded-3xl border border-border/70 bg-card p-7 transition hover:border-foreground/30 hover:shadow-lg sm:w-[320px]">
                  {t.badge && (
                    <span className="absolute right-5 top-5 rounded-full bg-foreground px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-background">
                      {t.badge}
                    </span>
                  )}
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-foreground/5 text-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">{t.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">{t.desc}</p>
                  <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
                    {c.open} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </div>
                </a>
              );
            })}
          </div>
        </div>
        <div className="mt-6 flex justify-center gap-2" role="tablist" aria-label="Tools carousel pagination">
          {order.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={activeIdx === i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => scrollToIdx(i)}
              className={`h-1.5 rounded-full transition-all ${activeIdx === i ? "w-6 bg-foreground" : "w-1.5 bg-foreground/25 hover:bg-foreground/40"}`}
            />
          ))}
        </div>
      </section>


      {/* LIBRARY SPOTLIGHT */}
      <section className="border-y border-border/60 bg-muted/20">
        <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/60 px-3 py-1.5 text-xs font-medium text-muted-foreground">
                <Library className="h-3.5 w-3.5" /> {c.librarySpotBadge}
              </div>
              <h2 className="font-display mt-4 text-3xl tracking-tight sm:text-5xl">{c.librarySpotTitle}</h2>
              <p className="mt-4 text-muted-foreground">{c.librarySpotSub}</p>
              <ul className="mt-6 space-y-3 text-sm">
                {c.librarySpotBullets.map((t) => (
                  <li key={t} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-foreground" /> {t}</li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={href("/library")}><Button size="lg" className="rounded-full">{c.browseLibrary} <ArrowRight className="h-4 w-4" /></Button></a>
                <a href={href("/bundles")}><Button size="lg" variant="outline" className="rounded-full">{c.seeBundles}</Button></a>
              </div>
            </div>
            <div className="rounded-3xl border border-border/70 bg-background p-6 shadow-sm">
              <div className="flex items-center gap-2 rounded-full border border-border/70 bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
                <Search className="h-4 w-4" /> "cover letter for product manager"
              </div>
              <div className="mt-4 grid gap-3">
                {[
                  { tag: "Cover Letter", title: "PM cover letter that lands interviews", meta: "Free • 4.9★" },
                  { tag: "Interview", title: "STAR stories from your real experience", meta: "Premium • 4.8★" },
                  { tag: "Outreach", title: "Recruiter cold message that gets replies", meta: "Free • 4.9★" },
                  { tag: "Negotiation", title: "Counter-offer script with comp research", meta: "Premium • 4.9★" },
                ].map((p) => (
                  <a key={p.title} href={href("/marketplace")} className="flex items-center justify-between rounded-xl border border-border/60 bg-card p-3 transition hover:border-foreground/20 hover:shadow-sm">
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{p.tag}</div>
                      <div className="text-sm font-medium">{p.title}</div>
                    </div>
                    <div className="text-xs text-muted-foreground">{p.meta}</div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-y border-border/60 bg-muted/20">
        <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{c.howKicker}</div>
              <h2 className="font-display mt-3 text-3xl tracking-tight sm:text-4xl">{c.howTitle}</h2>
              <p className="mt-4 text-muted-foreground">{c.howSub}</p>
              <ul className="mt-8 space-y-5">
                {c.howSteps.map(([t, d], i) => (
                  <li key={t} className="flex gap-4">
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-foreground text-sm font-semibold text-background">{i + 1}</div>
                    <div>
                      <div className="font-medium">{t}</div>
                      <div className="text-sm text-muted-foreground">{d}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-border/70 bg-background p-6 shadow-sm">
              <div className="rounded-xl bg-muted/40 p-4 font-mono text-xs">
                <div className="text-muted-foreground">// Job description</div>
                <div className="mt-1 line-clamp-3">Senior Product Designer at Linear. Lead end-to-end design for new B2B SaaS workflows. Ship fast. Collaborate with PMs and eng…</div>
              </div>
              <div className="mt-3 rounded-xl bg-muted/40 p-4 font-mono text-xs">
                <div className="text-muted-foreground">// Your background</div>
                <div className="mt-1 line-clamp-2">5 years product design, fintech &amp; SaaS. Led design systems at Stripe-style startups…</div>
              </div>
              <div className="mt-5 rounded-2xl border border-foreground/20 bg-foreground/[0.03] p-5">
                <div className="flex items-center gap-2 text-sm font-semibold"><Zap className="h-4 w-4" /> {c.atsScore}</div>
                <div className="mt-3 flex items-end gap-3">
                  <div className="font-display text-5xl">92</div>
                  <div className="pb-1 text-xs text-muted-foreground">{c.atsExcellent}</div>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-[92%] bg-foreground" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6">
        <div className="text-center">
          <h2 className="font-display text-3xl tracking-tight sm:text-4xl">{c.socialTitle}</h2>
          <p className="mt-3 text-muted-foreground">{c.socialSub}</p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {c.stats.map(([n, d]) => (
            <div key={n} className="rounded-3xl border border-border/70 bg-card p-8 text-center">
              <div className="font-display text-5xl tracking-tight">{n}</div>
              <div className="mt-3 text-sm text-muted-foreground">{d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6">
        <div className="rounded-3xl bg-gradient-to-br from-neutral-700 via-neutral-800 to-neutral-900 p-12 text-white sm:p-16 dark:from-neutral-800 dark:via-neutral-900 dark:to-black">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-4xl tracking-tight sm:text-5xl">{c.ctaBigTitle}</h2>
            <p className="mt-4 text-background/70">{c.ctaBigSub}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a href={href("/library")}><Button size="lg" variant="secondary" className="rounded-full">{c.browseLibrary}</Button></a>
              <a href={href("/cv")}><Button size="lg" variant="outline" className="rounded-full border-background/30 bg-transparent text-background hover:bg-background hover:text-foreground">{c.ctaGenerate}</Button></a>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
