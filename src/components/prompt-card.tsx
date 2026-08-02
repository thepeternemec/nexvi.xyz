import { useRouterState } from "@tanstack/react-router";
import { Sparkles, Lock, Crown, ArrowRight, Bookmark, BookmarkCheck, FileDown } from "lucide-react";
import { toast } from "sonner";
import type { Prompt } from "@/lib/mock-data";
import { useSubscription } from "@/hooks/use-subscription";
import { alternateHref, detectLocaleFromPath } from "@/lib/i18n";
import { MeshGradient } from "@/components/mesh-gradient";
import { useSavedPrompts } from "@/lib/saved-prompts";
import { buildApplyTemplate, copyToClipboard } from "@/lib/apply-template";
import { openUpgradeDialog } from "@/components/upgrade-dialog";

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
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[0_1px_2px_0_rgba(15,23,64,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/25 hover:shadow-[0_1px_2px_0_rgba(15,23,64,0.06),0_24px_60px_-40px_rgba(15,15,40,0.45)]"
    >
      {/* Signal band — quiet gradient strip, not a hero image */}
      <div className="relative aspect-[16/6] w-full overflow-hidden border-b border-border/60">
        <MeshGradient seed={prompt.id} className="absolute inset-0 h-full w-full opacity-90 transition duration-500 group-hover:scale-[1.03]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,color-mix(in_oklab,var(--card)_70%,transparent))]" />

        <div className="absolute right-3 top-3 flex gap-1.5">
          <button
            type="button"
            onClick={onSave}
            aria-label={saved ? "Remove from saved" : "Save prompt"}
            title={saved ? "Saved" : "Save prompt"}
            className={`grid h-7 w-7 place-items-center rounded-full border backdrop-blur transition ${saved ? "border-primary/40 bg-primary text-primary-foreground" : "border-border/60 bg-background/80 text-foreground hover:bg-background"}`}
          >
            {saved ? <BookmarkCheck className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
          </button>
          <button
            type="button"
            onClick={onApplyReady}
            aria-label="Copy apply-ready template"
            title="Copy apply-ready template"
            className="grid h-7 w-7 place-items-center rounded-full border border-border/60 bg-background/80 text-foreground backdrop-blur transition hover:bg-background"
          >
            <FileDown className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        {/* Kicker row — uppercase tracked labels, Stripe-style */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          {premium ? (
            <span className="inline-flex items-center gap-1 text-primary">
              <Crown className="h-3 w-3" /> Premium
            </span>
          ) : (
            <span>Free</span>
          )}
          {prompt.beginner && <span className="text-muted-foreground/70">Beginner</span>}
          <span className="text-muted-foreground/70">{prompt.tools.slice(0, 2).join(" · ")}</span>
        </div>

        <h3 className="mt-3 font-display text-[1.0625rem] leading-snug tracking-tight">{prompt.title}</h3>
        <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">{prompt.outcome}</p>

        <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4 text-[12px]">
          <span className="inline-flex items-center gap-1.5 text-foreground/80 transition group-hover:text-primary">
            {locked ? "Unlock prompt" : "Open prompt"}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
          {locked ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] tracking-wide text-primary">
              <Lock className="h-3 w-3" /> Pro
            </span>
          ) : (
            <span className="text-[11px] tracking-wide text-muted-foreground">{prompt.tools.length} model{prompt.tools.length === 1 ? "" : "s"}</span>
          )}
        </div>
      </div>
    </a>
  );
}

export function PromptGrid({ items }: { items: Prompt[] }) {
  if (items.length === 0) {
    return (
      <div className="grid place-items-center rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-20 text-center">
        <Sparkles className="h-6 w-6 text-muted-foreground" />
        <div className="mt-3 font-display text-xl tracking-tight">No prompts match — yet.</div>
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
