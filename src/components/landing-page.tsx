import { useEffect, useRef, useState } from "react";
import { ArrowRight, FileText, Mail, Target, Sparkles, CheckCircle2, Zap, Library, Search, Wand2, ShieldCheck, Bot, Gauge, Scan, Languages, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteShell } from "@/components/site-shell";
import { copy, type Locale, alternateHref } from "@/lib/i18n";
import { prompts, categories } from "@/lib/mock-data";
import { TrustedBy } from "@/components/trusted-by";


const ICONS = [Library, FileText, Mail, Target, Wand2];

const FEATURED_SLUGS = [
  "tailored-cv-for-any-job-description",
  "personalized-cover-letter-that-sounds-human",
  "ats-keyword-gap-analyzer",
  "star-method-interview-stories",
  "recruiter-cold-message-that-gets-replies",
  "salary-negotiation-counter-offer-script",
];

const featured = FEATURED_SLUGS
  .map((s) => prompts.find((p) => p.slug === s))
  .filter((p): p is (typeof prompts)[number] => Boolean(p));


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
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 -z-20 bg-grid mask-fade-b opacity-70" />
        <div className="absolute inset-0 -z-10 bg-signal" />
        <div className="mx-auto grid w-full max-w-6xl items-center gap-14 px-4 py-20 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16 lg:py-28">
          {/* Copy */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-[11px] tracking-wide text-muted-foreground backdrop-blur">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              {c.badge}
            </div>
            <h1 className="mt-6 font-display text-[2.1rem] leading-[1.08] tracking-tight sm:text-[2.6rem] lg:text-[3rem]">
              {c.heroTitleA} <span className="text-primary">{c.heroTitleEm}</span> {c.heroTitleB}
            </h1>
            <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-muted-foreground">{c.heroSub}</p>
            <div className="mt-8 flex flex-wrap gap-2.5">
              <a href={href("/cv")}><Button className="rounded-full px-5">{c.ctaGenerate} <ArrowRight className="h-4 w-4" /></Button></a>
              <a href={href("/ats")}><Button variant="outline" className="rounded-full px-5 font-normal">{c.ctaAts}</Button></a>
              <a href={href("/library")}><Button variant="ghost" className="rounded-full px-4 font-normal text-muted-foreground">{c.ctaFind}</Button></a>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border/60 pt-6 text-[11px] tracking-wide text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5" /> {c.free}</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5" /> {c.noCard}</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5" /> {c.topModels}</span>
            </div>
          </div>

          {/* Alignment panel */}
          <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-border/70 bg-card/80 shadow-[0_24px_60px_-40px_rgba(15,15,40,0.45)] backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-border/60 px-4 py-2.5">
                <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  <Scan className="h-3.5 w-3.5" /> alignment engine
                </div>
                <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] tracking-wide text-primary">
                  live
                </span>
              </div>

              <div className="grid sm:grid-cols-2">
                <div className="border-b border-border/60 p-5 sm:border-b-0 sm:border-r">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Job description</div>
                  <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
                    Senior Product Designer — own{" "}
                    <mark className="rounded bg-primary/12 px-1 text-foreground">end-to-end design</mark> for B2B
                    workflows, build a{" "}
                    <mark className="rounded bg-primary/12 px-1 text-foreground">design system</mark>, partner with{" "}
                    <mark className="rounded bg-primary/12 px-1 text-foreground">PM and engineering</mark>, ship weekly.
                  </p>
                </div>
                <div className="p-5">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Your CV, rewritten</div>
                  <p className="mt-3 text-[13px] leading-relaxed line-through decoration-border">
                    Responsible for various design tasks across the company.
                  </p>
                  <p className="mt-2.5 text-[13px] leading-relaxed">
                    Led{" "}
                    <mark className="rounded bg-primary/12 px-1 text-foreground">end-to-end design</mark> of a B2B
                    workflow suite and its{" "}
                    <mark className="rounded bg-primary/12 px-1 text-foreground">design system</mark>, shipping weekly
                    with <mark className="rounded bg-primary/12 px-1 text-foreground">PM and engineering</mark>.
                  </p>
                </div>
              </div>

              <div className="border-t border-border/60 bg-muted/30 px-5 py-4">
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{c.atsScore}</div>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="font-display text-3xl tracking-tight">92</span>
                      <span className="text-[11px] text-muted-foreground">/ 100 · {c.atsExcellent}</span>
                    </div>
                  </div>
                  <div className="text-right text-[11px] text-muted-foreground">
                    <div>18 / 20 keywords matched</div>
                    <div>rewritten in 7s</div>
                  </div>
                </div>
                <div className="mt-3 h-1 overflow-hidden rounded-full bg-border">
                  <div className="h-full w-[92%] rounded-full bg-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      <TrustedBy />



      {/* TOOLS */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
        <div className="text-center">
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{c.toolsKicker}</div>
          <h2 className="font-display mt-3 text-2xl tracking-tight sm:text-[1.75rem]">{c.toolsTitle}</h2>
        </div>
        <div ref={scrollerRef} className="mt-10 -mx-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 [scrollbar-width:thin]">
          <div className="flex gap-5 snap-x snap-mandatory">
            {order.map((i) => {
              const t = c.tools[i];
              const Icon = ICONS[i];
              const link = ["/library", "/cv", "/cover-letter", "/ats", "/humanizer"][i];
              return (
                <a key={link} data-tool-card href={href(link)} className="group relative flex w-[280px] shrink-0 snap-start flex-col rounded-2xl border border-border/70 bg-card p-7 transition hover:border-foreground/30 hover:shadow-lg sm:w-[320px]">
                  {t.badge && (
                    <span className="absolute right-5 top-5 rounded-full bg-foreground px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-background">
                      {t.badge}
                    </span>
                  )}
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-foreground/5 text-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-[15px] font-medium">{t.title}</h3>
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




      {/* HOW IT WORKS */}
      <section className="border-y border-border/60 bg-muted/20">
        <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{c.howKicker}</div>
              <h2 className="font-display mt-3 text-2xl tracking-tight sm:text-[1.75rem]">{c.howTitle}</h2>
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
            <div className="rounded-2xl border border-border/70 bg-background p-6 shadow-sm">
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

      {/* HUMANIZER SPOTLIGHT */}
      <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="order-2 lg:order-1 rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
                <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-foreground/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <Bot className="h-3 w-3" /> AI draft
                </div>
                <p className="leading-relaxed">
                  <span className="rounded bg-red-500/15 px-0.5 line-through decoration-red-500/60">Leveraged synergistic frameworks to</span> deliver <span className="rounded bg-red-500/15 px-0.5 line-through decoration-red-500/60">robust, scalable</span> solutions <span className="rounded bg-red-500/15 px-0.5 line-through decoration-red-500/60">in a dynamic environment</span>.
                </p>
              </div>
              <div className="rounded-2xl border border-primary/40 bg-primary/5 p-4">
                <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                  <Wand2 className="h-3 w-3" /> Humanized
                </div>
                <p className="leading-relaxed">
                  Built and shipped tools that <span className="rounded bg-primary/20 px-0.5">cut onboarding time by 40%</span> across three product teams.
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between rounded-xl bg-muted/40 px-4 py-3 text-xs">
              <div className="flex items-center gap-2 text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5" /> AI-detector risk
              </div>
              <div className="flex items-center gap-2 font-medium">
                <span className="text-muted-foreground line-through">High</span>
                <ArrowRight className="h-3 w-3" />
                <span className="text-primary">Low</span>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/60 px-3 py-1.5 text-xs font-medium text-muted-foreground">
              <Wand2 className="h-3.5 w-3.5" /> Humanizer
            </div>
            <h2 className="font-display mt-4 text-2xl tracking-tight sm:text-[2rem]">
              Sound like <em className="italic text-muted-foreground">you</em>, not a chatbot.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Recruiters spot AI-generated writing in seconds — and detectors like GPTZero and Turnitin flag it before your CV reaches a human. Our Humanizer rewrites any draft so it reads natural, specific, and unmistakably yours, with a side-by-side diff of every change.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "Strip generic AI phrases (\"leveraged\", \"synergistic\", \"passionate about\")",
                "Rewrite in your voice — concise, specific, evidence-first",
                "Bypass ATS AI-detection filters used by top employers",
                "See every edit with a clear before/after diff",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" /> {t}</li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={href("/humanizer")}><Button size="lg" className="rounded-full">Try the Humanizer <ArrowRight className="h-4 w-4" /></Button></a>
              <a href={href("/ats")}><Button size="lg" variant="outline" className="rounded-full">Check ATS score</Button></a>
            </div>
          </div>
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
              <h2 className="font-display mt-4 text-2xl tracking-tight sm:text-[2rem]">{c.librarySpotTitle}</h2>
              <p className="mt-4 text-muted-foreground">{c.librarySpotSub}</p>
              <ul className="mt-6 space-y-3 text-sm">
                {c.librarySpotBullets.map((t) => (
                  <li key={t} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-foreground" /> {t}</li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={href("/library")}><Button size="lg" className="rounded-full">{c.browseLibrary} <ArrowRight className="h-4 w-4" /></Button></a>
                
              </div>
            </div>
            <div className="rounded-2xl border border-border/70 bg-background p-6 shadow-sm">
              <div className="flex items-center gap-2 rounded-full border border-border/70 bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
                <Search className="h-4 w-4" /> "prompts that actually land interviews"
              </div>
              <div className="mt-4 grid gap-3">
                {featured.map((p) => (
                  <a key={p.slug} href={href(`/prompt/${p.slug}`)} className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-card p-3 transition hover:border-foreground/20 hover:shadow-sm">
                    <div className="min-w-0">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {categories.find((c2) => c2.slug === p.category)?.name ?? p.category}
                      </div>
                      <div className="truncate text-sm font-medium">{p.title}</div>
                    </div>
                    <div className="shrink-0 text-xs text-muted-foreground">{p.price === 0 ? "Free" : "Premium"}</div>
                  </a>
                ))}
              </div>

            </div>
          </div>
        </div>
      </section>


      {/* FEATURE OVERVIEW */}
      <section className="border-y border-border/60 bg-muted/20">
        <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Everything in one place</div>
            <h2 className="font-display mt-3 text-2xl tracking-tight sm:text-[1.75rem]">One toolkit for the whole job hunt.</h2>
            <p className="mt-4 text-muted-foreground">From the first prompt to the signed offer — every step of the modern job search, powered by AI you can actually trust.</p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Library, title: "Prompt Library", desc: "Hundreds of curated prompts for CVs, interviews, outreach and negotiation — written by career coaches." },
              { icon: FileText, title: "Tailored CV Generator", desc: "Paste a job description and get a keyword-optimized CV shaped around your real experience in seconds." },
              { icon: Mail, title: "Cover Letters that fit", desc: "Personal, specific letters that show why you — not another candidate — belong in the role." },
              { icon: Scan, title: "ATS Match Scoring", desc: "See exactly which keywords, sections, and formatting choices are costing you interviews." },
              { icon: Wand2, title: "AI Humanizer", desc: "Rewrite AI-sounding drafts into natural, human writing that gets past detectors and recruiters." },
              { icon: Target, title: "Job-Specific Tailoring", desc: "Every output is shaped to one job description — no more copy-paste applications." },
              { icon: Gauge, title: "60-Second Turnaround", desc: "Go from blank page to interview-ready docs in under a minute — for every role you apply to." },
              { icon: Languages, title: "5 Languages", desc: "Full experience in English, German, Spanish, Italian and French — write in the market's language." },
              { icon: Lock, title: "Free & Private", desc: "Use the core tools with no sign-up. Your CV data stays yours — never sold, never trained on." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-2xl border border-border/70 bg-background p-6 transition hover:border-foreground/30 hover:shadow-sm">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-foreground/5 text-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-[15px] font-medium">{title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6">

        <div className="text-center">
          <h2 className="font-display text-2xl tracking-tight sm:text-[1.75rem]">{c.socialTitle}</h2>
          <p className="mt-3 text-muted-foreground">{c.socialSub}</p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {c.stats.map(([n, d]) => (
            <div key={n} className="rounded-2xl border border-border/70 bg-card p-8 text-center">
              <div className="font-display text-4xl tracking-tight">{n}</div>
              <div className="mt-3 text-sm text-muted-foreground">{d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6">
        <div className="rounded-2xl bg-gradient-to-br from-[#141432] via-[#0f0f28] to-[#0a0a1a] p-12 text-white sm:p-16 dark:from-neutral-800 dark:via-neutral-900 dark:to-black">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-2xl tracking-tight sm:text-[2rem]">{c.ctaBigTitle}</h2>
            <p className="mt-4 text-white/70">{c.ctaBigSub}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a href={href("/library")}><Button size="lg" variant="secondary" className="rounded-full">{c.browseLibrary}</Button></a>
              <a href={href("/cv")}><Button size="lg" variant="outline" className="rounded-full border-white/30 bg-transparent text-white hover:bg-white hover:text-neutral-900">{c.ctaGenerate}</Button></a>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
