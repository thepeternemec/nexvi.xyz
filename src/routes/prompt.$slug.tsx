import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, Check, Star, Bookmark, Share2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SiteShell } from "@/components/site-shell";
import { PromptCard } from "@/components/prompt-card";
import { getCategory, getCreator, getPrompt, prompts, reviews, type Prompt } from "@/lib/mock-data";

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
          { title: `${loaderData.prompt.title} — Prompt Academia` },
          { name: "description", content: loaderData.prompt.description },
        ]
      : [],
  }),
});

function PromptDetail() {
  const { prompt } = Route.useLoaderData();
  const creator = getCreator(prompt.creatorId);
  const category = getCategory(prompt.category);
  const related = prompts.filter(p => p.category === prompt.category && p.id !== prompt.id).slice(0, 3);
  const promptReviews = reviews.filter(r => r.promptId === prompt.id);
  const [copied, setCopied] = useState(false);
  const onCopy = () => {
    navigator.clipboard.writeText(prompt.body);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <SiteShell>
      <article className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:py-16">
        <nav className="mb-6 text-xs text-muted-foreground">
          <Link to="/marketplace">Marketplace</Link>
          {category && <> / <Link to="/marketplace" search={{ category: category.slug } as never}>{category.name}</Link></>}
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {prompt.price === 0 ? <Badge className="rounded-full">Free</Badge> : <Badge className="rounded-full bg-foreground text-background">${prompt.price}</Badge>}
              {prompt.beginner && <Badge variant="secondary" className="rounded-full">Beginner-friendly</Badge>}
              {prompt.tools.map(t => <span key={t} className="rounded-full border border-border px-2 py-0.5 text-[11px]">{t}</span>)}
            </div>
            <h1 className="font-display mt-4 text-4xl leading-tight tracking-tight sm:text-5xl">{prompt.title}</h1>
            <p className="mt-3 text-lg text-muted-foreground">{prompt.outcome}</p>
            <p className="mt-4 text-[15px] leading-relaxed text-foreground/80">{prompt.description}</p>

            <div className={`relative mt-8 overflow-hidden rounded-3xl bg-gradient-to-br ${prompt.cover} p-px`}>
              <div className="rounded-[calc(theme(borderRadius.3xl)-1px)] bg-card p-6">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">The prompt</div>
                  <Button size="sm" onClick={onCopy} className="rounded-full">
                    {copied ? <><Check className="mr-1.5 h-3.5 w-3.5" /> Copied</> : <><Copy className="mr-1.5 h-3.5 w-3.5" /> Copy prompt</>}
                  </Button>
                </div>
                <pre className="mt-4 whitespace-pre-wrap rounded-2xl bg-muted/60 p-5 font-mono text-[13px] leading-relaxed text-foreground/90">{prompt.body}</pre>
              </div>
            </div>

            <section className="mt-10">
              <h2 className="font-display text-2xl tracking-tight">How to use it</h2>
              <ol className="mt-4 space-y-3">
                {prompt.instructions.map((step, i) => (
                  <li key={i} className="flex gap-3 rounded-2xl border border-border/70 bg-card p-4">
                    <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-xs font-semibold text-white">{i + 1}</div>
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
                {prompt.price === 0 ? (
                  <Button size="lg" className="rounded-full" onClick={onCopy}>{copied ? "Copied!" : "Use this prompt — free"}</Button>
                ) : (
                  <Button size="lg" className="rounded-full">Unlock for ${prompt.price}</Button>
                )}
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 rounded-full"><Bookmark className="mr-1.5 h-4 w-4" /> Save</Button>
                  <Button variant="outline" className="flex-1 rounded-full"><Share2 className="mr-1.5 h-4 w-4" /> Share</Button>
                </div>
              </div>
            </div>

            {creator && (
              <div className="rounded-3xl border border-border/70 bg-card p-6">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Creator</div>
                <div className="mt-3 flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm font-semibold text-white">{creator.avatar}</div>
                  <div>
                    <div className="font-medium">{creator.name} {creator.verified && <span className="text-xs text-violet-600">✓</span>}</div>
                    <div className="text-xs text-muted-foreground">{creator.handle}</div>
                  </div>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{creator.bio}</p>
                <Button variant="outline" className="mt-4 w-full rounded-full">Follow</Button>
              </div>
            )}

            <div className="rounded-3xl border border-border/70 bg-card p-6">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tags</div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {prompt.tags.map(t => <span key={t} className="rounded-full bg-muted px-3 py-1 text-xs">#{t}</span>)}
              </div>
            </div>

            <Link to="/assistant" className="block rounded-3xl border border-border/70 bg-gradient-to-br from-violet-600 to-fuchsia-600 p-6 text-white">
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
    </SiteShell>
  );
}
