import { createFileRoute, useRouterState, useSearch, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X, Bookmark, FileDown } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { SiteShell } from "@/components/site-shell";
import { PromptGrid } from "@/components/prompt-card";
import { packs, prompts } from "@/lib/mock-data";

import { detectLocaleFromPath } from "@/lib/i18n";
import { useSavedPrompts } from "@/lib/saved-prompts";
import { ToolOutro } from "@/components/tool-hero";
import { buildPackTemplate, copyToClipboard, downloadText } from "@/lib/apply-template";
import { canonicalAndAlternates, crawlerMeta, toolJsonLd, howToJsonLd, breadcrumbJsonLd } from "@/lib/seo-head";

export type Search = { q?: string; category?: string; pack?: string; sort?: "popular" | "newest" | "rating" | "tier"; price?: "all" | "free" | "paid"; beginner?: "1" | 1 };

function matchesQuery(p: (typeof prompts)[number], query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return (
    p.title.toLowerCase().includes(needle) ||
    p.outcome.toLowerCase().includes(needle) ||
    p.description.toLowerCase().includes(needle) ||
    p.tags.some(t => t.toLowerCase().includes(needle))
  );
}


export const Route = createFileRoute("/prompts")({
  head: () => ({
    meta: [
      { title: "Job Search Prompt Library — ATS, Interview & Negotiation Prompts | Nexvi" },
      { name: "description", content: "Curated prompts for CVs, cover letters, ATS optimization, STAR stories, recruiter outreach and salary negotiation. Free prompts included." },
      ...crawlerMeta([
        "job search prompts",
        "CV prompts",
        "cover letter prompts",
        "ChatGPT prompts for job applications",
        "ATS prompts",
        "interview prep prompts",
      ]),
      { property: "og:title", content: "Job Search Prompt Library — ATS, Interview & Negotiation Prompts | Nexvi" },
      { property: "og:description", content: "Curated prompts for CVs, cover letters, ATS optimization, STAR stories, recruiter outreach and salary negotiation. Free prompts included." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://nexvi.xyz/prompts" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Job Search Prompt Library — ATS, Interview & Negotiation Prompts | Nexvi" },
      { name: "twitter:description", content: "Curated prompts for CVs, cover letters, ATS optimization, STAR stories, recruiter outreach and salary negotiation. Free prompts included." },
    ],
    links: canonicalAndAlternates("/prompts"),
    scripts: [
      breadcrumbJsonLd([
        { name: "Nexvi", path: "/" },
        { name: "Prompt Library", path: "/prompts" },
      ]),

      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Job Search Prompt Library",
          url: "https://nexvi.xyz/prompts",
          description:
            "A curated library of AI prompts for job seekers: CV tailoring, cover letters, ATS optimization and interview prep.",
          mainEntity: {
            "@type": "ItemList",
            name: "Job search prompts",
            numberOfItems: prompts.length,
            itemListElement: prompts.slice(0, 50).map((p, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: `https://nexvi.xyz/prompt/${p.slug}`,
              name: p.title,
            })),
          },
        }),
      },
    ],
  }),
  component: PromptsPage,

  validateSearch: (s: Record<string, unknown>): Search => ({
    q: typeof s.q === "string" ? s.q : undefined,
    category: typeof s.category === "string" ? s.category : undefined,
    pack: typeof s.pack === "string" ? s.pack : undefined,
    sort: (s.sort as Search["sort"]) ?? undefined,
    price: (s.price as Search["price"]) ?? undefined,
    beginner: s.beginner === "1" || s.beginner === 1 ? 1 : undefined,
  }),
});

