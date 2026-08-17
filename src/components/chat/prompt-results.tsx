import { useState } from "react";
import { ArrowUpRight, Search, Library } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export type PromptResultItem = {
  slug: string;
  title: string;
  outcome: string;
  category: string;
  pack?: string | null;
};

export type PromptResults = {
  kind: "prompt-results";
  query: string;
  total: number;
  items: PromptResultItem[];
};

export function isPromptResults(data: unknown): data is PromptResults {
  return (
    !!data &&
    typeof data === "object" &&
    (data as { kind?: string }).kind === "prompt-results" &&
    Array.isArray((data as PromptResults).items)
  );
}

const PAGE = 6;

export function PromptResultList({
  results,
  onSelect,
}: {
  results: PromptResults;
  onSelect?: (slug: string) => void;
}) {
  const [shown, setShown] = useState(PAGE);
  const items = results.items.slice(0, shown);
  const rest = results.items.length - items.length;

  return (
    <div className="not-prose w-full">
      <div className="flex items-center gap-2 text-[12.5px] text-muted-foreground">
        <Search className="h-3.5 w-3.5" />
        <span>
          {results.total === 0
            ? "No direct match"
            : `${results.total} prompt${results.total === 1 ? "" : "s"} match`}
          {results.query ? ` · “${results.query}”` : ""}
        </span>
      </div>

      <div className="mt-3 grid gap-2">
        {items.map((p, i) => (
          <div
            key={p.slug}
            className="group relative flex items-start gap-3 rounded-xl border border-border/70 bg-card/60 p-3 transition hover:border-foreground/20 hover:bg-card"
          >
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-border/70 bg-background text-[11px] font-medium text-muted-foreground">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13.5px] font-medium leading-snug">{p.title}</p>
              <p className="mt-0.5 line-clamp-2 text-[12.5px] leading-relaxed text-muted-foreground">
                {p.outcome}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <span className="rounded-full border border-border/60 px-2 py-0.5 text-[10.5px] uppercase tracking-wide text-muted-foreground">
                  {p.category.replace(/-/g, " ")}
                </span>
                {p.pack && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10.5px] text-primary">
                    {p.pack.replace(/-/g, " ")}
                  </span>
                )}
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1.5">
              <Button size="sm" variant="secondary" className="h-7 px-2.5 text-[12px]" onClick={() => onSelect?.(p.slug)}>
                Preview
              </Button>
              <Link
                to="/prompt/$slug"
                params={{ slug: p.slug }}
                className="inline-flex items-center gap-1 px-1 text-[11.5px] text-muted-foreground transition hover:text-foreground"
              >
                Open <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {rest > 0 && (
          <Button variant="outline" size="sm" className="h-7 text-[12px]" onClick={() => setShown((s) => s + PAGE)}>
            Show {Math.min(rest, PAGE)} more
          </Button>
        )}
        <Link
          to="/prompts"
          className="inline-flex items-center gap-1.5 rounded-full border border-border/70 px-3 py-1 text-[12px] text-muted-foreground transition hover:border-foreground/25 hover:text-foreground"
        >
          <Library className="h-3.5 w-3.5" /> Browse full library
        </Link>
      </div>
    </div>
  );
}
