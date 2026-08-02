import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Target, CheckCircle2, XCircle, Lightbulb, AlertTriangle, MinusCircle, Copy, Download, RotateCcw, Eraser } from "lucide-react";
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


  return (
    <SiteShell>
      <ToolHero
        eyebrow="ATS Optimizer • see what the screener sees"
        title="Find out why your CV never"
        titleEm="reaches a human."
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

        <form onSubmit={onScore} className="mt-8 space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <label htmlFor="ats-job-description" className="text-sm font-medium">Job description</label>
              <Textarea id="ats-job-description" name="jobDescription" value={jd} onChange={(e) => setJd(e.target.value)} placeholder="Paste the job posting…" className="mt-2 min-h-[200px]" />
            </div>
            <div>
              <label htmlFor="ats-cv" className="text-sm font-medium">Your CV</label>
              <Textarea id="ats-cv" name="cv" value={cv} onChange={(e) => setCv(e.target.value)} placeholder="Paste your current CV here…" className="mt-2 min-h-[200px]" />
            </div>
          </div>
          <ToolCreditBar tool="ats" />
          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" disabled={loading} size="lg" className="rounded-full">
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing…</> : report ? <><RotateCcw className="h-4 w-4" /> Re-score my CV</> : "Score my CV"}
            </Button>
            {(jd || cv || report) && (
              <Button type="button" variant="ghost" size="lg" className="rounded-full" onClick={clearAll}>
                <Eraser className="h-4 w-4" /> Clear
              </Button>
            )}
          </div>
        </form>

        {report && (
          <div className="mt-10 space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={copyReport}>
                <Copy className="h-4 w-4" /> Copy report
              </Button>
              <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={downloadReport}>
                <Download className="h-4 w-4" /> Download PDF
              </Button>
            </div>

            {/* Overall */}
            <div className="rounded-3xl border border-border/70 bg-card p-8">
              <div className="flex flex-wrap items-end gap-6">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">ATS Match Score</div>
                  <div className={`font-display text-7xl leading-none ${scoreColor(report.score)}`}>{report.score}</div>
                  <div className="text-xs text-muted-foreground">/ 100</div>
                </div>
                <div className="flex-1 min-w-[240px]">
                  <p className="text-base">{report.verdict}</p>
                  <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-muted">
                    <div className={`h-full transition-all ${report.score >= 80 ? "bg-emerald-500" : report.score >= 60 ? "bg-amber-500" : "bg-rose-500"}`} style={{ width: `${report.score}%` }} />
                  </div>
                </div>
              </div>

              {/* Sub-scores */}
              {report.subScores?.length > 0 && (
                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {report.subScores.map((s) => (
                    <div key={s.label} className="rounded-2xl border border-border/60 bg-background/60 p-4">
                      <div className="flex items-baseline justify-between">
                        <div className="text-sm font-medium">{s.label}</div>
                        <div className={`text-lg font-semibold ${scoreColor(s.score)}`}>{s.score}<span className="text-xs text-muted-foreground">/100</span></div>
                      </div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                        <div className={`h-full ${s.score >= 80 ? "bg-emerald-500" : s.score >= 60 ? "bg-amber-500" : "bg-rose-500"}`} style={{ width: `${s.score}%` }} />
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">Weight {s.weight}% · {s.note}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Keyword coverage */}
            {report.keywordCoverage && (
              <Panel title={`Keyword coverage · ${report.keywordCoverage.matchedCount}/${report.keywordCoverage.totalCount} (${report.keywordCoverage.coveragePct}%)`} icon={<Target className="h-4 w-4 text-foreground" />}>
                <div className="mb-4 h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-foreground" style={{ width: `${report.keywordCoverage.coveragePct}%` }} />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-xs uppercase tracking-wider text-muted-foreground">
                      <tr className="border-b border-border/60"><th className="py-2 text-left font-medium">Keyword</th><th className="py-2 text-left font-medium">Importance</th><th className="py-2 text-left font-medium">In CV</th><th className="py-2 text-right font-medium">Frequency</th></tr>
                    </thead>
                    <tbody>
                      {report.keywordCoverage.keywords.map((k) => (
                        <tr key={k.keyword} className="border-b border-border/30">
                          <td className="py-2 font-medium">{k.keyword}</td>
                          <td className="py-2"><span className={`rounded-full px-2 py-0.5 text-xs ${k.importance === "critical" ? "bg-rose-500/10 text-rose-700 dark:text-rose-300" : k.importance === "important" ? "bg-amber-500/10 text-amber-700 dark:text-amber-300" : "bg-muted text-muted-foreground"}`}>{k.importance}</span></td>
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
                    <li key={c.name} className="flex items-start gap-2 rounded-lg border border-border/50 bg-background/40 p-3">
                      {c.passed ? <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-emerald-500" /> : <AlertTriangle className="mt-0.5 h-4 w-4 flex-none text-amber-500" />}
                      <div>
                        <div className="text-sm font-medium">{c.name}</div>
                        <div className="text-xs text-muted-foreground">{c.detail}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </Panel>
            )}

            {/* Sections */}
            {report.sectionCoverage?.length > 0 && (
              <Panel title="Section coverage" icon={<Target className="h-4 w-4 text-foreground" />}>
                <div className="grid gap-2 sm:grid-cols-2">
                  {report.sectionCoverage.map((s) => {
                    const q = s.quality;
                    const color = q === "strong" ? "text-emerald-600 dark:text-emerald-400" : q === "adequate" ? "text-amber-600 dark:text-amber-400" : q === "weak" ? "text-rose-600 dark:text-rose-400" : "text-muted-foreground";
                    const Icon = q === "missing" ? MinusCircle : q === "strong" ? CheckCircle2 : q === "adequate" ? AlertTriangle : XCircle;
                    return (
                      <div key={s.section} className="flex items-start gap-2 rounded-lg border border-border/50 bg-background/40 p-3">
                        <Icon className={`mt-0.5 h-4 w-4 flex-none ${color}`} />
                        <div>
                          <div className="text-sm font-medium">{s.section} <span className={`ml-1 text-xs ${color}`}>· {q}</span></div>
                          <div className="text-xs text-muted-foreground">{s.note}</div>
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
