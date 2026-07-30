import { createFileRoute, useRouterState, useSearch, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X, Bookmark, FileDown } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { SiteShell } from "@/components/site-shell";
import { PromptGrid } from "@/components/prompt-card";
import { packs, prompts } from "@/lib/mock-data";

import { alternateHref, detectLocaleFromPath } from "@/lib/i18n";
import { useSavedPrompts } from "@/lib/saved-prompts";
import { buildPackTemplate, copyToClipboard, downloadText } from "@/lib/apply-template";

type Search = { q?: string; category?: string; pack?: string; sort?: "popular" | "newest" | "rating" | "tier"; price?: "all" | "free" | "paid"; beginner?: "1" };

export const Route = createFileRoute("/marketplace")({
  head: () => ({
    meta: [
      { title: "Job Search Prompt Library — CV, Cover Letter & ATS Prompts" },
      { name: "description", content: "A curated library of AI prompts for job seekers: tailor your CV to a job description, write cover letters, prep interviews and beat ATS filters." },
      { property: "og:title", content: "Job Search Prompt Library — ApplyWise" },
      { property: "og:description", content: "Curated AI prompts for CVs, cover letters, ATS and interviews." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/marketplace" },
    ],
    links: [{ rel: "canonical", href: "/marketplace" }],
  }),
  component: Marketplace,

  validateSearch: (s: Record<string, unknown>): Search => ({
    q: typeof s.q === "string" ? s.q : undefined,
    category: typeof s.category === "string" ? s.category : undefined,
    pack: typeof s.pack === "string" ? s.pack : undefined,
    sort: (s.sort as Search["sort"]) ?? "popular",
    price: (s.price as Search["price"]) ?? "all",
    beginner: s.beginner === "1" ? "1" : undefined,
  }),
});

export function Marketplace() {
  const search = useSearch({ strict: false });
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const locale = detectLocaleFromPath(pathname);
  const [q, setQ] = useState(search.q ?? "");
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
    if (search.beginner === "1") list = list.filter(p => p.beginner);
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

  const update = (patch: Partial<Search>) => (navigate as any)({ search: (prev: Search) => ({ ...prev, ...patch }) });

  return (
    <SiteShell>
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-foreground/[0.04] via-background to-background dark:from-foreground/[0.08]" />
        <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <a href={alternateHref(locale, "/")} className="text-xs text-muted-foreground">← Back</a>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/60 px-3 py-1.5 text-xs font-medium text-muted-foreground">
            Prompt Library • Curated for job seekers
          </div>
          <h1 className="font-display mt-4 text-5xl tracking-tight sm:text-6xl">Prompts that get you hired.</h1>
          <p className="mt-3 max-w-xl text-muted-foreground">CVs, cover letters, interview stories, recruiter outreach, negotiation scripts — built around the job hunt.</p>
          <form
            onSubmit={(e) => { e.preventDefault(); update({ q }); }}
            className="mt-8 flex max-w-2xl items-center gap-2 rounded-2xl border border-border bg-background/90 p-2 shadow-sm backdrop-blur"
          >
            <div className="flex flex-1 items-center gap-3 px-3">
              <Search className="h-5 w-5 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search CV, cover letter, ATS, interview…" className="h-11 border-0 bg-transparent shadow-none focus-visible:ring-0" />
            </div>
            <Button type="submit" className="rounded-xl">Search</Button>
          </form>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-6 rounded-2xl border border-border/70 bg-muted/30 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold">Prompt Packs</h2>
              <p className="text-xs text-muted-foreground">Curated sets — save a whole pack or copy an apply-ready template in one click.</p>
            </div>
            {activePack && (
              <div className="flex flex-wrap items-center gap-2">
                <Button size="sm" variant="secondary" className="h-8 rounded-lg" onClick={savePack}>
                  <Bookmark className="mr-1.5 h-3.5 w-3.5" /> Save pack
                </Button>
                <Button size="sm" className="h-8 rounded-lg" onClick={copyPackTemplate}>
                  <FileDown className="mr-1.5 h-3.5 w-3.5" /> Apply-ready template
                </Button>
                <button onClick={() => update({ pack: undefined })} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"><X className="h-3 w-3" /> Clear</button>
              </div>
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {packs.map(pk => (
              <button
                key={pk.slug}
                onClick={() => update({ pack: search.pack === pk.slug ? undefined : pk.slug })}
                title={pk.description}
                className={`whitespace-nowrap rounded-xl border px-3 py-2 text-sm transition ${search.pack === pk.slug ? "border-foreground bg-foreground text-background" : "border-border bg-background hover:border-foreground/30"}`}
              >
                <span className="mr-1.5">{pk.emoji}</span>{pk.name}
                <span className="ml-2 text-xs opacity-60">{prompts.filter(p => p.pack === pk.slug).length}</span>
              </button>
            ))}
          </div>
        </div>


        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-y border-border/60 py-4 text-sm">
          <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
            <SlidersHorizontal className="h-4 w-4" />
            <FilterChip label="Free" active={search.price === "free"} onClick={() => update({ price: search.price === "free" ? "all" : "free" })} />
            <FilterChip label="Premium" active={search.price === "paid"} onClick={() => update({ price: search.price === "paid" ? "all" : "paid" })} />
            <FilterChip label="Beginner-friendly" active={search.beginner === "1"} onClick={() => update({ beginner: search.beginner === "1" ? undefined : "1" })} />
            {(search.q || search.category || search.pack || search.price !== "all" || search.beginner) && (
              <button onClick={() => (navigate as any)({ search: {} })} className="ml-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"><X className="h-3 w-3" /> Clear all</button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Sort</span>
            <select value={(search.sort as string) ?? "popular"} onChange={(e) => update({ sort: e.target.value as Search["sort"] })} className="rounded-lg border border-border bg-background px-2 py-1 text-sm">
              <option value="popular">Popular</option>
              <option value="newest">Newest</option>
              <option value="rating">Top rated</option>
              <option value="tier">Free / Premium / Beginner</option>
            </select>
          </div>
        </div>

        <div className="mt-3 text-sm text-muted-foreground">
          {filtered.length} prompt{filtered.length === 1 ? "" : "s"}
        </div>


        {groups ? (
          <div className="mt-6 space-y-10">
            {groups.map(g => (
              <div key={g.key}>
                <div className="mb-4 flex items-baseline gap-3 border-b border-border/60 pb-2">
                  <h3 className="text-lg font-semibold tracking-tight">{g.label}</h3>
                  <span className="text-xs text-muted-foreground">{g.hint}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{g.items.length}</span>
                </div>
                <PromptGrid items={g.items} />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6">
            <PromptGrid items={filtered} />
          </div>
        )}
      </section>
    </SiteShell>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`rounded-full border px-3 py-1 text-xs transition ${active ? "border-foreground bg-foreground text-background" : "border-border bg-background hover:border-foreground/30"}`}>{label}</button>
  );
}
