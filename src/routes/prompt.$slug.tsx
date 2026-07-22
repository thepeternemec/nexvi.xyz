import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useLoaderData } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Copy, Check, Star, Bookmark, BookmarkCheck, Share2, Sparkles, Lock, Crown, Twitter, Linkedin, Facebook, Mail, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { SiteShell } from "@/components/site-shell";
import { PromptCard, isPremium } from "@/components/prompt-card";
import { getCategory, getCreator, getPrompt, prompts, reviews, type Prompt } from "@/lib/mock-data";
import { useSubscription } from "@/hooks/use-subscription";

export const Route = createFileRoute("/prompt/$slug")({
  component: PromptDetail,
  loader: ({ params }): { prompt: Prompt } => {
    const prompt = getPrompt(params.slug);
    if (!prompt) throw notFound();
    return { prompt };
  },
  head: ({ loaderData }) => ({
    meta: loaderData?.prompt
      ? [
          { title: `${loaderData.prompt.title} — getHeired` },
          { name: "description", content: loaderData.prompt.description },
        ]
      : [],
  }),
});

export function PromptDetail() {
  const { prompt } = useLoaderData({ strict: false }) as { prompt: Prompt };
  const creator = getCreator(prompt.creatorId);
  const category = getCategory(prompt.category);
  const related = prompts.filter(p => p.category === prompt.category && p.id !== prompt.id).slice(0, 3);
  const promptReviews = reviews.filter(r => r.promptId === prompt.id);
  const { isPremium: hasPremium, isAuthenticated, loading: subLoading } = useSubscription();
  const premium = isPremium(prompt);
  const locked = premium && !hasPremium;
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const SAVED_KEY = "applywise:saved-prompts";
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVED_KEY);
      const list: string[] = raw ? JSON.parse(raw) : [];
      setSaved(list.includes(prompt.id));
    } catch { /* ignore */ }
  }, [prompt.id]);
  const onToggleSave = () => {
    try {
      const raw = localStorage.getItem(SAVED_KEY);
      const list: string[] = raw ? JSON.parse(raw) : [];
      const next = list.includes(prompt.id) ? list.filter(id => id !== prompt.id) : [...list, prompt.id];
      localStorage.setItem(SAVED_KEY, JSON.stringify(next));
      const nowSaved = next.includes(prompt.id);
      setSaved(nowSaved);
      toast.success(nowSaved ? "Prompt saved" : "Removed from saved");
    } catch { toast.error("Couldn't update saved prompts"); }
  };
  const [linkCopied, setLinkCopied] = useState(false);
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = `${prompt.title} — ApplyWise`;
  const shareText = prompt.outcome || prompt.description;
  const copyLink = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const ta = document.createElement("textarea");
        ta.value = shareUrl; ta.style.position = "fixed"; ta.style.left = "-9999px";
        document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta);
      }
      setLinkCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setLinkCopied(false), 1500);
    } catch { toast.error("Couldn't copy link"); }
  };
  const onShareClick = async () => {
    if (typeof navigator !== "undefined" && (navigator as Navigator & { share?: (d: ShareData) => Promise<void> }).share) {
      try {
        await (navigator as Navigator & { share: (d: ShareData) => Promise<void> }).share({ title: shareTitle, text: shareText, url: shareUrl });
        return;
      } catch { /* fall through to dialog */ }
    }
    setShareOpen(true);
  };
  const onCopy = async () => {
    if (locked) return;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(prompt.body);
      } else {
        const ta = document.createElement("textarea");
        ta.value = prompt.body;
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      toast.success("Prompt copied to clipboard");
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Copy failed", err);
      toast.error("Couldn't copy — please try again");
    }
  };

  return (
    <SiteShell>
      <article className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:py-16">
        <nav className="mb-6 text-xs text-muted-foreground">
          <Link to="/marketplace">Prompt Library</Link>
          {category && <> / <Link to="/marketplace" search={{ category: category.slug } as never}>{category.name}</Link></>}
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {premium ? (
                <Badge className="rounded-full bg-gradient-to-r from-black to-neutral-800 text-white dark:from-white dark:to-neutral-200 dark:text-black"><Crown className="mr-1 h-3 w-3" /> Premium</Badge>
              ) : (
                <Badge className="rounded-full">Free</Badge>
              )}
              {prompt.beginner && <Badge variant="secondary" className="rounded-full">Beginner-friendly</Badge>}
              {prompt.tools.map(t => <span key={t} className="rounded-full border border-border px-2 py-0.5 text-[11px]">{t}</span>)}
            </div>
            <h1 className="font-display mt-4 text-4xl leading-tight tracking-tight sm:text-5xl">{prompt.title}</h1>
            <p className="mt-3 text-lg text-muted-foreground">{prompt.outcome}</p>
            <p className="mt-4 text-[15px] leading-relaxed text-foreground/80">{prompt.description}</p>

            <div className={`relative mt-8 overflow-hidden rounded-3xl bg-gradient-to-br ${prompt.cover} p-px`}>
              <div className="rounded-[calc(theme(borderRadius.3xl)-1px)] bg-card p-6">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {locked ? "Free preview" : "The prompt"}
                  </div>
                  <Button size="sm" onClick={onCopy} disabled={locked} className="rounded-full">
                    {locked ? <><Lock className="mr-1.5 h-3.5 w-3.5" /> Locked</>
                      : copied ? <><Check className="mr-1.5 h-3.5 w-3.5" /> Copied</>
                      : <><Copy className="mr-1.5 h-3.5 w-3.5" /> Copy prompt</>}
                  </Button>
                </div>
                {locked ? (
                  <div className="relative mt-4 overflow-hidden rounded-2xl border border-border/70">
                    <pre className="whitespace-pre-wrap bg-muted/60 p-5 font-mono text-[13px] leading-relaxed text-foreground/90">
                      {prompt.body.slice(0, 220).trimEnd()}{prompt.body.length > 220 ? "…" : ""}
                    </pre>
                    <pre aria-hidden className="select-none whitespace-pre-wrap bg-muted/60 p-5 font-mono text-[13px] leading-relaxed text-foreground/90 blur-[6px]">
                      {prompt.body.slice(220, 820) || "More premium guidance, variables, and step-by-step instructions inside."}
                    </pre>
                    {!subLoading && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center bg-gradient-to-t from-background/95 via-background/80 to-background/40 p-5">
                        <div className="max-w-sm rounded-2xl border border-border bg-background/95 p-5 text-center shadow-xl backdrop-blur">
                          <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-black to-neutral-800 text-white dark:from-white dark:to-neutral-200 dark:text-black">
                            <Crown className="h-5 w-5" />
                          </div>
                          <div className="font-display mt-3 text-lg">Unlock the full prompt</div>
                          <p className="mt-1 text-sm text-muted-foreground">
                            You're seeing a short preview. Upgrade to Premium for the full prompt, examples, and unlimited copies.
                          </p>
                          <div className="mt-4 flex flex-col gap-2">
                            <Button asChild className="rounded-full"><Link to="/pricing">Subscribe to get full prompt</Link></Button>
                            {!isAuthenticated && (
                              <Button asChild variant="ghost" size="sm" className="rounded-full"><Link to="/login">I already have an account</Link></Button>
                            )}
                          </div>
                          <ul className="mt-4 space-y-1.5 text-left text-xs text-muted-foreground">
                            <li className="flex items-start gap-2"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" /> Unlock every Premium prompt in the library</li>
                            <li className="flex items-start gap-2"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" /> Copy-ready templates with examples & variables</li>
                            <li className="flex items-start gap-2"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" /> AI CV, cover letter & ATS scoring tools</li>
                            <li className="flex items-start gap-2"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" /> Cancel anytime — no commitment</li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>

                ) : (
                  <pre className="mt-4 whitespace-pre-wrap rounded-2xl bg-muted/60 p-5 font-mono text-[13px] leading-relaxed text-foreground/90">
                    {prompt.body}
                  </pre>
                )}
              </div>
            </div>

            <section className="mt-10">
              <h2 className="font-display text-2xl tracking-tight">How to use it</h2>
              <ol className="mt-4 space-y-3">
                {prompt.instructions.map((step, i) => (
                  <li key={i} className="flex gap-3 rounded-2xl border border-border/70 bg-card p-4">
                    <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">{i + 1}</div>
                    <div className="text-sm">{step}</div>
                  </li>
                ))}
              </ol>
            </section>

            <section className="mt-10">
              <h2 className="font-display text-2xl tracking-tight">Example outputs</h2>
              <div className="mt-4 grid gap-4">
                {prompt.examples.map((ex, i) => (
                  <div key={i} className="overflow-hidden rounded-2xl border border-border/70">
                    <div className="border-b border-border/60 bg-muted/50 p-4 text-sm"><span className="text-xs uppercase tracking-wider text-muted-foreground">You</span><div className="mt-1">{ex.input}</div></div>
                    <div className="bg-card p-4 text-sm"><span className="text-xs uppercase tracking-wider text-muted-foreground">AI</span><div className="mt-1">{ex.output}</div></div>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-10">
              <h2 className="font-display text-2xl tracking-tight">Reviews</h2>
              <div className="mt-4 space-y-4">
                {promptReviews.length === 0 && <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-6 text-sm text-muted-foreground">Be the first to leave a review.</div>}
                {promptReviews.map(r => (
                  <div key={r.id} className="rounded-2xl border border-border/70 bg-card p-5">
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-amber-400 to-rose-500 text-xs font-semibold text-white">{r.avatar}</div>
                      <div className="text-sm">
                        <div className="font-medium">{r.author}</div>
                        <div className="text-xs text-muted-foreground">{r.date}</div>
                      </div>
                      <div className="ml-auto flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"}`} />)}
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-foreground/80">{r.body}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl border border-border/70 bg-card p-6">
              <div className="flex items-center gap-1 text-sm">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-medium">{prompt.rating}</span>
                <span className="text-muted-foreground">({prompt.reviews.toLocaleString()} reviews)</span>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">{prompt.uses.toLocaleString()} people used this prompt</div>
              <div className="mt-5 grid gap-2">
                {locked ? (
                  <Button asChild size="lg" className="rounded-full bg-gradient-to-r from-black to-neutral-800 text-white hover:opacity-95 dark:from-white dark:to-neutral-200 dark:text-black">
                    <Link to="/pricing"><Crown className="mr-1.5 h-4 w-4" /> Upgrade to unlock</Link>
                  </Button>
                ) : premium ? (
                  <Button size="lg" className="rounded-full" onClick={onCopy}>{copied ? "Copied!" : "Use this Premium prompt"}</Button>
                ) : (
                  <Button size="lg" className="rounded-full" onClick={onCopy}>{copied ? "Copied!" : "Use this prompt — free"}</Button>
                )}
                <div className="flex gap-2">
                  <Button variant={saved ? "default" : "outline"} onClick={onToggleSave} aria-pressed={saved} className="flex-1 rounded-full">
                    {saved ? <><BookmarkCheck className="mr-1.5 h-4 w-4" /> Saved</> : <><Bookmark className="mr-1.5 h-4 w-4" /> Save</>}
                  </Button>
                  <Button variant="outline" onClick={onShareClick} className="flex-1 rounded-full"><Share2 className="mr-1.5 h-4 w-4" /> Share</Button>
                </div>
              </div>
            </div>


            <div className="rounded-3xl border border-border/70 bg-card p-6">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tags</div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {prompt.tags.map(t => <span key={t} className="rounded-full bg-muted px-3 py-1 text-xs">#{t}</span>)}
              </div>
            </div>

            <Link to="/assistant" className="block rounded-3xl border border-border/70 bg-gradient-to-br from-black to-neutral-800 p-6 text-white dark:from-white dark:to-neutral-200 dark:text-black">
              <Sparkles className="h-4 w-4" />
              <div className="font-display mt-2 text-xl">Want more like this?</div>
              <div className="mt-1 text-sm text-white/80">Ask the AI Assistant for a personal plan.</div>
            </Link>
          </aside>
        </div>

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-3xl tracking-tight">Related prompts</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map(p => <PromptCard key={p.id} prompt={p} />)}
            </div>
          </section>
        )}
      </article>

      <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share this prompt</DialogTitle>
            <DialogDescription>Send a link to this prompt or share it on your favorite platform.</DialogDescription>
          </DialogHeader>
          <div className="mt-2 flex items-center gap-2">
            <Input readOnly value={shareUrl} onFocus={(e) => e.currentTarget.select()} className="rounded-full text-xs" />
            <Button onClick={copyLink} size="sm" className="rounded-full shrink-0">
              {linkCopied ? <><Check className="mr-1 h-3.5 w-3.5" /> Copied</> : <><LinkIcon className="mr-1 h-3.5 w-3.5" /> Copy</>}
            </Button>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-2">
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1.5 rounded-2xl border border-border/70 p-3 text-xs hover:bg-muted">
              <Twitter className="h-4 w-4" /> Twitter
            </a>
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1.5 rounded-2xl border border-border/70 p-3 text-xs hover:bg-muted">
              <Linkedin className="h-4 w-4" /> LinkedIn
            </a>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1.5 rounded-2xl border border-border/70 p-3 text-xs hover:bg-muted">
              <Facebook className="h-4 w-4" /> Facebook
            </a>
            <a href={`mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareText + "\n\n" + shareUrl)}`} className="flex flex-col items-center gap-1.5 rounded-2xl border border-border/70 p-3 text-xs hover:bg-muted">
              <Mail className="h-4 w-4" /> Email
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </SiteShell>
  );
}
