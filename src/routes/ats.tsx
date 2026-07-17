import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Target, CheckCircle2, XCircle, Lightbulb } from "lucide-react";
import { toast } from "sonner";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { scoreATS } from "@/lib/career.functions";

export const Route = createFileRoute("/ats")({
  head: () => ({
    meta: [
      { title: "ATS Optimizer & Score Checker — getHeired" },
      { name: "description", content: "Score your CV against any job description. See matched and missing keywords, plus concrete rewrite suggestions." },
    ],
  }),
  component: ATSPage,
});

type Report = {
  score: number; verdict: string;
  matchedKeywords: string[]; missingKeywords: string[];
  strengths: string[]; improvements: string[]; rewriteTips: string[];
};

export function ATSPage() {
  const run = useServerFn(scoreATS);
  const [jd, setJd] = useState("");
  const [cv, setCv] = useState("");
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);

  async function onScore() {
    if (jd.trim().length < 20 || cv.trim().length < 20) {
      toast.error("Add a job description and a CV.");
      return;
    }
    setLoading(true); setReport(null);
    try {
      const r = await run({ data: { jobDescription: jd, cv } });
      setReport(r as Report);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed";
      toast.error(msg.includes("402") ? "AI credits exhausted." : "Scoring failed");
    } finally { setLoading(false); }
  }



  const scoreColor = (s: number) => s >= 80 ? "text-emerald-600 dark:text-emerald-400" : s >= 60 ? "text-amber-600 dark:text-amber-400" : "text-rose-600 dark:text-rose-400";

  return (
    <SiteShell>
      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-foreground text-background"><Target className="h-5 w-5" /></div>
          <div>
            <h1 className="font-display text-3xl tracking-tight sm:text-4xl">ATS Optimizer</h1>
            <p className="text-sm text-muted-foreground">See how your CV stacks up. Get specific, actionable fixes.</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Job description</label>
            <Textarea value={jd} onChange={(e) => setJd(e.target.value)} placeholder="Paste the job posting…" className="mt-2 min-h-[200px]" />
          </div>
          <div>
            <label className="text-sm font-medium">Your CV</label>
            <Textarea value={cv} onChange={(e) => setCv(e.target.value)} placeholder="Paste your current CV here…" className="mt-2 min-h-[200px]" />
          </div>
        </div>
        <Button onClick={onScore} disabled={loading} size="lg" className="mt-4 rounded-full">
          {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing…</> : "Score my CV"}
        </Button>

        {report && (
          <div className="mt-10 space-y-6">
            <div className="rounded-3xl border border-border/70 bg-card p-8">
              <div className="flex flex-wrap items-end gap-6">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">ATS Match Score</div>
                  <div className={`font-display text-7xl leading-none ${scoreColor(report.score)}`}>{report.score}</div>
                  <div className="text-xs text-muted-foreground">/ 100</div>
                </div>
                <div className="flex-1">
                  <p className="text-base">{report.verdict}</p>
                  <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full bg-foreground transition-all" style={{ width: `${report.score}%` }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Panel title="Matched keywords" icon={<CheckCircle2 className="h-4 w-4 text-emerald-500" />}>
                <div className="flex flex-wrap gap-1.5">
                  {report.matchedKeywords.map((k) => <span key={k} className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-700 dark:text-emerald-300">{k}</span>)}
                </div>
              </Panel>
              <Panel title="Missing keywords" icon={<XCircle className="h-4 w-4 text-rose-500" />}>
                <div className="flex flex-wrap gap-1.5">
                  {report.missingKeywords.map((k) => <span key={k} className="rounded-full bg-rose-500/10 px-2.5 py-1 text-xs text-rose-700 dark:text-rose-300">{k}</span>)}
                </div>
              </Panel>
              <Panel title="Strengths" icon={<CheckCircle2 className="h-4 w-4 text-emerald-500" />}>
                <ul className="space-y-2 text-sm">{report.strengths.map((s, i) => <li key={i}>• {s}</li>)}</ul>
              </Panel>
              <Panel title="Improvements" icon={<Lightbulb className="h-4 w-4 text-amber-500" />}>
                <ul className="space-y-2 text-sm">{report.improvements.map((s, i) => <li key={i}>• {s}</li>)}</ul>
              </Panel>
            </div>

            <Panel title="Concrete rewrite tips" icon={<Lightbulb className="h-4 w-4 text-amber-500" />}>
              <ul className="space-y-2 text-sm">{report.rewriteTips.map((s, i) => <li key={i}>{i + 1}. {s}</li>)}</ul>
            </Panel>
          </div>
        )}
      </section>
    </SiteShell>
  );
}

function Panel({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-border/70 bg-card p-6">
      <div className="flex items-center gap-2 text-sm font-semibold">{icon}{title}</div>
      <div className="mt-3">{children}</div>
    </div>
  );
}
