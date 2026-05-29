import { createFileRoute, Link, notFound } from "@tanstack/react-router";
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
          { title: `${loaderData.bundle.title} — Prompt Academia` },
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

function BundleDetail() {
  const { bundle, prompts } = Route.useLoaderData() as { bundle: { slug: string; title: string; description: string | null; cover: string | null; is_premium: boolean }; prompts: PromptItem[] };
  const { isPremium: hasPremium, isAuthenticated, loading: subLoading } = useSubscription();
  const premium = bundle.is_premium;
  const locked = premium && !hasPremium;
  const gradient = bundle.cover || "from-violet-500 via-fuchsia-500 to-amber-400";

  return (
    <SiteShell>
      <article className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:py-16">
        <nav className="mb-6 text-xs text-muted-foreground">
          <Link to="/bundles">Bundles</Link> / <span className="text-foreground">{bundle.title}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {premium ? (
                <Badge className="rounded-full bg-gradient-to-r from-amber-400 to-rose-500 text-white"><Crown className="mr-1 h-3 w-3" /> Premium Bundle</Badge>
              ) : (
                <Badge className="rounded-full">Free Bundle</Badge>
              )}
              <span className="rounded-full border border-border px-2 py-0.5 text-[11px]"><Package className="mr-1 inline h-3 w-3" />{prompts.length} prompts</span>
            </div>
            <h1 className="font-display mt-4 text-4xl leading-tight tracking-tight sm:text-5xl">{bundle.title}</h1>
            <p className="mt-3 text-lg text-muted-foreground">{bundle.description}</p>

            {/* Prompts list or paywall */}
            <div className={`relative mt-8 overflow-hidden rounded-3xl bg-gradient-to-br ${gradient} p-px`}>
              <div className="rounded-[calc(theme(borderRadius.3xl)-1px)] bg-card p-6">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {locked ? "Bundle preview" : "Bundle contents"}
                  </div>
                  {locked && (
                    <Badge variant="secondary" className="rounded-full text-[10px]">
                      <Lock className="mr-1 h-3 w-3" /> Locked
                    </Badge>
                  )}
                </div>
                <div className="relative mt-4">
                  <div className="space-y-4">
                    {prompts.length === 0 && (
                      <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-6 text-sm text-muted-foreground">
                        This bundle doesn't have any prompts yet.
                      </div>
                    )}
                    {(locked ? prompts.slice(0, 3) : prompts).map((p) => (
                      <BundlePromptRow key={p.id} prompt={p} locked={locked} />
                    ))}
                  </div>
                  {locked && !subLoading && (
                    <div className="mt-6 rounded-2xl border border-border bg-background p-6 text-center shadow-sm">
                      <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-amber-400 to-rose-500 text-white">
                        <Crown className="h-5 w-5" />
                      </div>
                      <div className="font-display mt-3 text-lg">
                        {prompts.length > 3 ? `+ ${prompts.length - 3} more premium prompts` : "Unlock this bundle"}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        You're previewing {Math.min(3, prompts.length)} of {prompts.length}. Upgrade to Premium to view full prompts, copy them, and unlock the entire library.
                      </p>
                      <div className="mt-4 flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
                        <Button asChild className="rounded-full"><Link to="/pricing">Upgrade to Premium</Link></Button>
                        {!isAuthenticated && (
                          <Button asChild variant="ghost" size="sm" className="rounded-full"><Link to="/login">I already have an account</Link></Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl border border-border/70 bg-card p-6">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Access</div>
              <div className="mt-3 grid gap-2">
                {locked ? (
                  <Button asChild size="lg" className="rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white hover:opacity-95">
                    <Link to="/pricing"><Crown className="mr-1.5 h-4 w-4" /> Upgrade to unlock</Link>
                  </Button>
                ) : premium ? (
                  <Button size="lg" className="rounded-full" asChild><Link to="/pricing">Premium Active</Link></Button>
                ) : (
                  <Button size="lg" className="rounded-full" asChild><Link to="/marketplace">Explore more prompts</Link></Button>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-border/70 bg-card p-6">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">What you get</div>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2"><Star className="mt-0.5 h-4 w-4 text-violet-600" /> {prompts.length} curated prompts</li>
                <li className="flex items-start gap-2"><Star className="mt-0.5 h-4 w-4 text-violet-600" /> Step-by-step instructions</li>
                <li className="flex items-start gap-2"><Star className="mt-0.5 h-4 w-4 text-violet-600" /> Example outputs</li>
                <li className="flex items-start gap-2"><Star className="mt-0.5 h-4 w-4 text-violet-600" /> Lifetime updates</li>
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
  const gradient = prompt.cover || "from-violet-500 via-fuchsia-500 to-amber-400";

  const onCopy = () => {
    if (locked || !prompt.body) return;
    navigator.clipboard.writeText(prompt.body);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-card">
      <div className={`h-2 bg-gradient-to-r ${gradient}`} />
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h4 className="font-medium">{prompt.title}</h4>
            <p className="mt-1 text-sm text-muted-foreground">{prompt.outcome}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {prompt.tools?.slice(0, 3).map((t) => (
                <span key={t} className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide">{t}</span>
              ))}
              {prompt.beginner && (
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide">Beginner</span>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="font-medium text-foreground">{prompt.rating ?? 0}</span>
            </div>
            <span className="text-[10px] text-muted-foreground">{prompt.uses_count?.toLocaleString()} uses</span>
          </div>
        </div>

        {!locked && prompt.body && (
          <div className="mt-4">
            <pre className="whitespace-pre-wrap rounded-xl bg-muted/60 p-4 font-mono text-[13px] leading-relaxed text-foreground/90">
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
            <div className="relative overflow-hidden rounded-xl border border-border/70">
              <pre aria-hidden className="select-none whitespace-pre-wrap bg-muted/60 p-4 font-mono text-[13px] leading-relaxed text-foreground/90 blur-[5px]">
                {prompt.body.slice(0, 220)}
              </pre>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-card to-transparent" />
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
