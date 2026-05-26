import { Link } from "@tanstack/react-router";
import { Bookmark, Star, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Prompt } from "@/lib/mock-data";
import { getCreator } from "@/lib/mock-data";

export function PromptCard({ prompt }: { prompt: Prompt }) {
  const creator = getCreator(prompt.creatorId);
  return (
    <Link
      to="/prompt/$slug"
      params={{ slug: prompt.slug }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-border/70 bg-card transition-all hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-[0_20px_60px_-20px_rgb(0_0_0_/0.15)]"
    >
      <div className={`relative aspect-[16/10] w-full bg-gradient-to-br ${prompt.cover}`}>
        <div className="absolute inset-0 bg-grain opacity-60" />
        <div className="absolute left-4 top-4 flex gap-1.5">
          {prompt.price === 0 ? (
            <Badge className="rounded-full bg-white/90 text-foreground hover:bg-white">Free</Badge>
          ) : (
            <Badge className="rounded-full bg-foreground text-background">${prompt.price}</Badge>
          )}
          {prompt.beginner && (
            <Badge variant="secondary" className="rounded-full bg-white/80 text-foreground backdrop-blur">Beginner</Badge>
          )}
        </div>
        <button
          onClick={(e) => { e.preventDefault(); }}
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-foreground shadow-sm transition hover:bg-white"
          aria-label="Bookmark"
        >
          <Bookmark className="h-4 w-4" />
        </button>
        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-1.5">
          {prompt.tools.slice(0, 3).map(t => (
            <span key={t} className="rounded-full bg-black/30 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white backdrop-blur">{t}</span>
          ))}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-xl leading-tight tracking-tight">{prompt.title}</h3>
        </div>
        <p className="line-clamp-2 text-sm text-muted-foreground">{prompt.outcome}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-400 text-[10px] font-semibold text-white">
              {creator?.avatar}
            </div>
            <span className="text-xs text-muted-foreground">{creator?.name}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="font-medium text-foreground">{prompt.rating}</span>
            <span>({prompt.reviews.toLocaleString()})</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function PromptGrid({ items }: { items: Prompt[] }) {
  if (items.length === 0) {
    return (
      <div className="grid place-items-center rounded-3xl border border-dashed border-border bg-muted/30 px-6 py-20 text-center">
        <Sparkles className="h-6 w-6 text-muted-foreground" />
        <div className="mt-3 font-display text-xl">No prompts match — yet.</div>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">Try a different outcome, or ask the AI Assistant what would help.</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map(p => <PromptCard key={p.id} prompt={p} />)}
    </div>
  );
}