export function PromptsPage() {
  const search = useSearch({ strict: false });
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const locale = detectLocaleFromPath(pathname);
  const [q, setQ] = useState(search.q ?? "");

  // Keep the input in sync when the URL changes (back/forward, "clear all", pack links).
  const urlQ = (search.q as string | undefined) ?? "";
  const lastUrlQ = useRef(urlQ);
  useEffect(() => {
    if (urlQ !== lastUrlQ.current) {
      lastUrlQ.current = urlQ;
      setQ(urlQ);
    }
  }, [urlQ]);
  const { saveMany } = useSavedPrompts();

  const activePack = packs.find(pk => pk.slug === search.pack);
  const activePackItems = activePack ? prompts.filter(p => p.pack === activePack.slug) : [];

  const savePack = () => {
    if (!activePack) return;
    const added = saveMany(activePackItems.map(p => p.slug));
    toast.success(added > 0 ? `Saved ${added} prompt${added === 1 ? "" : "s"} from ${activePack.name}` : "All prompts in this pack are already saved");
  };

  const copyPackTemplate = async () => {
    if (!activePack) return;
    const text = buildPackTemplate(activePack, activePackItems);
    const ok = await copyToClipboard(text);
    if (ok) toast.success("Apply-ready workflow copied — paste it into ChatGPT or Claude");
    else { downloadText(`${activePack.slug}-apply-ready.txt`, text); toast.success("Apply-ready workflow downloaded"); }
  };

  const filtered = useMemo(() => {
    let list = [...prompts];
    if (search.category) list = list.filter(p => p.category === search.category);
    if (search.pack) list = list.filter(p => p.pack === search.pack);
    if (search.price === "free") list = list.filter(p => p.price === 0);
    if (search.price === "paid") list = list.filter(p => p.price > 0);
    if (search.beginner) list = list.filter(p => p.beginner);
    if (search.q) list = list.filter(p => matchesQuery(p, search.q as string));
    if (search.sort === "rating") list.sort((a, b) => b.rating - a.rating);
    else if (search.sort === "newest") list.reverse();
    else list.sort((a, b) => b.uses - a.uses);
    return list;
  }, [search]);

  // How many prompts the same query would match across the whole library —
  // used to offer an escape hatch out of the active pack scope.
  const matchesOutsidePack = useMemo(() => {
    if (!search.q || !search.pack) return 0;
    return prompts.filter(p => p.pack !== search.pack && matchesQuery(p, search.q as string)).length;
  }, [search.q, search.pack]);


  const groups = useMemo(() => {
    if (search.sort !== "tier") return null;
    return [
      { key: "beginner", label: "Beginner-friendly", hint: "Zero setup — paste and go", items: filtered.filter(p => p.beginner) },
      { key: "free", label: "Free", hint: "Full prompt, no subscription", items: filtered.filter(p => !p.beginner && p.price === 0) },
      { key: "paid", label: "Premium", hint: "Pro-only, deeper workflows", items: filtered.filter(p => !p.beginner && p.price > 0) },
    ].filter(g => g.items.length > 0);
  }, [filtered, search.sort]);

  const update = (patch: Partial<Search>) =>
    (navigate as any)({ search: (prev: Search) => ({ ...prev, ...patch }), resetScroll: false });

  // Live search: push the typed query into the URL (debounced) so results filter as you type.
  useEffect(() => {
    const next = q.trim();
    if (next === urlQ.trim()) return;
    const t = setTimeout(() => {
      lastUrlQ.current = next;
      update({ q: next || undefined });
    }, 250);
    return () => clearTimeout(t);
  }, [q, urlQ]);

  const scrollToResults = () => {
    if (typeof window === "undefined") return;
    requestAnimationFrame(() => {
      const el = document.getElementById("library-results");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const selectPack = (slug: string | undefined) => {
    update({ pack: slug });
    scrollToResults();
  };



  return (
    <SiteShell>
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-foreground/[0.04] via-background to-background dark:from-foreground/[0.08]" />
        <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          
          <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-[11px] tracking-wide text-muted-foreground backdrop-blur">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            Prompt Library • curated for job seekers
          </div>
          <h1 className="mt-6 font-display text-[1.9rem] leading-[1.12] tracking-tight sm:text-[2.25rem] lg:text-[2.5rem]">
            Prompts that get you <span className="text-primary">hired</span> — not just answered.
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            Every prompt here is written and tested for one job: getting you an interview. Tailored CVs, cover letters that sound like you, ATS keyword gap analysis, STAR interview stories, recruiter outreach and salary negotiation scripts — grouped into packs you can save or run in one click, in ChatGPT, Claude or right here.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border/60 pt-5 text-[11px] tracking-wide text-muted-foreground">
            <span>{prompts.length} prompts</span>
            <span>{packs.length} curated packs</span>
            <span>Free prompts, no account needed</span>
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); update({ q: q.trim() || undefined }); scrollToResults(); }}
            className="mt-8 flex max-w-2xl items-center gap-2 rounded-2xl border border-border bg-background/90 p-2 shadow-sm backdrop-blur"
          >
            <div className="flex flex-1 flex-wrap items-center gap-2 px-3">
              <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
              {activePack && (
                <span className="inline-flex items-center gap-1 rounded-full bg-foreground px-2.5 py-1 text-xs font-medium text-background">
                  <span>{activePack.emoji}</span> {activePack.name}
                  <button
                    type="button"
                    aria-label={`Search all packs instead of ${activePack.name}`}
                    onClick={() => update({ pack: undefined })}
                    className="ml-0.5 opacity-70 transition hover:opacity-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                aria-label="Search prompts"
                placeholder={activePack ? `Search inside ${activePack.name}…` : "Search CV, cover letter, ATS, interview…"}
                className="h-11 min-w-[8rem] flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0"
              />
              {q && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setQ("")}
                  className="shrink-0 text-muted-foreground transition hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <Button type="submit" className="rounded-xl">Search</Button>
          </form>

        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-6 overflow-hidden rounded-2xl border border-border/70 bg-card/80 shadow-[0_1px_2px_0_rgba(15,23,64,0.06)] backdrop-blur-xl">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border/60 px-6 py-5">
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Curated packs</div>
              <h2 className="mt-2 font-display text-[1.15rem] tracking-tight sm:text-[1.3rem]">Start from a pack, not a blank prompt</h2>
              <p className="mt-1.5 max-w-lg text-[13px] leading-relaxed text-muted-foreground">
                Each pack is a sequence that fits one moment in the hunt — save the whole set or copy an apply-ready workflow in one click.
              </p>
            </div>
            {activePack && (
              <div className="flex flex-wrap items-center gap-2">
                <Button size="sm" variant="outline" className="h-8 rounded-full px-3 text-[12px] font-normal" onClick={savePack}>
                  <Bookmark className="mr-1.5 h-3.5 w-3.5" /> Save pack
                </Button>
                <Button size="sm" className="h-8 rounded-full px-3 text-[12px]" onClick={copyPackTemplate}>
                  <FileDown className="mr-1.5 h-3.5 w-3.5" /> Apply-ready template
                </Button>
                <button onClick={() => update({ pack: undefined })} className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.14em] text-muted-foreground transition hover:text-foreground"><X className="h-3 w-3" /> Clear</button>
              </div>
            )}
          </div>
          <div className="grid gap-px bg-border/50 sm:grid-cols-2 lg:grid-cols-4">
            {packs.map(pk => {
              const active = search.pack === pk.slug;
              const count = prompts.filter(p => p.pack === pk.slug).length;
              return (
                <button
                  key={pk.slug}
                  onClick={() => selectPack(active ? undefined : pk.slug)}
                  title={pk.description}
                  className={`group relative flex h-full flex-col items-start gap-2 px-5 py-4 text-left transition ${active ? "bg-primary/[0.07]" : "bg-card hover:bg-background"}`}
                >
                  <span
                    aria-hidden
                    className={`absolute inset-x-0 top-0 h-[2px] transition-opacity ${active ? "bg-primary opacity-100" : "bg-primary opacity-0 group-hover:opacity-40"}`}
                  />
                  <span className="flex w-full items-center justify-between gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/70 bg-background/80 text-[14px] leading-none">
                      {pk.emoji}
                    </span>
                    <span className={`text-[10px] uppercase tracking-[0.18em] tabular-nums ${active ? "text-primary" : "text-muted-foreground"}`}>
                      {count} prompts
                    </span>
                  </span>
                  <span className={`font-display text-[14px] leading-snug tracking-tight ${active ? "text-primary" : "text-foreground"}`}>
                    {pk.name}
                  </span>
                  <span className="line-clamp-2 text-[12px] leading-relaxed text-muted-foreground">
                    {pk.description}
                  </span>
                </button>
              );
            })}
          </div>

        </div>




        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
          <span>
            {filtered.length} prompt{filtered.length === 1 ? "" : "s"}
            {search.q ? <> matching “{search.q}”</> : null}
            {activePack ? <> in <span className="font-medium text-foreground">{activePack.name}</span></> : null}
          </span>
          {search.q && activePack && matchesOutsidePack > 0 && (
            <button
              onClick={() => update({ pack: undefined })}
              className="underline underline-offset-2 transition hover:text-foreground"
            >
              {matchesOutsidePack} more in other packs — search all
            </button>
          )}
        </div>

        {filtered.length === 0 && (
          <div className="mt-6 rounded-2xl border border-dashed border-border bg-muted/20 p-8 text-center">
            <p className="text-sm font-medium">
              {activePack ? `No prompts in ${activePack.name} match your search.` : "No prompts match your search."}
            </p>
            {activePack && matchesOutsidePack > 0 && (
              <p className="mt-1 text-sm text-muted-foreground">
                {matchesOutsidePack} prompt{matchesOutsidePack === 1 ? "" : "s"} elsewhere in the library match “{search.q}”.
              </p>
            )}
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {activePack && (
                <Button size="sm" className="rounded-lg" onClick={() => update({ pack: undefined })}>
                  Search all packs
                </Button>
              )}
              <Button size="sm" variant="secondary" className="rounded-lg" onClick={() => { setQ(""); (navigate as any)({ search: {} }); }}>
                Clear filters
              </Button>
            </div>
          </div>
        )}



        {filtered.length > 0 && (groups ? (
          <div className="mt-6 space-y-10">
            {groups.map(g => (
              <div key={g.key}>
                <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-border/60 pb-3">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{g.label}</div>
                  <h3 className="font-display text-[1.1rem] tracking-tight">{g.hint}</h3>
                  <span className="ml-auto text-[11px] tabular-nums text-muted-foreground">{g.items.length}</span>
                </div>

                <PromptGrid items={g.items} />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6">
            <PromptGrid items={filtered} />
          </div>
        ))}

      </section>
      <ToolOutro
        title="Found the right prompt? Let the tools run it for you."
        text="Prompts are the fastest way to understand what a strong application looks like. When you want the finished document, the CV Generator, Cover Letter Lab and ATS Optimizer apply the same thinking automatically."
        primaryLabel="Generate my CV"
        primaryHref="/cv"
        secondaryLabel="Score my CV against a job"
        secondaryHref="/ats"
      />
    </SiteShell>
  );
}

