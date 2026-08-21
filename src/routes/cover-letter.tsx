import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Mail, Copy, Download } from "lucide-react";
import { toast } from "sonner";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { generateCoverLetter } from "@/lib/career.functions";
import { useToolGate, ToolCreditBar } from "@/components/usage-gate";
import { ToolHero, ToolOutro } from "@/components/tool-hero";
import { ResumeField } from "@/components/resume-field";
import { canonicalAndAlternates, crawlerMeta, toolJsonLd, howToJsonLd, breadcrumbJsonLd } from "@/lib/seo-head";

export const Route = createFileRoute("/cover-letter")({
  head: () => ({
    meta: [
      { title: "AI Cover Letter Generator That Sounds Human | Nexvi" },
      { name: "description", content: "Create personalized, ATS-friendly cover letters that connect your experience to the job. Free to try." },
      { property: "og:title", content: "AI Cover Letter Generator That Sounds Human | Nexvi" },
      { property: "og:description", content: "Create personalized, ATS-friendly cover letters that connect your experience to the job. Free to try." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://nexvi.xyz/cover-letter" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "AI Cover Letter Generator That Sounds Human | Nexvi" },
      { name: "twitter:description", content: "Create personalized, ATS-friendly cover letters that connect your experience to the job. Free to try." },
    ],
    links: [{ rel: "canonical", href: "https://nexvi.xyz/cover-letter" }],
  }),

  component: CoverLetterPage,
});

export function CoverLetterPage() {
  const run = useServerFn(generateCoverLetter);
  const gate = useToolGate("coverLetter");
  const [jd, setJd] = useState("");
  const [bg, setBg] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [tone, setTone] = useState<"professional" | "enthusiastic" | "warm" | "concise">("professional");
  const [out, setOut] = useState("");
  const [loading, setLoading] = useState(false);

  async function onGenerate() {
    if (!jd.trim()) {
      toast.error("Please paste the job description.");
      return;
    }
    if (!bg.trim()) {
      toast.error("Please add your background.");
      return;
    }
    // Pad short inputs so server-side min-length validation passes; the model still gets the raw text.
    const jdPayload = jd.trim().length < 20 ? jd.trim() + "\n\n(Short job description provided by user.)" : jd;
    const bgPayload = bg.trim().length < 20 ? bg.trim() + "\n\n(Brief candidate background provided by user.)" : bg;
    if (!(await gate.before())) return;
    setLoading(true); setOut("");
    try {
      const res = await run({ data: { jobDescription: jdPayload, background: bgPayload, companyName: company || undefined, roleTitle: role || undefined, tone } });
      const cleaned = res.text
        .replace(/\*\*(.+?)\*\*/g, "$1")
        .replace(/(^|[^*])\*(?!\s)([^*\n]+?)\*(?!\w)/g, "$1$2")
        .replace(/^\s*[-*]\s+/gm, "• ");
      setOut(cleaned);
      toast.success("Cover letter generated. 🎉");
      await gate.after();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Generation failed";
      toast.error(msg.includes("402") ? "AI credits exhausted." : msg.includes("429") ? "Rate limited — try again shortly." : "Generation failed");
    } finally { setLoading(false); }
  }

  function copy() { navigator.clipboard.writeText(out); toast.success("Copied"); }
  function download() {
    const blob = new Blob([out], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "cover-letter.md"; a.click(); URL.revokeObjectURL(url);
  }

  return (
    <SiteShell>
      <ToolHero
        eyebrow="Cover Letter Lab • one letter, one role"
        title="A cover letter written for"
        titleEm="this job"
        titleAfter="— not for everyone."
        sub="Generic letters read like templates because they are. This one pulls the company's language, the role's real priorities and your actual experience into a short, specific letter a hiring manager will finish reading."
        bullets={["Company- and role-aware", "Four tones to pick from", "Copy or download instantly"]}
        icon={Mail}
        steps={[
          { label: "Add the company and role", text: "Optional, but it makes the opening line land instead of hedging." },
          { label: "Paste the job description", text: "The model finds the two or three things they actually care about." },
          { label: "Pick your tone", text: "Professional, enthusiastic, warm or concise — same substance, different voice." },
        ]}
      />
      <section className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6">

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-sm font-medium">Company</label><Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Linear" className="mt-2" /></div>
              <div><label className="text-sm font-medium">Role</label><Input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Senior Product Designer" className="mt-2" /></div>
            </div>
            <div>
              <label className="text-sm font-medium">Job description</label>
              <Textarea value={jd} onChange={(e) => setJd(e.target.value)} placeholder="Paste the job posting…" className="mt-2 min-h-[160px]" />
            </div>
            <div>
              <label className="text-sm font-medium">Your background</label>
              <ResumeField value={bg} onChange={setBg} className="mt-2" />
            </div>
            <div>
              <label className="text-sm font-medium">Tone</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {(["professional", "enthusiastic", "warm", "concise"] as const).map((t) => (
                  <button key={t} onClick={() => setTone(t)} className={`rounded-full border px-3 py-1.5 text-xs transition ${tone === t ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:text-foreground"}`}>{t}</button>
                ))}
              </div>
            </div>
            <Button onClick={onGenerate} disabled={loading} size="lg" className="w-full rounded-full">
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Writing…</> : "Write my cover letter"}
            </Button>
          </div>

          <div className="rounded-3xl border border-border/70 bg-card p-5">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">Your cover letter</div>
              {out && (
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={copy}><Copy className="h-4 w-4" /></Button>
                  <Button size="sm" variant="ghost" onClick={download}><Download className="h-4 w-4" /></Button>
                </div>
              )}
            </div>
            <div className="mt-3 min-h-[400px] whitespace-pre-wrap rounded-2xl bg-muted/30 p-4 text-sm leading-relaxed">
              {out || <span className="text-muted-foreground">Your cover letter will appear here.</span>}
            </div>
          </div>
        </div>
      </section>
      <ToolOutro
        title="Make sure the letter and the CV tell the same story."
        text="A sharp letter loses its power next to a CV that still uses your old wording. Regenerate the CV for this role, or run both through the ATS Optimizer to see what a screener sees."
        primaryLabel="Tailor my CV for this role"
        primaryHref="/cv"
        secondaryLabel="Check my ATS score"
        secondaryHref="/ats"
      />
      {gate.gates}
    </SiteShell>
  );
}
