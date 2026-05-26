import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Search, Sparkles, Star, Check, Quote, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SiteShell } from "@/components/site-shell";
import { PromptCard } from "@/components/prompt-card";
import { categories, creators, prompts } from "@/lib/mock-data";

export const Route = createFileRoute("/")({ component: Landing });

function Landing() {
  const [q, setQ] = useState("");
  const trending = prompts.slice(0, 6);
  return (
    <SiteShell>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-aurora" aria-hidden />
        <div className="absolute inset-0 bg-grain opacity-50" aria-hidden />
        <div className="relative mx-auto w-full max-w-7xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:pt-32">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium text-foreground shadow-sm backdrop-blur" variant="outline">
              <Sparkles className="mr-1.5 h-3 w-3 text-violet-500" /> 12,000+ prompts curated for real life
            </Badge>
            <h1 className="font-display mt-6 text-5xl leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              AI prompts that help you <span className="text-gradient italic">actually</span> get things done.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Discover, save, and use beautifully crafted prompts and toolkits — for jobs, study, content, business, and everything in between.
            </p>

            <form
              onSubmit={(e) => { e.preventDefault(); window.location.href = `/marketplace?q=${encodeURIComponent(q)}`; }}
              className="mx-auto mt-10 flex w-full max-w-2xl items-center gap-2 rounded-2xl border border-border bg-background/90 p-2 shadow-[0_20px_60px_-30px_rgb(0_0_0_/0.25)] backdrop-blur"
            >
              <div className="flex flex-1 items-center gap-3 px-3">
                <Search className="h-5 w-5 text-muted-foreground" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="What do you want AI to help you with?"
                  className="h-12 border-0 bg-transparent text-base shadow-none focus-visible:ring-0"
                />
              </div>
              <Button type="submit" size="lg" className="rounded-xl px-5">
                Search <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </form>
            <div className="mx-auto mt-4 flex max-w-2xl flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
              <span>Try:</span>
              {["land a job", "study for finals", "write cold emails", "plan a trip", "grow on Instagram"].map(s => (
                <Link key={s} to="/marketplace" search={{ q: s } as never} className="rounded-full border border-border bg-background/60 px-3 py-1 hover:bg-background">
                  {s}
                </Link>
              ))}
            </div>
          </div>

          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-3 gap-4 text-center sm:gap-8">
            {[
              ["52k+", "Active learners"],
              ["4.9★", "Average rating"],
              ["12k+", "Prompts & toolkits"],
            ].map(([n, l]) => (
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
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Browse by outcome</div>
            <h2 className="font-display mt-2 text-4xl tracking-tight sm:text-5xl">What do you want to do?</h2>
          </div>
          <Link to="/marketplace" className="hidden text-sm text-muted-foreground hover:text-foreground sm:inline-flex">View all →</Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map(c => (
            <Link
              key={c.slug}
              to="/marketplace"
              search={{ category: c.slug } as never}
              className={`group relative overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-br ${c.gradient} p-5 transition hover:-translate-y-0.5 hover:shadow-lg`}
            >
              <div className="text-3xl">{c.emoji}</div>
              <div className="mt-3 font-medium">{c.name}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">{c.description}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* TRENDING */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Trending this week</div>
            <h2 className="font-display mt-2 text-4xl tracking-tight sm:text-5xl">Loved by humans like you</h2>
          </div>
          <Link to="/marketplace" className="hidden text-sm text-muted-foreground hover:text-foreground sm:inline-flex">Explore marketplace →</Link>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {trending.map(p => <PromptCard key={p.id} prompt={p} />)}
        </div>
      </section>

      {/* ASSISTANT CTA */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-violet-600 via-fuchsia-600 to-amber-500 p-8 text-white sm:p-12">
          <div className="absolute inset-0 bg-grain opacity-30" />
          <div className="relative grid items-center gap-6 md:grid-cols-2">
            <div>
              <Badge className="rounded-full bg-white/20 text-white hover:bg-white/30" variant="secondary">
                <Wand2 className="mr-1.5 h-3 w-3" /> Meet your AI guide
              </Badge>
              <h3 className="font-display mt-4 text-4xl tracking-tight sm:text-5xl">Not sure where to start?</h3>
              <p className="mt-3 max-w-md text-white/85">Tell us what you're trying to achieve. We'll handpick the right prompts and packs — in seconds.</p>
              <Link to="/assistant" className="mt-6 inline-flex"><Button size="lg" variant="secondary" className="rounded-full">Try the AI Assistant <ArrowRight className="ml-1.5 h-4 w-4" /></Button></Link>
            </div>
            <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
              <div className="text-sm text-white/80">You</div>
              <div className="mt-1 rounded-xl bg-white/15 p-3 text-sm">I want to switch careers into UX design this year.</div>
              <div className="mt-3 text-sm text-white/80">Prompt Academia</div>
              <div className="mt-1 rounded-xl bg-white text-foreground p-3 text-sm">Here's a 3-step plan: a learning roadmap, a portfolio-building prompt pack, and a job-search toolkit. Want me to set it up?</div>
            </div>
          </div>
        </div>
      </section>

      {/* CREATORS */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Featured creators</div>
        <h2 className="font-display mt-2 text-4xl tracking-tight sm:text-5xl">Real people. Real expertise.</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {creators.map(c => (
            <div key={c.id} className="rounded-3xl border border-border/70 bg-card p-6">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm font-semibold text-white">{c.avatar}</div>
              <div className="mt-4 font-medium">{c.name} {c.verified && <span className="ml-1 text-xs text-violet-600">✓</span>}</div>
              <div className="text-xs text-muted-foreground">{c.handle}</div>
              <p className="mt-3 text-sm text-muted-foreground">{c.bio}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span>{c.prompts} prompts</span>
                <span>{(c.followers / 1000).toFixed(1)}k followers</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        <h2 className="font-display max-w-2xl text-4xl tracking-tight sm:text-5xl">A friendlier way to use AI.</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            { name: "Jamie L.", role: "Career switcher", body: "I went from staring at ChatGPT not knowing what to ask, to landing 3 interviews in two weeks. The prompts felt like a coach in my pocket." },
            { name: "Priya S.", role: "Grad student", body: "Studying finally clicked. The 'Study Anything in Half the Time' pack changed how I read." },
            { name: "Marco T.", role: "Indie founder", body: "I shipped my landing page, launch plan and first ads in a weekend. Wild." },
          ].map((t) => (
            <div key={t.name} className="rounded-3xl border border-border/70 bg-card p-6">
              <Quote className="h-5 w-5 text-violet-500" />
              <p className="mt-4 text-[15px] leading-relaxed">{t.body}</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-amber-400 to-rose-500 text-xs font-semibold text-white">{t.name.split(" ").map(s=>s[0]).join("")}</div>
                <div className="text-sm"><div className="font-medium">{t.name}</div><div className="text-xs text-muted-foreground">{t.role}</div></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pricing</div>
          <h2 className="font-display mt-2 text-4xl tracking-tight sm:text-5xl">Simple, friendly pricing.</h2>
          <p className="mt-3 text-muted-foreground">Start free. Upgrade when you're ready for the whole library.</p>
        </div>
        <div className="mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-3">
          {[
            { name: "Free", price: "$0", desc: "For the curious.", cta: "Get started", features: ["Browse the marketplace", "Save up to 20 prompts", "Use all free prompts"] },
            { name: "Premium", price: "$9/mo", desc: "The whole library.", highlight: true, cta: "Start Premium", features: ["Everything in Free", "Unlimited library access", "New packs every week", "Priority AI Assistant"] },
            { name: "Creator", price: "Earn 80%", desc: "Sell your own.", cta: "Become a creator", features: ["Upload & sell prompts", "Bundles & subscriptions", "Real-time analytics", "Stripe payouts"] },
          ].map(p => (
            <div key={p.name} className={`relative rounded-3xl border p-6 ${p.highlight ? "border-foreground/20 bg-gradient-to-br from-violet-50 to-amber-50 shadow-lg" : "border-border/70 bg-card"}`}>
              {p.highlight && <Badge className="absolute -top-3 left-6 rounded-full">Most loved</Badge>}
              <div className="font-medium">{p.name}</div>
              <div className="font-display mt-2 text-4xl tracking-tight">{p.price}</div>
              <div className="mt-1 text-sm text-muted-foreground">{p.desc}</div>
              <ul className="mt-5 space-y-2 text-sm">
                {p.features.map(f => <li key={f} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 text-violet-600" /> {f}</li>)}
              </ul>
              <Link to="/signup" className="mt-6 inline-flex w-full"><Button className="w-full rounded-full" variant={p.highlight ? "default" : "outline"}>{p.cta}</Button></Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 lg:py-20">
        <h2 className="font-display text-4xl tracking-tight sm:text-5xl">Friendly answers.</h2>
        <div className="mt-8 divide-y divide-border/70 rounded-3xl border border-border/70 bg-card">
          {[
            ["Do I need to know how to prompt?", "Not at all. Every prompt is written for humans — copy, paste, and follow the guided steps."],
            ["Which AI tools do these work with?", "Most prompts work great with ChatGPT, Claude, and Gemini. We label compatibility on each prompt."],
            ["Can I cancel anytime?", "Yes. Premium is monthly and you can cancel from your dashboard in one click."],
            ["Can I sell my own prompts?", "Yes — apply as a creator and start selling. We handle payments and payouts."],
          ].map(([q, a]) => (
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
            <h3 className="font-display text-4xl tracking-tight sm:text-5xl">Your AI side-kick starts here.</h3>
            <p className="mt-3 text-background/80">Join 50,000+ humans using Prompt Academia to learn, create, and get hired.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/signup"><Button size="lg" className="rounded-full bg-white text-foreground hover:bg-white/90">Create free account</Button></Link>
              <Link to="/marketplace"><Button size="lg" variant="outline" className="rounded-full border-white/30 bg-transparent text-white hover:bg-white/10">Explore marketplace</Button></Link>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
