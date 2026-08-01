import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, FileText, Copy, Download, Eye } from "lucide-react";
import { toast } from "sonner";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { generateCV } from "@/lib/career.functions";
import { DocumentRender, toPlainText } from "@/components/document-render";
import { downloadDocumentPdf, createDocumentPdfUrl } from "@/lib/document-pdf";




export const Route = createFileRoute("/cv")({
  head: () => ({
    meta: [
      { title: "Free AI CV Generator — ATS-Optimized Resumes | ApplyWise" },
      { name: "description", content: "Paste a job description and get an ATS-optimized CV tailored to the role in under 60 seconds. Free AI resume generator by ApplyWise." },
      { property: "og:title", content: "AI CV Generator — ATS-Optimized Resumes" },
      { property: "og:description", content: "Turn any job description into a tailored, ATS-ready CV in 60 seconds." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/cv" },
    ],
    links: [{ rel: "canonical", href: "/cv" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "ApplyWise CV Generator",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }),
      },
    ],
  }),

  component: CVPage,
});

export function CVPage() {
  const run = useServerFn(generateCV);
  const [jd, setJd] = useState("");
  const [bg, setBg] = useState("");
  const [tone, setTone] = useState<"professional" | "confident" | "friendly" | "concise">("professional");
  const [out, setOut] = useState("");
  const [loading, setLoading] = useState(false);

  async function onGenerate() {
    if (jd.trim().length < 20 || bg.trim().length < 20) {
      toast.error("Add at least a short job description and a short background.");
      return;
    }
    setLoading(true); setOut("");
    try {
      const res = await run({ data: { jobDescription: jd, background: bg, tone } });
      setOut(res.text);
      toast.success("CV generated.");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Generation failed";
      toast.error(msg.includes("402") ? "AI credits exhausted." : msg.includes("429") ? "Rate limited — try again shortly." : "Generation failed");
    } finally { setLoading(false); }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(toPlainText(out));
      toast.success("Copied as clean text");
    } catch {
      toast.error("Copy failed");
    }
  }
  function downloadPdf() {
    try {
      downloadDocumentPdf(out, "tailored-cv.pdf");
      toast.success("Downloaded PDF");
    } catch {
      toast.error("PDF export failed");
    }
  }



  return (
    <SiteShell>
      <section className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-foreground text-background"><FileText className="h-5 w-5" /></div>
          <div>
            <h1 className="font-display text-3xl tracking-tight sm:text-4xl">AI CV Generator</h1>
            <p className="text-sm text-muted-foreground">Paste a job description and your background. Get a tailored, ATS-ready CV.</p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Job description</label>
              <Textarea value={jd} onChange={(e) => setJd(e.target.value)} placeholder="Paste the full job posting here…" className="mt-2 min-h-[180px]" />
            </div>
            <div>
              <label className="text-sm font-medium">Your background</label>
              <Textarea value={bg} onChange={(e) => setBg(e.target.value)} placeholder="Past roles, skills, education, achievements — or paste your existing CV." className="mt-2 min-h-[180px]" />
            </div>
            <div>
              <label className="text-sm font-medium">Tone</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {(["professional", "confident", "friendly", "concise"] as const).map((t) => (
                  <button key={t} onClick={() => setTone(t)} className={`rounded-full border px-3 py-1.5 text-xs transition ${tone === t ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:text-foreground"}`}>{t}</button>
                ))}
              </div>
            </div>
            <Button onClick={onGenerate} disabled={loading} size="lg" className="w-full rounded-full">
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Tailoring your CV…</> : "Generate my CV"}
            </Button>
          </div>

          <div className="rounded-3xl border border-border/70 bg-card p-5">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">Your tailored CV</div>
              {out && (
                <div className="flex flex-wrap items-center gap-1">
                  <Button size="sm" variant="ghost" onClick={copy} className="gap-1.5 text-xs"><Copy className="h-3.5 w-3.5" /> Copy</Button>
                  <Button size="sm" variant="outline" onClick={downloadPdf} className="gap-1.5 text-xs"><Download className="h-3.5 w-3.5" /> Download PDF</Button>

                </div>
              )}
            </div>
            <div className="mt-3 min-h-[400px] rounded-2xl border border-border/60 bg-background p-6">
              {out ? <DocumentRender text={out} /> : <span className="text-sm text-muted-foreground">Your generated CV will appear here.</span>}
            </div>

          </div>
        </div>
      </section>
    </SiteShell>
  );
}
