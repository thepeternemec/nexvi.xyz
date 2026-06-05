import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { creators, prompts } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/creators")({ component: Creators });

function Creators() {
  return (
    <SiteShell>
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-foreground/[0.04] via-background to-background dark:from-foreground/[0.08]" />
        <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Career Coaches</div>
          <h1 className="font-display mt-2 text-5xl tracking-tight sm:text-6xl">People who've helped thousands get hired.</h1>
          <p className="mt-3 max-w-xl text-muted-foreground">Ex-recruiters, career coaches, and interview psychologists building the prompts that power getHeired.</p>
        </div>
      </section>
      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {creators.map(c => {
            const count = prompts.filter(p => p.creatorId === c.id).length;
            return (
              <div key={c.id} className="rounded-3xl border border-border/70 bg-card p-6">
                <div className="flex items-center gap-4">
                  <div className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-base font-semibold text-white">{c.avatar}</div>
                  <div>
                    <div className="font-medium">{c.name} {c.verified && <span className="text-xs text-violet-600">✓</span>}</div>
                    <div className="text-xs text-muted-foreground">{c.handle}</div>
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">{c.bio}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{count} prompts</span><span>{(c.followers/1000).toFixed(1)}k followers</span>
                </div>
                <Button variant="outline" className="mt-5 w-full rounded-full">View profile</Button>
              </div>
            );
          })}
        </div>

        <div className="mt-16 rounded-3xl border border-border bg-gradient-to-br from-foreground to-zinc-800 p-10 text-background">
          <h2 className="font-display text-3xl tracking-tight sm:text-4xl">Become a creator.</h2>
          <p className="mt-2 max-w-xl text-background/80">Turn your expertise into prompts and toolkits. Keep 80% of every sale.</p>
          <Link to="/creator"><Button size="lg" variant="secondary" className="mt-5 rounded-full">Open creator dashboard</Button></Link>
        </div>
      </section>
    </SiteShell>
  );
}
