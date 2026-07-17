import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useLoaderData } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { queryOptions } from "@tanstack/react-query";
import { Lock, Crown, Package, Star, ArrowRight, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SiteShell } from "@/components/site-shell";
import { getBundlePrompts } from "@/lib/bundles.functions";
import { useSubscription } from "@/hooks/use-subscription";
import { useState } from "react";

export const Route = createFileRoute("/bundle/$slug")({
  component: BundleDetail,
  loader: async ({ params, context }) => {
    const data = await getBundlePrompts({ data: { bundleSlug: params.slug } });
    if (!data.bundle) throw notFound();
    return data;
  },
  head: ({ loaderData }) => ({
    meta: loaderData?.bundle
      ? [
          { title: `${loaderData.bundle.title} — getHeired` },
          { name: "description", content: loaderData.bundle.description ?? "" },
        ]
      : [],
  }),
});

type PromptItem = {
  id: string;
  slug: string;
  title: string;
  outcome: string | null;
  description: string | null;
  body: string | null;
  category_slug: string | null;
  difficulty: string | null;
  beginner: boolean | null;
  price: number | null;
  is_premium: boolean | null;
  cover: string | null;
  tools: string[] | null;
  tags: string[] | null;
  rating: number | null;
  reviews_count: number | null;
  uses_count: number | null;
  creator_name: string | null;
  creator_handle: string | null;
  creator_avatar: string | null;
};

