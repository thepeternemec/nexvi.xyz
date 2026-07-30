import { useRouterState } from "@tanstack/react-router";
import { Sparkles, Lock, Crown, ArrowUpRight, Bookmark, BookmarkCheck, FileDown } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import type { Prompt } from "@/lib/mock-data";
import { useSubscription } from "@/hooks/use-subscription";
import { alternateHref, detectLocaleFromPath } from "@/lib/i18n";
import { MeshGradient } from "@/components/mesh-gradient";
import { useSavedPrompts } from "@/lib/saved-prompts";
import { buildApplyTemplate, copyToClipboard } from "@/lib/apply-template";

export function isPremium(p: Pick<Prompt, "price">) {
  return p.price > 0;
}

export function PromptCard({ prompt }: { prompt: Prompt }) {
  const { isPremium: hasPremium } = useSubscription();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const locale = detectLocaleFromPath(pathname);
  const premium = isPremium(prompt);
  const locked = premium && !hasPremium;
  const { isSaved, toggle } = useSavedPrompts();
  const saved = isSaved(prompt.slug);

  const onSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nowSaved = toggle(prompt.slug);
    toast.success(nowSaved ? "Saved to your library" : "Removed from saved");
  };

  const onApplyReady = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const ok = await copyToClipboard(buildApplyTemplate(prompt));
    toast[ok ? "success" : "error"](
      ok ? "Apply-ready template copied — paste it into ChatGPT or Claude" : "Could not copy the template",
    );
  };

  const onCardClick = (e: React.MouseEvent) => {
    if (!locked) return;
    e.preventDefault();
    openUpgradeDialog({ title: prompt.title });
  };

  return (
    <a
      href={alternateHref(locale, `/prompt/${prompt.slug}`)}
      onClick={onCardClick}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border/60 bg-card transition-all hover:border-foreground/20 hover:shadow-[0_8px_30px_-10px_rgb(0_0_0_/0.12)]"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <MeshGradient seed={prompt.id} className="absolute inset-0 h-full w-full" />
        <div className="absolute left-3 top-3 flex gap-1.5">
          {premium ? (
            <Badge className="rounded-md bg-black/60 text-white text-[10px] border-0 hover:bg-black/60">
              <Crown className="mr-1 h-2.5 w-2.5" /> Premium
            </Badge>
          ) : (
            <Badge className="rounded-md bg-white/90 text-foreground text-[10px] border-0 hover:bg-white dark:bg-black/80 dark:text-white dark:hover:bg-black">Free</Badge>
          )}
          {prompt.beginner && (
            <Badge variant="secondary" className="rounded-md bg-white/80 text-foreground text-[10px] border-0 backdrop-blur dark:bg-black/70 dark:text-white">Beginner</Badge>
          )}
        </div>
        <div className="absolute right-3 top-3 flex gap-1.5">
          <button
            type="button"
            onClick={onSave}
            aria-label={saved ? "Remove from saved" : "Save prompt"}
            title={saved ? "Saved" : "Save prompt"}
            className={`grid h-7 w-7 place-items-center rounded-md border border-white/20 backdrop-blur transition ${saved ? "bg-primary text-primary-foreground" : "bg-black/45 text-white hover:bg-black/70"}`}
          >
            {saved ? <BookmarkCheck className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
          </button>
          <button
            type="button"
            onClick={onApplyReady}
            aria-label="Copy apply-ready template"
            title="Copy apply-ready template"
            className="grid h-7 w-7 place-items-center rounded-md border border-white/20 bg-black/45 text-white backdrop-blur transition hover:bg-black/70"
          >
            <FileDown className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1.5">
          {prompt.tools.slice(0, 3).map(t => (
            <span key={t} className="rounded bg-black/40 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white/90 backdrop-blur">{t}</span>
          ))}
        </div>
        {locked && (
          <div className="absolute inset-0 flex items-center justify-center bg-foreground/40 opacity-0 backdrop-blur-[2px] transition group-hover:opacity-100">
            <div className="inline-flex items-center gap-1.5 rounded bg-white/95 px-3 py-1.5 text-xs font-medium text-foreground shadow">
              <Lock className="h-3.5 w-3.5" /> Premium — Upgrade to unlock
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold leading-snug tracking-tight">{prompt.title}</h3>
          <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
        </div>
        <p className="line-clamp-2 text-xs text-muted-foreground">{prompt.outcome}</p>
      </div>
    </a>
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
