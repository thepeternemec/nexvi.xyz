import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Mail, Copy, Download } from "lucide-react";
import { toast } from "sonner";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { generateCoverLetter } from "@/lib/career.functions";

export const Route = createFileRoute("/cover-letter")({
  head: () => ({
    meta: [
      { title: "AI Cover Letter Generator — getHeired" },
      { name: "description", content: "Generate personalized cover letters tailored to any job in seconds." },
    ],
  }),
  component: CoverLetterPage,
});

function CoverLetterPage() {
  const ready = useRequireAuth();
  const run = useServerFn(generateCoverLetter);
  const [jd, setJd] = useState("");
  const [bg, setBg] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [tone, setTone] = useState<"professional" | "enthusiastic" | "warm" | "concise">("professional");
  const [out, setOut] = useState("");
  const [loading, setLoading] = useState(false);

  async function onGenerate() {
    if (jd.trim().length < 20 || bg.trim().length < 20) {
      toast.error("Add at least a short job description and background.");
      return;
    }
    setLoading(true); setOut("");
    try {
      const res = await run({ data: { jobDescription: jd, background: bg, companyName: company || undefined, roleTitle: role || undefined, tone } });
      setOut(res.text);
      toast.success("Cover letter generated.");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Generation failed";
      toast.error(msg.includes("402") ? "AI credits exhausted." : "Generation failed");
    } finally { setLoading(false); }
  }

  function copy() { navigator.clipboard.writeText(out); toast.success("Copied"); }
  function download() {
    const blob = new Blob([out], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "cover-letter.md"; a.click(); URL.revokeObjectURL(url);
  }

  if (!ready) return <SiteShell><div className="flex min-h-[50vh] items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div></SiteShell>;

  return (
    <SiteShell>
      <section className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-foreground text-background"><Mail className="h-5 w-5" /></div>
          <div>
            <h1 className="font-display text-3xl tracking-tight sm:text-4xl">Cover Letter Generator</h1>
            <p className="text-sm text-muted-foreground">Personalized, specific, never generic.</p>
          </div>
        </div>

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
              <Textarea value={bg} onChange={(e) => setBg(e.target.value)} placeholder="Experience, skills, why you're a fit…" className="mt-2 min-h-[140px]" />
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
    </SiteShell>
  );
}
