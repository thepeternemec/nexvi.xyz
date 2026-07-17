import { createFileRoute, useRouterState, useSearch, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SiteShell } from "@/components/site-shell";
import { PromptGrid } from "@/components/prompt-card";
import { categories, prompts } from "@/lib/mock-data";
import { alternateHref, detectLocaleFromPath } from "@/lib/i18n";

type Search = { q?: string; category?: string; sort?: "popular" | "newest" | "rating"; price?: "all" | "free" | "paid"; beginner?: "1" };

export const Route = createFileRoute("/marketplace")({
  component: Marketplace,
  validateSearch: (s: Record<string, unknown>): Search => ({
    q: typeof s.q === "string" ? s.q : undefined,
    category: typeof s.category === "string" ? s.category : undefined,
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

  const filtered = useMemo(() => {
    let list = [...prompts];
    if (search.category) list = list.filter(p => p.category === search.category);
    if (search.price === "free") list = list.filter(p => p.price === 0);
    if (search.price === "paid") list = list.filter(p => p.price > 0);
    if (search.beginner === "1") list = list.filter(p => p.beginner);
    if (search.q) {
      const needle = search.q.toLowerCase();
      list = list.filter(p =>
        p.title.toLowerCase().includes(needle) ||
        p.outcome.toLowerCase().includes(needle) ||
        p.description.toLowerCase().includes(needle) ||
        p.tags.some(t => t.includes(needle))
      );
    }
    if (search.sort === "rating") list.sort((a, b) => b.rating - a.rating);
    else if (search.sort === "newest") list.reverse();
    else list.sort((a, b) => b.uses - a.uses);
    return list;
  }, [search]);

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
        <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-4">
          <button onClick={() => update({ category: undefined })} className={`rounded-full border px-3 py-1.5 text-sm transition ${!search.category ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground/30"}`}>All</button>
          {categories.map(c => (
            <button key={c.slug} onClick={() => update({ category: c.slug })} className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-sm transition ${search.category === c.slug ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground/30"}`}>
              <span className="mr-1">{c.emoji}</span>{c.name}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-y border-border/60 py-4 text-sm">
          <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
            <SlidersHorizontal className="h-4 w-4" />
            <FilterChip label="Free" active={search.price === "free"} onClick={() => update({ price: search.price === "free" ? "all" : "free" })} />
            <FilterChip label="Premium" active={search.price === "paid"} onClick={() => update({ price: search.price === "paid" ? "all" : "paid" })} />
            <FilterChip label="Beginner-friendly" active={search.beginner === "1"} onClick={() => update({ beginner: search.beginner === "1" ? undefined : "1" })} />
            {(search.q || search.category || search.price !== "all" || search.beginner) && (
              <button onClick={() => (navigate as any)({ search: {} })} className="ml-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"><X className="h-3 w-3" /> Clear all</button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Sort</span>
            <select value={search.sort} onChange={(e) => update({ sort: e.target.value as Search["sort"] })} className="rounded-lg border border-border bg-background px-2 py-1 text-sm">
              <option value="popular">Popular</option>
              <option value="newest">Newest</option>
              <option value="rating">Top rated</option>
            </select>
          </div>
        </div>

        <div className="mt-3 text-sm text-muted-foreground">
          {filtered.length} prompt{filtered.length === 1 ? "" : "s"}
          {search.category && <> in <Badge variant="secondary" className="rounded-full">{categories.find(c => c.slug === search.category)?.name}</Badge></>}
        </div>

        <div className="mt-6">
          <PromptGrid items={filtered} />
        </div>
      </section>
    </SiteShell>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`rounded-full border px-3 py-1 text-xs transition ${active ? "border-foreground bg-foreground text-background" : "border-border bg-background hover:border-foreground/30"}`}>{label}</button>
  );
}
