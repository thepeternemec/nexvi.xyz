import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useLoaderData } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Copy, Check, Bookmark, BookmarkCheck, Share2, Sparkles, Lock, Crown, Twitter, Linkedin, Facebook, Mail, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { SiteShell } from "@/components/site-shell";
import { PromptCard, isPremium } from "@/components/prompt-card";
import { getCategory, getCreator, getPrompt, prompts, reviews, type Prompt } from "@/lib/mock-data";
import { useSubscription } from "@/hooks/use-subscription";
import { openUpgradeDialog } from "@/components/upgrade-dialog";
import { gtmPromptAction, gtmUpgrade } from "@/lib/gtm";
import { useLocale } from "@/lib/locale-context";

export const Route = createFileRoute("/prompt/$slug")({
  component: PromptDetail,
  loader: ({ params }): { prompt: Prompt } => {
    const prompt = getPrompt(params.slug);
    if (!prompt) throw notFound();
    return { prompt };
  },
  head: ({ params, loaderData }) => {
    const p = loaderData?.prompt;
    if (!p) return { meta: [] };
    const url = `https://applywise.eu/prompt/${params.slug}`;
    return {
      meta: [
        { title: `${p.title} — AI Prompt | ApplyWise` },
        { name: "description", content: p.description },
        { property: "og:title", content: `${p.title} — ApplyWise` },
        { property: "og:description", content: p.description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: p.title,
            description: p.description,
            about: "Job search, CV and cover letter writing",
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "/" },
              { "@type": "ListItem", position: 2, name: "Prompt Library", item: "/marketplace" },
              { "@type": "ListItem", position: 3, name: p.title, item: url },
            ],
          }),
        },
      ],
    };
  },
});


