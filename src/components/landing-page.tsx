import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Search, Sparkles, Check, Quote, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SiteShell } from "@/components/site-shell";
import { PromptCard } from "@/components/prompt-card";
import { categories, creators, prompts } from "@/lib/mock-data";
import { t, type Locale, localePathPrefix } from "@/lib/i18n";

export function LandingPage({ locale }: { locale: Locale }) {
  const [q, setQ] = useState("");
  const trending = prompts.slice(0, 6);
  const s = t[locale];
  const prefix = localePathPrefix[locale];
  const marketHref = `${prefix}/marketplace`;
  const assistantHref = `${prefix}/assistant`;
  const signupHref = `${prefix}/signup`;

  const pricing =
    locale === "de"
      ? [
          { name: "Free", price: "0 €", desc: "Für Neugierige.", cta: "Loslegen", features: ["Marktplatz durchstöbern", "Bis zu 20 Prompts speichern", "Alle kostenlosen Prompts nutzen"] },
          { name: "Premium", price: "9 €/Monat", desc: "Die ganze Bibliothek.", highlight: true, cta: "Premium starten", features: ["Alles aus Free", "Unbegrenzter Bibliothekszugang", "Jede Woche neue Pakete", "Priorisierter KI-Assistent"] },
          { name: "Creator", price: "80 % Anteil", desc: "Verkaufe deine eigenen.", cta: "Creator werden", features: ["Prompts hochladen & verkaufen", "Pakete & Abos", "Echtzeit-Analytics", "Stripe-Auszahlungen"] },
        ]
      : [
          { name: "Free", price: "$0", desc: "For the curious.", cta: "Get started", features: ["Browse the marketplace", "Save up to 20 prompts", "Use all free prompts"] },
          { name: "Premium", price: "$9/mo", desc: "The whole library.", highlight: true, cta: "Start Premium", features: ["Everything in Free", "Unlimited library access", "New packs every week", "Priority AI Assistant"] },
          { name: "Creator", price: "Earn 80%", desc: "Sell your own.", cta: "Become a creator", features: ["Upload & sell prompts", "Bundles & subscriptions", "Real-time analytics", "Stripe payouts"] },
        ];

  const testimonials =
    locale === "de"
      ? [
          { name: "Jamie L.", role: "Quereinsteigerin", body: "Ich saß ratlos vor ChatGPT — zwei Wochen später hatte ich drei Vorstellungsgespräche. Die Prompts fühlten sich wie ein Coach in der Tasche an." },
          { name: "Priya S.", role: "Doktorandin", body: "Lernen hat endlich Klick gemacht. Das Paket 'In der halben Zeit lernen' hat alles verändert." },
          { name: "Marco T.", role: "Indie-Gründer", body: "Landing Page, Launch-Plan und erste Ads — alles an einem Wochenende. Verrückt." },
        ]
      : [
          { name: "Jamie L.", role: "Career switcher", body: "I went from staring at ChatGPT not knowing what to ask, to landing 3 interviews in two weeks. The prompts felt like a coach in my pocket." },
          { name: "Priya S.", role: "Grad student", body: "Studying finally clicked. The 'Study Anything in Half the Time' pack changed how I read." },
          { name: "Marco T.", role: "Indie founder", body: "I shipped my landing page, launch plan and first ads in a weekend. Wild." },
        ];

  const faq =
    locale === "de"
      ? [
          ["Muss ich wissen, wie man Prompts schreibt?", "Überhaupt nicht. Jeder Prompt ist für Menschen geschrieben — kopieren, einfügen und den Schritten folgen."],
          ["Mit welchen KI-Tools funktioniert das?", "Die meisten Prompts funktionieren großartig mit ChatGPT, Claude und Gemini. Wir kennzeichnen die Kompatibilität bei jedem Prompt."],
          ["Kann ich jederzeit kündigen?", "Ja. Premium ist monatlich und du kannst mit einem Klick im Dashboard kündigen."],
          ["Kann ich meine eigenen Prompts verkaufen?", "Ja — bewirb dich als Creator und leg los. Wir kümmern uns um Zahlungen und Auszahlungen."],
        ]
      : [
          ["Do I need to know how to prompt?", "Not at all. Every prompt is written for humans — copy, paste, and follow the guided steps."],
          ["Which AI tools do these work with?", "Most prompts work great with ChatGPT, Claude, and Gemini. We label compatibility on each prompt."],
          ["Can I cancel anytime?", "Yes. Premium is monthly and you can cancel from your dashboard in one click."],
          ["Can I sell my own prompts?", "Yes — apply as a creator and start selling. We handle payments and payouts."],
        ];

  return (
    <SiteShell locale={locale}>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-aurora" aria-hidden />
        <div className="absolute inset-0 bg-grain opacity-50" aria-hidden />
        <div className="relative mx-auto w-full max-w-7xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:pt-32">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium text-foreground shadow-sm backdrop-blur" variant="outline">
              <Sparkles className="mr-1.5 h-3 w-3 text-violet-500" /> {s.badge}
            </Badge>
            <h1 className="font-display mt-6 text-5xl leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              {s.heroTitle} <span className="text-gradient italic">{s.heroTitleEm}</span> {s.heroTitleEnd}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">{s.heroSub}</p>

            <form
              onSubmit={(e) => { e.preventDefault(); window.location.href = `${marketHref}?q=${encodeURIComponent(q)}`; }}
              className="mx-auto mt-10 flex w-full max-w-2xl items-center gap-2 rounded-2xl border border-border bg-background/90 p-2 shadow-[0_20px_60px_-30px_rgb(0_0_0_/0.25)] backdrop-blur"
            >
              <div className="flex flex-1 items-center gap-3 px-3">
                <Search className="h-5 w-5 text-muted-foreground" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={s.searchPlaceholder}
                  className="h-12 border-0 bg-transparent text-base shadow-none focus-visible:ring-0"
                />
              </div>
              <Button type="submit" size="lg" className="rounded-xl px-5">
                {s.search} <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </form>
            <div className="mx-auto mt-4 flex max-w-2xl flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
              <span>{s.tryLabel}</span>
              {s.tryItems.map((item) => (
                <a key={item} href={`${marketHref}?q=${encodeURIComponent(item)}`} className="rounded-full border border-border bg-background/60 px-3 py-1 hover:bg-background">
                  {item}
                </a>
              ))}
            </div>
          </div>

          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-3 gap-4 text-center sm:gap-8">
            {s.stats.map(([n, l]) => (
              <div key={l} className="rounded-2xl border border-border/60 bg-background/60 p-5 backdrop-blur">
                <div className="font-display text-3xl tracking-tight sm:text-4xl">{n}</div>
                <div className="mt-1 text-xs text-muted-foreground">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{s.browseKicker}</div>
            <h2 className="font-display mt-2 text-4xl tracking-tight sm:text-5xl">{s.browseTitle}</h2>
          </div>
          <a href={marketHref} className="hidden text-sm text-muted-foreground hover:text-foreground sm:inline-flex">{s.viewAll}</a>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((c) => (
            <a
              key={c.slug}
              href={`${marketHref}?category=${c.slug}`}
              className={`group relative overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-br ${c.gradient} p-5 transition hover:-translate-y-0.5 hover:shadow-lg`}
            >
              <div className="text-3xl">{c.emoji}</div>
              <div className="mt-3 font-medium">{c.name}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">{c.description}</div>
            </a>
          ))}
        </div>
      </section>

      {/* TRENDING */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{s.trendingKicker}</div>
            <h2 className="font-display mt-2 text-4xl tracking-tight sm:text-5xl">{s.trendingTitle}</h2>
          </div>
          <a href={marketHref} className="hidden text-sm text-muted-foreground hover:text-foreground sm:inline-flex">{s.exploreMarket}</a>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {trending.map((p) => <PromptCard key={p.id} prompt={p} />)}
        </div>
      </section>

      {/* ASSISTANT CTA */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-violet-600 via-fuchsia-600 to-amber-500 p-8 text-white sm:p-12">
          <div className="absolute inset-0 bg-grain opacity-30" />
          <div className="relative grid items-center gap-6 md:grid-cols-2">
            <div>
              <Badge className="rounded-full bg-white/20 text-white hover:bg-white/30" variant="secondary">
                <Wand2 className="mr-1.5 h-3 w-3" /> {s.assistantBadge}
              </Badge>
              <h3 className="font-display mt-4 text-4xl tracking-tight sm:text-5xl">{s.assistantTitle}</h3>
              <p className="mt-3 max-w-md text-white/85">{s.assistantSub}</p>
              <a href={assistantHref} className="mt-6 inline-flex"><Button size="lg" variant="secondary" className="rounded-full">{s.assistantCta} <ArrowRight className="ml-1.5 h-4 w-4" /></Button></a>
            </div>
            <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
              <div className="text-sm text-white/80">{s.you}</div>
              <div className="mt-1 rounded-xl bg-white/15 p-3 text-sm">{s.youMsg}</div>
              <div className="mt-3 text-sm text-white/80">Prompt Academia</div>
              <div className="mt-1 rounded-xl bg-white text-foreground p-3 text-sm">{s.aiReply}</div>
            </div>
          </div>
        </div>
      </section>

      {/* CREATORS */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{s.creatorsKicker}</div>
        <h2 className="font-display mt-2 text-4xl tracking-tight sm:text-5xl">{s.creatorsTitle}</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {creators.map((c) => (
            <div key={c.id} className="rounded-3xl border border-border/70 bg-card p-6">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm font-semibold text-white">{c.avatar}</div>
              <div className="mt-4 font-medium">{c.name} {c.verified && <span className="ml-1 text-xs text-violet-600">✓</span>}</div>
              <div className="text-xs text-muted-foreground">{c.handle}</div>
              <p className="mt-3 text-sm text-muted-foreground">{c.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        <h2 className="font-display max-w-2xl text-4xl tracking-tight sm:text-5xl">{s.testimonialTitle}</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {testimonials.map((tt) => (
            <div key={tt.name} className="rounded-3xl border border-border/70 bg-card p-6">
              <Quote className="h-5 w-5 text-violet-500" />
              <p className="mt-4 text-[15px] leading-relaxed">{tt.body}</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-amber-400 to-rose-500 text-xs font-semibold text-white">{tt.name.split(" ").map((x) => x[0]).join("")}</div>
                <div className="text-sm"><div className="font-medium">{tt.name}</div><div className="text-xs text-muted-foreground">{tt.role}</div></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{s.pricingKicker}</div>
          <h2 className="font-display mt-2 text-4xl tracking-tight sm:text-5xl">{s.pricingTitle}</h2>
          <p className="mt-3 text-muted-foreground">{s.pricingSub}</p>
        </div>
        <div className="mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-3">
          {pricing.map((p) => (
            <div key={p.name} className={`relative rounded-3xl border p-6 ${p.highlight ? "border-foreground/20 bg-gradient-to-br from-violet-50 to-amber-50 shadow-lg dark:border-foreground/30 dark:from-violet-500/15 dark:to-amber-500/10 dark:shadow-2xl dark:shadow-violet-900/30" : "border-border/70 bg-card"}`}>
              {p.highlight && <Badge className="absolute -top-3 left-6 rounded-full">{locale === "de" ? "Am beliebtesten" : "Most loved"}</Badge>}
              <div className="font-medium">{p.name}</div>
              <div className="font-display mt-2 text-4xl tracking-tight">{p.price}</div>
              <div className="mt-1 text-sm text-muted-foreground">{p.desc}</div>
              <ul className="mt-5 space-y-2 text-sm">
                {p.features.map((f) => <li key={f} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 text-violet-600" /> {f}</li>)}
              </ul>
              <a href={signupHref} className="mt-6 inline-flex w-full"><Button className="w-full rounded-full" variant={p.highlight ? "default" : "outline"}>{p.cta}</Button></a>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 lg:py-20">
        <h2 className="font-display text-4xl tracking-tight sm:text-5xl">{s.faqTitle}</h2>
        <div className="mt-8 divide-y divide-border/70 rounded-3xl border border-border/70 bg-card">
          {faq.map(([q, a]) => (
            <details key={q} className="group p-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium">
                {q} <span className="text-muted-foreground transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-foreground to-zinc-800 p-10 text-background sm:p-16">
          <div className="absolute inset-0 bg-grain opacity-20" />
          <div className="relative max-w-2xl">
            <h3 className="font-display text-4xl tracking-tight sm:text-5xl">{s.ctaTitle}</h3>
            <p className="mt-3 text-background/80">{s.ctaSub}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={signupHref}><Button size="lg" className="rounded-full bg-white text-foreground hover:bg-white/90">{s.createAccount}</Button></a>
              <a href={marketHref}><Button size="lg" variant="outline" className="rounded-full border-white/30 bg-transparent text-white hover:bg-white/10">{s.exploreMarketBtn}</Button></a>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
