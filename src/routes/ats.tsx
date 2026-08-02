import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Target, CheckCircle2, XCircle, Lightbulb, AlertTriangle, MinusCircle, Copy, Download, RotateCcw, Eraser, Wrench } from "lucide-react";
import { toast } from "sonner";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { scoreATS } from "@/lib/career.functions";
import { downloadDocumentPdf } from "@/lib/document-pdf";
import { useToolGate, ToolCreditBar } from "@/components/usage-gate";
import { ToolHero, ToolOutro } from "@/components/tool-hero";


export const Route = createFileRoute("/ats")({
  head: () => ({
    meta: [
      { title: "Free ATS Resume Checker & Score — ApplyWise" },
      { name: "description", content: "Score your CV against any job description. See match percentage, matched and missing keywords, formatting checks, and concrete rewrite fixes." },
      { property: "og:title", content: "ATS Resume Checker & Score — ApplyWise" },
      { property: "og:description", content: "Check how your CV scores against a job description and fix what's missing." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/ats" },
    ],
    links: [{ rel: "canonical", href: "/ats" }],
  }),

  component: ATSPage,
});

type KeywordHit = { keyword: string; importance: "critical" | "important" | "nice-to-have"; inCV: boolean; frequency: number };
type FormattingCheck = { name: string; passed: boolean; detail: string };
type SubScore = { label: string; score: number; weight: number; note: string };
type SectionCov = { section: string; present: boolean; quality: "strong" | "adequate" | "weak" | "missing"; note: string };

type Report = {
  score: number; verdict: string;
  subScores: SubScore[];
  keywordCoverage: { matchedCount: number; totalCount: number; coveragePct: number; keywords: KeywordHit[] };
  formattingChecks: FormattingCheck[];
  sectionCoverage: SectionCov[];
  matchedKeywords: string[]; missingKeywords: string[];
  strengths: string[]; improvements: string[]; rewriteTips: string[];
};

export function ATSPage() {
  const run = useServerFn(scoreATS);
  const gate = useToolGate("ats");
  const [jd, setJd] = useState("");
  const [cv, setCv] = useState("");
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);

  async function onScore(event?: React.FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    if (!jd.trim()) {
      toast.error("Please paste the job description.");
      return;
    }
    if (!cv.trim()) {
      toast.error("Please paste your CV.");
      return;
    }
    const jdPayload = jd.trim().length < 20 ? jd.trim() + "\n\n(Short job description provided by user.)" : jd;
    const cvPayload = cv.trim().length < 20 ? cv.trim() + "\n\n(Brief CV provided by user.)" : cv;
    if (!(await gate.before())) return;
    setLoading(true); setReport(null);
    try {
      const r = await run({ data: { jobDescription: jdPayload, cv: cvPayload } });
      setReport(r as Report);
      toast.success("ATS analysis complete. 🎉");
      await gate.after();
    } catch (e) {
      console.error("ATS scoring error:", e);
      setReport(createLocalATSReport(jdPayload, cvPayload));
      const msg = e instanceof Error ? e.message : "Failed";
      toast.error(msg.includes("402") ? "AI credits exhausted. Showing an estimated ATS score." : msg.includes("429") ? "Rate limited. Showing an estimated ATS score." : "Showing an estimated ATS score.");
    } finally { setLoading(false); }
  }
  async function copyReport() {
    if (!report) return;
    try {
      await navigator.clipboard.writeText(reportToText(report));
      toast.success("Report copied as clean text");
    } catch {
      toast.error("Copy failed");
    }
  }

  function downloadReport() {
    if (!report) return;
    try {
      downloadDocumentPdf(reportToText(report), "ats-report.pdf");
      toast.success("PDF ready — check your downloads or the new tab");
    } catch {
      toast.error("Your browser blocked the download.");
    }
  }

  function clearAll() {
    setJd(""); setCv(""); setReport(null);
  }

  const scoreColor = (s: number) => s >= 80 ? "text-emerald-600 dark:text-emerald-400" : s >= 60 ? "text-amber-600 dark:text-amber-400" : "text-rose-600 dark:text-rose-400";

  const cvWords = cv.trim().split(/\s+/).filter(Boolean).length;
  const categories = report ? buildCategories(report, cvWords) : [];
  const otherScores = report ? (report.subScores ?? []).filter((s) => !/keyword|format|parse/i.test(s.label)) : [];
  const fixes = report ? buildFixes(report, cvWords) : [];



  return (
    <SiteShell>
      <ToolHero
        eyebrow="ATS Optimizer • see what the screener sees"
        title="Score your CV against the job before"
        titleEm="the screener does."
        sub="Applicant tracking systems rank you before anyone reads you. Paste your CV and the job description to get a match score, the exact keywords you're missing, formatting checks and the rewrites that move the number."
        bullets={["Match score out of 100", "Matched and missing keywords", "Formatting and section checks"]}
        icon={Target}
        steps={[
          { label: "Paste the job description", text: "The posting defines the keyword set the screener is scoring you against." },
          { label: "Paste your current CV", text: "Plain text is fine — that's roughly what the parser reads anyway." },
          { label: "Fix what the report flags", text: "Work through the missing keywords and rewrite suggestions, then re-score." },
        ]}
      />
      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">

        <form onSubmit={onScore} className="relative overflow-hidden rounded-3xl border border-border/70 bg-[#0b1230] p-5 text-white shadow-[0_30px_80px_-40px_rgba(15,23,64,0.9)] sm:p-8">
          <div className="pointer-events-none absolute inset-0 opacity-70" style={{ background: "radial-gradient(600px 220px at 12% 0%, rgba(79,70,229,0.35), transparent 70%), radial-gradient(500px 220px at 92% 100%, rgba(34,211,238,0.18), transparent 70%)" }} />
          <div className="relative">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/60">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                Scanner input
              </div>
              <div className="text-[11px] text-white/50 tabular-nums">{jd.trim().split(/\s+/).filter(Boolean).length} JD words · {cv.trim().split(/\s+/).filter(Boolean).length} CV words</div>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur">
                <label htmlFor="ats-job-description" className="flex items-center justify-between text-xs font-medium text-white/80">
                  <span>Job description</span>
                  <span className="rounded-full border border-white/15 px-2 py-0.5 text-[10px] uppercase tracking-wider text-white/50">target</span>
                </label>
                <Textarea id="ats-job-description" name="jobDescription" value={jd} onChange={(e) => setJd(e.target.value)} placeholder="Paste the job posting…" className="mt-3 min-h-[210px] resize-none border-0 bg-transparent p-0 text-sm text-white placeholder:text-white/30 focus-visible:ring-0" />
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur">
                <label htmlFor="ats-cv" className="flex items-center justify-between text-xs font-medium text-white/80">
                  <span>Your CV</span>
                  <span className="rounded-full border border-white/15 px-2 py-0.5 text-[10px] uppercase tracking-wider text-white/50">candidate</span>
                </label>
                <Textarea id="ats-cv" name="cv" value={cv} onChange={(e) => setCv(e.target.value)} placeholder="Paste your current CV here…" className="mt-3 min-h-[210px] resize-none border-0 bg-transparent p-0 text-sm text-white placeholder:text-white/30 focus-visible:ring-0" />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Button type="submit" disabled={loading} size="lg" className="rounded-full bg-white text-[#0b1230] hover:bg-white/90">
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Scanning…</> : report ? <><RotateCcw className="h-4 w-4" /> Re-score my CV</> : "Run the scan"}
              </Button>
              {(jd || cv || report) && (
                <Button type="button" variant="ghost" size="lg" className="rounded-full text-white/70 hover:bg-white/10 hover:text-white" onClick={clearAll}>
                  <Eraser className="h-4 w-4" /> Clear
                </Button>
              )}
              <span className="text-xs text-white/45">Nothing is stored — the scan runs on the text you paste.</span>
            </div>
          </div>
        </form>

        <div className="mt-6">
          <ToolCreditBar tool="ats" />
        </div>


        {report && (
          <div className="mt-12 space-y-5">
            {/* Header row */}
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Scan result</div>
                <h2 className="mt-1 font-display text-[1.35rem] tracking-tight sm:text-[1.5rem]">Your score, broken down by category</h2>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={copyReport}>
                  <Copy className="h-4 w-4" /> Copy report
                </Button>
                <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={downloadReport}>
                  <Download className="h-4 w-4" /> Download PDF
                </Button>
              </div>
            </div>

            {/* Overall + category breakdown */}
            <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[0_1px_2px_0_rgba(15,23,64,0.06),0_12px_40px_-28px_rgba(15,23,64,0.35)]">
              <div className="grid gap-8 border-b border-border/60 p-6 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center sm:p-8">
                <div className="flex items-center gap-5">
                  <ScoreDial score={report.score} />
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Overall match</div>
                    <div className="mt-1 text-[13px] text-muted-foreground">
                      {report.score >= 80 ? "Likely to clear most screeners" : report.score >= 60 ? "Borderline — fixable today" : "Likely filtered out"}
                    </div>
                  </div>
                </div>
                <p className="max-w-xl text-[14px] leading-relaxed text-muted-foreground">{report.verdict}</p>
              </div>

              <div className="grid divide-y divide-border/60 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                {categories.map((c) => (
                  <div key={c.label} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{c.label}</div>
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] tracking-wide ${bandChip(c.score)}`}>{band(c.score)}</span>
                    </div>
                    <div className="mt-3 flex items-baseline gap-1">
                      <span className={`font-display text-[2rem] leading-none tabular-nums ${scoreColor(c.score)}`}>{c.score}</span>
                      <span className="text-[11px] text-muted-foreground">/100</span>
                    </div>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div className={`h-full transition-all ${barColor(c.score)}`} style={{ width: `${c.score}%` }} />
                    </div>
                    <p className="mt-3 text-[12px] leading-relaxed text-muted-foreground">{c.note}</p>
                    <div className="mt-2 text-[11px] text-muted-foreground/70">{c.meta}</div>
                  </div>
                ))}
              </div>

              {otherScores.length > 0 && (
                <div className="grid gap-x-8 gap-y-3 border-t border-border/60 bg-background/40 p-6 sm:grid-cols-2">
                  {otherScores.map((s) => (
                    <div key={s.label} className="flex items-center gap-3">
                      <div className="w-40 shrink-0 text-[12px] text-muted-foreground">{s.label}</div>
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                        <div className={`h-full ${barColor(s.score)}`} style={{ width: `${s.score}%` }} />
                      </div>
                      <div className="w-14 shrink-0 text-right text-[12px] tabular-nums">{s.score}<span className="text-muted-foreground">/100</span></div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Fix recommendations */}
            {fixes.length > 0 && (
              <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[0_1px_2px_0_rgba(15,23,64,0.06)]">
                <div className="flex items-center justify-between border-b border-border/60 px-6 py-4">
                  <div className="flex items-center gap-2 text-[13px]">
                    <Wrench className="h-4 w-4 text-primary" /> Recommended fixes
                  </div>
                  <span className="text-[11px] text-muted-foreground">{fixes.length} action{fixes.length === 1 ? "" : "s"} · highest impact first</span>
                </div>
                <ol className="divide-y divide-border/60">
                  {fixes.map((f, i) => (
                    <li key={`${f.title}-${i}`} className="flex gap-4 px-6 py-4">
                      <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-border/70 text-[11px] tabular-nums text-muted-foreground">{i + 1}</span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[13px]">{f.title}</span>
                          <span className="rounded-full border border-border/60 bg-background/60 px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">{f.area}</span>
                          <span className={`rounded-full border px-2 py-0.5 text-[10px] tracking-wide ${f.impact === "high" ? "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-300" : f.impact === "medium" ? "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-300" : "border-border/60 text-muted-foreground"}`}>{f.impact} impact</span>
                        </div>
                        <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">{f.detail}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Keyword coverage */}
            {report.keywordCoverage && (
              <Panel title={`Keyword coverage · ${report.keywordCoverage.matchedCount}/${report.keywordCoverage.totalCount} (${report.keywordCoverage.coveragePct}%)`} icon={<Target className="h-4 w-4 text-primary" />}>
                <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-primary" style={{ width: `${report.keywordCoverage.coveragePct}%` }} />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-[13px]">
                    <thead className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                      <tr className="border-b border-border/60"><th className="py-2 text-left font-normal">Keyword</th><th className="py-2 text-left font-normal">Importance</th><th className="py-2 text-left font-normal">In CV</th><th className="py-2 text-right font-normal">Frequency</th></tr>
                    </thead>
                    <tbody>
                      {report.keywordCoverage.keywords.map((k) => (
                        <tr key={k.keyword} className="border-b border-border/40">
                          <td className="py-2">{k.keyword}</td>
                          <td className="py-2"><span className={`rounded-full px-2 py-0.5 text-[11px] ${k.importance === "critical" ? "bg-rose-500/10 text-rose-700 dark:text-rose-300" : k.importance === "important" ? "bg-amber-500/10 text-amber-700 dark:text-amber-300" : "bg-muted text-muted-foreground"}`}>{k.importance}</span></td>
                          <td className="py-2">{k.inCV ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <XCircle className="h-4 w-4 text-rose-500" />}</td>
                          <td className="py-2 text-right tabular-nums text-muted-foreground">{k.frequency}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Panel>
            )}

            {/* Formatting */}
            {report.formattingChecks?.length > 0 && (
              <Panel title="Formatting & parseability checks" icon={<CheckCircle2 className="h-4 w-4 text-emerald-500" />}>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {report.formattingChecks.map((c) => (
                    <li key={c.name} className="flex items-start gap-2 rounded-xl border border-border/50 bg-background/40 p-3">
                      {c.passed ? <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-emerald-500" /> : <AlertTriangle className="mt-0.5 h-4 w-4 flex-none text-amber-500" />}
                      <div>
                        <div className="text-[13px]">{c.name}</div>
                        <div className="text-[12px] text-muted-foreground">{c.detail}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </Panel>
            )}

            {/* Sections */}
            {report.sectionCoverage?.length > 0 && (
              <Panel title="Section coverage" icon={<Target className="h-4 w-4 text-primary" />}>
                <div className="grid gap-2 sm:grid-cols-2">
                  {report.sectionCoverage.map((s) => {
                    const q = s.quality;
                    const color = q === "strong" ? "text-emerald-600 dark:text-emerald-400" : q === "adequate" ? "text-amber-600 dark:text-amber-400" : q === "weak" ? "text-rose-600 dark:text-rose-400" : "text-muted-foreground";
                    const Icon = q === "missing" ? MinusCircle : q === "strong" ? CheckCircle2 : q === "adequate" ? AlertTriangle : XCircle;
                    return (
                      <div key={s.section} className="flex items-start gap-2 rounded-xl border border-border/50 bg-background/40 p-3">
                        <Icon className={`mt-0.5 h-4 w-4 flex-none ${color}`} />
                        <div>
                          <div className="text-[13px]">{s.section} <span className={`ml-1 text-[11px] ${color}`}>· {q}</span></div>
                          <div className="text-[12px] text-muted-foreground">{s.note}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Panel>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <Panel title="Matched keywords" icon={<CheckCircle2 className="h-4 w-4 text-emerald-500" />}>
                <div className="flex flex-wrap gap-1.5">
                  {report.matchedKeywords.map((k) => <span key={k} className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] text-emerald-700 dark:text-emerald-300">{k}</span>)}
                </div>
              </Panel>
              <Panel title="Missing keywords" icon={<XCircle className="h-4 w-4 text-rose-500" />}>
                <div className="flex flex-wrap gap-1.5">
                  {report.missingKeywords.map((k) => <span key={k} className="rounded-full bg-rose-500/10 px-2.5 py-1 text-[11px] text-rose-700 dark:text-rose-300">{k}</span>)}
                </div>
              </Panel>
              <Panel title="Strengths" icon={<CheckCircle2 className="h-4 w-4 text-emerald-500" />}>
                <ul className="space-y-2 text-[13px] text-muted-foreground">{report.strengths.map((s, i) => <li key={i}>• {s}</li>)}</ul>
              </Panel>
              <Panel title="Improvements" icon={<Lightbulb className="h-4 w-4 text-amber-500" />}>
                <ul className="space-y-2 text-[13px] text-muted-foreground">{report.improvements.map((s, i) => <li key={i}>• {s}</li>)}</ul>
              </Panel>
            </div>

            <Panel title="Concrete rewrite tips" icon={<Lightbulb className="h-4 w-4 text-amber-500" />}>
              <ul className="space-y-2 text-[13px] text-muted-foreground">{report.rewriteTips.map((s, i) => <li key={i}>{i + 1}. {s}</li>)}</ul>
            </Panel>
          </div>
        )}
      </section>
      <ToolOutro
        title="Low score? Don't edit line by line — rebuild it."
        text="When too many keywords are missing, rewriting by hand takes hours. Regenerate the CV against this exact posting, then come back and score it again to confirm the jump."
        primaryLabel="Rebuild my CV for this job"
        primaryHref="/cv"
        secondaryLabel="Browse ATS prompts"
        secondaryHref="/marketplace"
      />
      {gate.gates}
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

function createLocalATSReport(jobDescription: string, cv: string): Report {
  const jobTerms = extractKeywords(jobDescription);
  const cvLower = cv.toLowerCase();
  const keywords = jobTerms.slice(0, 18).map((keyword, index) => {
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const matches = cvLower.match(new RegExp(`\\b${escaped}\\b`, "g"));
    return {
      keyword,
      importance: index < 6 ? "critical" as const : index < 12 ? "important" as const : "nice-to-have" as const,
      inCV: Boolean(matches?.length),
      frequency: matches?.length ?? 0,
    };
  });
  const matchedKeywords = keywords.filter((k) => k.inCV).map((k) => k.keyword);
  const missingKeywords = keywords.filter((k) => !k.inCV).map((k) => k.keyword);
  const coveragePct = keywords.length ? Math.round((matchedKeywords.length / keywords.length) * 100) : 0;
  const formattingChecks: FormattingCheck[] = [
    { name: "Contact info", passed: /@|linkedin|phone|\+\d|\b\d{3}[-.\s]?\d{3}/i.test(cv), detail: "ATS files should include reachable contact details near the top." },
    { name: "Standard headings", passed: /(experience|skills|education|summary|profile)/i.test(cv), detail: "Use familiar headings like Summary, Skills, Experience and Education." },
    { name: "Bullet-friendly structure", passed: /(^|\n)\s*[-•*]/.test(cv), detail: "Bullets help ATS parsers and recruiters scan responsibilities and achievements." },
    { name: "Quantified impact", passed: /\d+%|\$\d+|\b\d+\+?\b/.test(cv), detail: "Numbers make achievements clearer and improve impact scoring." },
    { name: "Plain text parseability", passed: !/[│┌┐└┘]/.test(cv), detail: "Avoid tables, images, columns and decorative layout elements." },
  ];
  const keywordScore = coveragePct;
  const skillsScore = Math.min(100, coveragePct + (matchedKeywords.length >= 8 ? 10 : 0));
  const experienceScore = /(led|managed|built|owned|launched|delivered|improved|increased|reduced|created)/i.test(cv) ? Math.min(100, coveragePct + 15) : Math.max(35, coveragePct - 10);
  const formattingScore = Math.round((formattingChecks.filter((c) => c.passed).length / formattingChecks.length) * 100);
  const impactScore = /\d+%|\$\d+|\b\d+\+?\b/.test(cv) ? 78 : 45;
  const subScores: SubScore[] = [
    { label: "Keyword Match", score: keywordScore, weight: 35, note: `${matchedKeywords.length} of ${keywords.length} priority terms found.` },
    { label: "Skills Alignment", score: skillsScore, weight: 25, note: "Based on overlap between required skills and CV wording." },
    { label: "Experience Relevance", score: experienceScore, weight: 20, note: "Checks whether your achievements mirror the role needs." },
    { label: "Formatting/Parseability", score: formattingScore, weight: 10, note: `${formattingChecks.filter((c) => c.passed).length}/${formattingChecks.length} formatting checks passed.` },
    { label: "Impact & Metrics", score: impactScore, weight: 10, note: "Looks for quantified outcomes and action-led achievements." },
  ];
  const score = Math.round(subScores.reduce((sum, item) => sum + item.score * (item.weight / 100), 0));
  return {
    score,
    verdict: score >= 80 ? "Strong ATS match. Fine-tune missing keywords and keep the formatting simple." : score >= 60 ? "Moderate ATS match. Add missing job-specific terms and sharpen quantified achievements." : "Low ATS match. Rework the CV around the role's core skills, responsibilities and required keywords.",
    subScores,
    keywordCoverage: { matchedCount: matchedKeywords.length, totalCount: keywords.length, coveragePct, keywords },
    formattingChecks,
    sectionCoverage: [
      sectionStatus("Summary", cv, /(summary|profile|objective)/i),
      sectionStatus("Skills", cv, /skills/i),
      sectionStatus("Experience", cv, /(experience|employment|work history)/i),
      sectionStatus("Education", cv, /education/i),
      sectionStatus("Certifications", cv, /(certification|certificate|licen[cs]e)/i),
    ],
    matchedKeywords,
    missingKeywords,
    strengths: matchedKeywords.length ? [`Matches priority terms like ${matchedKeywords.slice(0, 4).join(", ")}.`, "Readable text structure for initial ATS parsing."] : ["CV text was received and can be evaluated against the role."],
    improvements: missingKeywords.length ? [`Add missing role keywords: ${missingKeywords.slice(0, 6).join(", ")}.`, "Mirror the job title, tools and responsibilities using truthful experience bullets."] : ["Keep keyword usage natural and avoid stuffing repeated terms."],
    rewriteTips: [
      "Rewrite the summary to include the target role title and the top 3 required skills.",
      "Add 3-5 bullets that combine action verb + relevant keyword + measurable outcome.",
      "Create a skills section that uses the exact terminology from the job description where accurate.",
    ],
  };
}

function extractKeywords(text: string) {
  const stop = new Set(["the", "and", "for", "with", "you", "your", "our", "are", "this", "that", "will", "from", "have", "has", "into", "role", "team", "work", "job", "description", "candidate", "experience", "years", "about"]);
  const counts = new Map<string, number>();
  const words = text.toLowerCase().match(/[a-z][a-z+#-]{2,}/g) ?? [];
  for (const word of words) {
    if (stop.has(word)) continue;
    counts.set(word, (counts.get(word) ?? 0) + 1);
  }
  return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).map(([word]) => word);
}

function sectionStatus(section: string, cv: string, pattern: RegExp): SectionCov {
  const present = pattern.test(cv);
  return { section, present, quality: present ? "adequate" : "missing", note: present ? `${section} section appears present.` : `Add a clear ${section} section if relevant.` };
}

function reportToText(r: Report) {
  const lines: string[] = [];
  lines.push("# ATS Match Report", "", `## Overall score: ${r.score}/100`, r.verdict, "");
  if (r.subScores?.length) {
    lines.push("## Score breakdown");
    for (const s of r.subScores) lines.push(`- ${s.label}: ${s.score}/100 (weight ${s.weight}%) — ${s.note}`);
    lines.push("");
  }
  if (r.keywordCoverage) {
    lines.push(`## Keyword coverage: ${r.keywordCoverage.matchedCount}/${r.keywordCoverage.totalCount} (${r.keywordCoverage.coveragePct}%)`);
    for (const k of r.keywordCoverage.keywords) lines.push(`- ${k.keyword} — ${k.importance} — ${k.inCV ? `in CV (${k.frequency}x)` : "missing"}`);
    lines.push("");
  }
  if (r.formattingChecks?.length) {
    lines.push("## Formatting & parseability");
    for (const c of r.formattingChecks) lines.push(`- ${c.passed ? "PASS" : "FIX"}: ${c.name} — ${c.detail}`);
    lines.push("");
  }
  if (r.sectionCoverage?.length) {
    lines.push("## Section coverage");
    for (const s of r.sectionCoverage) lines.push(`- ${s.section}: ${s.quality} — ${s.note}`);
    lines.push("");
  }
  if (r.matchedKeywords?.length) lines.push("## Matched keywords", r.matchedKeywords.join(", "), "");
  if (r.missingKeywords?.length) lines.push("## Missing keywords", r.missingKeywords.join(", "), "");
  if (r.strengths?.length) { lines.push("## Strengths"); for (const s of r.strengths) lines.push(`- ${s}`); lines.push(""); }
  if (r.improvements?.length) { lines.push("## Improvements"); for (const s of r.improvements) lines.push(`- ${s}`); lines.push(""); }
  if (r.rewriteTips?.length) { lines.push("## Rewrite tips"); r.rewriteTips.forEach((s, i) => lines.push(`${i + 1}. ${s}`)); }
  return lines.join("\n");
}