export default function BundleDetail() {
  const { bundle, prompts } = useLoaderData({ strict: false }) as { bundle: { slug: string; title: string; description: string | null; cover: string | null; is_premium: boolean }; prompts: PromptItem[] };
  const { isPremium: hasPremium, isAuthenticated, loading: subLoading } = useSubscription();
  const premium = bundle.is_premium;
  const locked = premium && !hasPremium;

  return (
    <SiteShell>
      <article className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:py-16">
        <nav className="mb-6 text-xs text-muted-foreground">
          <Link to="/bundles" className="hover:text-foreground transition-colors">Bundles</Link>
          <span className="mx-1.5">/</span>
          <span className="text-foreground">{bundle.title}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {premium ? (
                <Badge className="rounded-full border-0 bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-500/20 dark:text-amber-200 dark:hover:bg-amber-500/20">
                  <Crown className="mr-1 h-3 w-3 text-amber-600 dark:text-amber-300" /> Premium Bundle
                </Badge>
              ) : (
                <Badge className="rounded-full border border-border bg-background text-foreground hover:bg-muted">Free Bundle</Badge>
              )}
              <span className="rounded-full border border-border px-2.5 py-0.5 text-[11px] text-muted-foreground">
                <Package className="mr-1 inline h-3 w-3" />{prompts.length} prompts
              </span>
            </div>
            <h1 className="font-display mt-4 text-4xl leading-[1.1] tracking-tight sm:text-5xl">{bundle.title}</h1>
            <p className="mt-3 text-lg leading-relaxed text-muted-foreground max-w-2xl">{bundle.description}</p>

            {/* Prompts list */}
            <div className="mt-10 rounded-2xl border border-border/70 bg-card">
              <div className="p-6 pb-4">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                    {locked ? "Bundle preview" : "Bundle contents"}
                  </div>
                  {locked && (
                    <Badge variant="secondary" className="rounded-full text-[10px]">
                      <Lock className="mr-1 h-3 w-3" /> Locked
                    </Badge>
                  )}
                </div>
              </div>
              <div className="px-6 pb-6">
                <div className="space-y-3">
                  {prompts.length === 0 && (
                    <div className="rounded-xl border border-dashed border-border bg-muted/30 p-6 text-sm text-muted-foreground text-center">
                      This bundle doesn't have any prompts yet.
                    </div>
                  )}
                  {(locked ? prompts.slice(0, 3) : prompts).map((p) => (
                    <BundlePromptRow key={p.id} prompt={p} locked={locked} />
                  ))}
                </div>
                {locked && !subLoading && (
                  <div className="mt-6 rounded-xl border border-border bg-muted/30 p-6 text-center">
                    <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                      <Crown className="h-5 w-5" />
                    </div>
                    <div className="font-display mt-3 text-lg">
                      {prompts.length > 3 ? `+ ${prompts.length - 3} more premium prompts` : "Unlock this bundle"}
                    </div>
                    <p className="mt-1.5 text-sm text-muted-foreground max-w-md mx-auto">
                      You're previewing {Math.min(3, prompts.length)} of {prompts.length}. Upgrade to Premium to view full prompts, copy them, and unlock the entire library.
                    </p>
                    <div className="mt-5 flex flex-col items-center gap-2.5 sm:flex-row sm:justify-center">
                      <Button asChild className="rounded-full px-6"><Link to="/pricing">Upgrade to Premium</Link></Button>
                      {!isAuthenticated && (
                        <Button asChild variant="ghost" size="sm" className="rounded-full"><Link to="/login">I already have an account</Link></Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-border/70 bg-card p-6">
              <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Access</div>
              <div className="mt-4 grid gap-2.5">
                {locked ? (
                  <Button asChild size="lg" className="rounded-full">
                    <Link to="/pricing"><Crown className="mr-1.5 h-4 w-4 text-amber-600 dark:text-amber-300" /> Upgrade to unlock</Link>
                  </Button>
                ) : premium ? (
                  <Button size="lg" className="rounded-full" variant="outline" asChild><Link to="/pricing">Premium Active</Link></Button>
                ) : (
                  <Button size="lg" className="rounded-full" variant="outline" asChild><Link to="/marketplace">Explore more prompts</Link></Button>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card p-6">
              <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">What you get</div>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-3"><Star className="mt-0.5 h-4 w-4 text-foreground/60" /> {prompts.length} curated prompts</li>
                <li className="flex items-start gap-3"><Star className="mt-0.5 h-4 w-4 text-foreground/60" /> Step-by-step instructions</li>
                <li className="flex items-start gap-3"><Star className="mt-0.5 h-4 w-4 text-foreground/60" /> Example outputs</li>
                <li className="flex items-start gap-3"><Star className="mt-0.5 h-4 w-4 text-foreground/60" /> Lifetime updates</li>
              </ul>
            </div>
          </aside>
        </div>
      </article>
    </SiteShell>
  );
}

function BundlePromptRow({ prompt, locked }: { prompt: PromptItem; locked: boolean }) {
  const [copied, setCopied] = useState(false);

  const onCopy = () => {
    if (locked || !prompt.body) return;
    navigator.clipboard.writeText(prompt.body);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="rounded-xl border border-border/60 bg-background transition-colors hover:border-border">
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-[15px] leading-snug">{prompt.title}</h4>
            <p className="mt-1 text-sm text-muted-foreground">{prompt.outcome}</p>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {prompt.tools?.slice(0, 3).map((t) => (
                <span key={t} className="rounded-full border border-border bg-muted/60 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{t}</span>
              ))}
              {prompt.beginner && (
                <span className="rounded-full border border-border bg-muted/60 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Beginner</span>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="font-medium text-foreground">{prompt.rating ?? 0}</span>
            </div>
            <span className="text-[10px] text-muted-foreground">{prompt.uses_count?.toLocaleString()} uses</span>
          </div>
        </div>

        {!locked && prompt.body && (
          <div className="mt-4">
            <pre className="whitespace-pre-wrap rounded-lg bg-muted/40 p-4 font-mono text-[13px] leading-relaxed text-foreground/80">
              {prompt.body}
            </pre>
            <div className="mt-3 flex items-center gap-2">
              <Button size="sm" onClick={onCopy} className="rounded-full">
                {copied ? <><Check className="mr-1.5 h-3.5 w-3.5" /> Copied</>
                  : <><Copy className="mr-1.5 h-3.5 w-3.5" /> Copy prompt</>}
              </Button>
              <Button asChild size="sm" variant="outline" className="rounded-full">
                <Link to="/prompt/$slug" params={{ slug: prompt.slug }}>View details <ArrowRight className="ml-1 h-3 w-3" /></Link>
              </Button>
            </div>
          </div>
        )}
        {locked && prompt.body && (
          <div className="mt-4">
            <div className="relative overflow-hidden rounded-lg border border-border/60">
              <pre aria-hidden className="select-none whitespace-pre-wrap bg-muted/40 p-4 font-mono text-[13px] leading-relaxed text-foreground/80 blur-[5px]">
                {prompt.body.slice(0, 220)}
              </pre>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-background to-transparent" />
            </div>
            <div className="mt-3 flex items-center gap-2">
              <Button size="sm" disabled className="rounded-full">
                <Lock className="mr-1.5 h-3.5 w-3.5" /> Locked
              </Button>
              <Button asChild size="sm" variant="outline" className="rounded-full">
                <Link to="/pricing">Upgrade to unlock</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