export function PromptDetail() {
  const { prompt } = useLoaderData({ strict: false }) as { prompt: Prompt };
  const creator = getCreator(prompt.creatorId);
  const category = getCategory(prompt.category);
  const related = prompts.filter(p => p.category === prompt.category && p.id !== prompt.id).slice(0, 3);
  const promptReviews = reviews.filter(r => r.promptId === prompt.id);
  const { isPremium: hasPremium, isAuthenticated, loading: subLoading } = useSubscription();
  const { locale } = useLocale();
  const premium = isPremium(prompt);
  // While the subscription is still resolving we must not treat the user as free —
  // that flashed the Premium paywall at signed-in trial/premium members.
  const locked = premium && !subLoading && !hasPremium;
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const SAVED_KEY = "applywise:saved-prompts";

  const plan = hasPremium ? "premium" : "free";
  const promptTracking = {
    id: prompt.id,
    slug: prompt.slug,
    title: prompt.title,
    premium,
    category: category?.slug ?? prompt.category,
  };

  useEffect(() => {
    gtmPromptAction("view", promptTracking, { plan, locale });
  }, [prompt.id, hasPremium, locale]);

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
      gtmPromptAction(nowSaved ? "save" : "unsave", promptTracking, { plan, locale });
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
      gtmPromptAction("share", promptTracking, { plan, locale });
      toast.success("Link copied to clipboard");
      setTimeout(() => setLinkCopied(false), 1500);
    } catch { toast.error("Couldn't copy link"); }
  };
  const onShareClick = async () => {
    if (typeof navigator !== "undefined" && (navigator as Navigator & { share?: (d: ShareData) => Promise<void> }).share) {
      try {
        await (navigator as Navigator & { share: (d: ShareData) => Promise<void> }).share({ title: shareTitle, text: shareText, url: shareUrl });
        gtmPromptAction("share", promptTracking, { plan, locale, method: "native" });
        return;
      } catch { /* fall through to dialog */ }
    }
    setShareOpen(true);
  };
  const onCopy = async () => {
    if (locked) {
      openUpgradeDialog({ title: prompt.title, reason: "Copying is part of Premium. Start a free 7-day trial to copy the full prompt — cancel anytime." });
      gtmUpgrade("cta_click", { source: "prompt_copy_locked", prompt_title: prompt.title, prompt_slug: prompt.slug, plan, locale });
      return;
    }
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
      gtmPromptAction("copy", promptTracking, { plan, locale });
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
                  <Button size="sm" onClick={onCopy} disabled={subLoading} className="rounded-full">
                    {subLoading ? "Loading…"
                      : locked ? <><Lock className="mr-1.5 h-3.5 w-3.5" /> Locked</>
                      : copied ? <><Check className="mr-1.5 h-3.5 w-3.5" /> Copied</>
                      : <><Copy className="mr-1.5 h-3.5 w-3.5" /> Copy prompt</>}
                  </Button>
                </div>
                {locked ? (
                  <div className="relative mt-4 overflow-hidden rounded-2xl border border-border/70">
                    <pre className="whitespace-pre-wrap bg-muted/60 px-5 pt-5 font-mono text-[13px] leading-relaxed text-foreground/90">
                      {prompt.body.slice(0, 220).trimEnd()}{prompt.body.length > 220 ? "…" : ""}
                    </pre>
                    <pre aria-hidden className="select-none whitespace-pre-wrap bg-muted/60 px-5 pb-40 pt-3 font-mono text-[13px] leading-relaxed text-foreground/90 blur-[6px]">
                      {prompt.body.slice(220, 820) || "More premium guidance, variables, and step-by-step instructions inside."}
                    </pre>
                    {!subLoading && (
                      <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-background via-background/95 to-transparent px-4 pb-4 pt-16 sm:px-6">
                        <div className="mx-auto max-w-md rounded-2xl border border-border/70 bg-background/80 p-4 shadow-lg backdrop-blur-md sm:p-5">
                          <div>
                            <div className="min-w-0">
                              <div className="font-display text-base leading-snug">Unlock the full prompt</div>
                              <p className="mt-0.5 text-xs text-muted-foreground">
                                This is a short preview. Go Premium for the complete prompt, examples and variables.
                              </p>
                            </div>
                          </div>

                          <ul className="mt-3 grid gap-1.5 text-xs text-muted-foreground sm:grid-cols-2">
                            <li className="flex items-start gap-1.5"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" /> Every Premium prompt</li>
                            <li className="flex items-start gap-1.5"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" /> Examples & variables</li>
                            <li className="flex items-start gap-1.5"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" /> CV, cover letter & ATS tools</li>
                            <li className="flex items-start gap-1.5"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" /> Cancel anytime</li>
                          </ul>
                          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
                            <Button onClick={() => openUpgradeDialog({ title: prompt.title })} className="rounded-full sm:flex-1">Unlock full prompt</Button>
                            {!isAuthenticated && (
                              <Button asChild variant="ghost" size="sm" className="rounded-full"><Link to="/login">I have an account</Link></Button>
                            )}
                          </div>
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
              <h2 className="font-display text-2xl tracking-tight">Run this prompt</h2>
              <p className="mt-2 text-sm text-muted-foreground">Copy the prompt above, then open your favourite AI assistant and paste it in.</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button asChild variant="outline" className="rounded-full">
                  <a href="https://chatgpt.com/" target="_blank" rel="noreferrer">Go to ChatGPT</a>
                </Button>
                <Button asChild variant="outline" className="rounded-full">
                  <a href="https://claude.ai/new" target="_blank" rel="noreferrer">Go to Claude</a>
                </Button>
              </div>
            </section>

          </div>

          {/* SIDEBAR */}
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-2xl border border-border/70 bg-card/80 shadow-[0_1px_2px_0_rgba(15,23,64,0.06)] backdrop-blur-xl">
              <div className="border-b border-border/60 px-5 py-4">
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Usage</div>
                <div className="mt-1.5 font-display text-[1.05rem] tracking-tight tabular-nums">
                  {prompt.uses.toLocaleString()} job seekers
                </div>
                <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
                  Pro unlocks every premium prompt, the CV &amp; cover letter generators, ATS scoring and the Humanizer.
                </p>
              </div>

              <div className="grid gap-2 px-5 py-5">
                {locked ? (
                  <Button onClick={() => openUpgradeDialog({ title: prompt.title })} className="h-10 rounded-xl text-[13px]">
                    <Crown className="mr-1.5 h-4 w-4" /> Upgrade to unlock
                  </Button>
                ) : (
                  <Button className="h-10 rounded-xl text-[13px]" onClick={onCopy}>
                    {copied ? "Copied" : premium ? "Use this Premium prompt" : "Use this prompt — free"}
                  </Button>
                )}
                <div className="flex gap-2">
                  <Button
                    variant={saved ? "secondary" : "outline"}
                    onClick={onToggleSave}
                    aria-pressed={saved}
                    className="h-9 flex-1 rounded-xl text-[12px] font-normal"
                  >
                    {saved ? <><BookmarkCheck className="mr-1.5 h-3.5 w-3.5" /> Saved</> : <><Bookmark className="mr-1.5 h-3.5 w-3.5" /> Save</>}
                  </Button>
                  <Button variant="outline" onClick={onShareClick} className="h-9 flex-1 rounded-xl text-[12px] font-normal">
                    <Share2 className="mr-1.5 h-3.5 w-3.5" /> Share
                  </Button>
                </div>
              </div>
            </div>


            <div className="rounded-2xl border border-border/70 bg-card/80 px-5 py-4 shadow-[0_1px_2px_0_rgba(15,23,64,0.06)] backdrop-blur-xl">
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Tags</div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {prompt.tags.map(t => (
                  <span key={t} className="rounded-full border border-border/70 bg-background/70 px-2.5 py-1 text-[11px] text-muted-foreground">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {!hasPremium && (
              <div className="relative overflow-hidden rounded-2xl border border-primary/25 bg-primary/[0.06] px-5 py-5 backdrop-blur-xl">
                <span aria-hidden className="absolute inset-x-0 top-0 h-[2px] bg-primary" />
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-primary">
                  <Sparkles className="h-3 w-3" /> Go Pro
                </div>
                <div className="mt-2.5 font-display text-[1.1rem] leading-snug tracking-tight">
                  Stop rewriting your CV for every job.
                </div>
                <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">
                  Every premium prompt plus AI CV, cover letter, ATS scoring and Humanizer tools — cancel anytime.
                </p>
                <Button asChild className="mt-4 h-10 w-full rounded-xl text-[13px]">
                  <Link to="/pricing">Subscribe to Pro</Link>
                </Button>
              </div>
            )}




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
