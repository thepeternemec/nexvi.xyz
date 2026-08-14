import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { listSeoRuns, triggerSeoRun } from "@/lib/seo-monitor.functions";
import type { CheckResult } from "@/lib/seo-monitor.server";

export const Route = createFileRoute("/seo-monitor")({
  head: () => ({
    meta: [
      { title: "SEO Monitor — ApplyWise" },
      { name: "description", content: "Automated technical SEO health checks for ApplyWise: robots.txt, sitemap, canonical tags, hreflang and structured data." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "SEO Monitor — ApplyWise" },
      { property: "og:description", content: "Automated technical SEO health checks running on every deploy." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: SeoMonitorPage,
});

const statusStyles: Record<string, string> = {
  pass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  warn: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  fail: "bg-red-500/10 text-red-600 dark:text-red-400",
};

function StatusPill({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[status] ?? ""}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${status === "pass" ? "bg-emerald-500" : status === "warn" ? "bg-amber-500" : "bg-red-500"}`} />
      {status === "pass" ? "Healthy" : status === "warn" ? "Warnings" : "Failing"}
    </span>
  );
}

function SeoMonitorPage() {
  const fetchRuns = useServerFn(listSeoRuns);
  const runNow = useServerFn(triggerSeoRun);
  const queryClient = useQueryClient();
  const [expanded, setExpanded] = useState<string | null>(null);

  const { data: runs, isLoading, error } = useQuery({
    queryKey: ["seo-runs"],
    queryFn: () => fetchRuns(),
    refetchOnWindowFocus: false,
  });

  const mutation = useMutation({
    mutationFn: () => runNow(),
    onSuccess: (run) => {
      toast.success(
        run.failed > 0
          ? `${run.failed} check${run.failed === 1 ? "" : "s"} failing${run.alerted ? " — alert email sent" : ""}`
          : `All ${run.passed} checks passing`,
      );
      void queryClient.invalidateQueries({ queryKey: ["seo-runs"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Check run failed"),
  });

  const latest = runs?.[0];

  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-semibold tracking-tight">SEO monitor</h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Automated checks for robots.txt, sitemap.xml, canonical tags, hreflang alternates and JSON-LD schema. Runs
              after every deploy and on a schedule; you get an email at info@applywise.eu when something breaks.
            </p>
          </div>
          <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
            {mutation.isPending ? "Running checks…" : "Run checks now"}
          </Button>
        </div>

        {error ? (
          <p className="mt-10 rounded-xl border border-border/70 bg-card p-4 text-sm text-muted-foreground">
            Sign in to view the monitoring history.
          </p>
        ) : isLoading ? (
          <p className="mt-10 text-sm text-muted-foreground">Loading history…</p>
        ) : !runs?.length ? (
          <p className="mt-10 rounded-xl border border-border/70 bg-card p-4 text-sm text-muted-foreground">
            No checks recorded yet — hit “Run checks now” to create the first baseline.
          </p>
        ) : (
          <>
            {latest ? (
              <div className="mt-10 rounded-2xl border border-border/70 bg-card p-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="text-sm font-medium">Latest run</div>
                  <StatusPill status={latest.status} />
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                  {[
                    { label: "Passing", value: latest.passed },
                    { label: "Warnings", value: latest.warned },
                    { label: "Failing", value: latest.failed },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl border border-border/60 py-3">
                      <div className="font-display text-2xl font-semibold">{s.value}</div>
                      <div className="text-xs text-muted-foreground">{s.label}</div>
                    </div>
                  ))}
                </div>
                <ul className="mt-5 divide-y divide-border/70">
                  {(latest.checks as CheckResult[])
                    .filter((c) => c.status !== "pass")
                    .map((c) => (
                      <li key={c.id} className="flex flex-wrap items-start justify-between gap-2 py-2.5">
                        <div className="text-sm font-medium">{c.label}</div>
                        <div className="max-w-md text-right font-mono text-xs text-muted-foreground">{c.detail}</div>
                      </li>
                    ))}
                  {latest.failed === 0 && latest.warned === 0 ? (
                    <li className="py-2.5 text-sm text-muted-foreground">Every check passed on this run.</li>
                  ) : null}
                </ul>
              </div>
            ) : null}

            <h2 className="mt-12 text-sm font-semibold uppercase tracking-wide text-muted-foreground">History</h2>
            <ul className="mt-3 divide-y divide-border overflow-hidden rounded-2xl border border-border/70 bg-card">
              {runs.map((run) => (
                <li key={run.id}>
                  <button
                    type="button"
                    onClick={() => setExpanded(expanded === run.id ? null : run.id)}
                    className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left hover:bg-muted/40"
                  >
                    <div>
                      <div className="text-sm font-medium">{new Date(run.created_at).toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">
                        {run.trigger_source} · {run.passed} pass · {run.warned} warn · {run.failed} fail
                      </div>
                    </div>
                    <StatusPill status={run.status} />
                  </button>
                  {expanded === run.id ? (
                    <ul className="divide-y divide-border/60 border-t border-border/60 bg-muted/20 px-4">
                      {(run.checks as CheckResult[]).map((c) => (
                        <li key={c.id} className="flex flex-wrap items-start justify-between gap-2 py-2 text-xs">
                          <span className="font-medium">
                            {c.status === "pass" ? "✓" : c.status === "warn" ? "!" : "✗"} {c.label}
                          </span>
                          <span className="max-w-md text-right font-mono text-muted-foreground">{c.detail}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </SiteShell>
  );
}
