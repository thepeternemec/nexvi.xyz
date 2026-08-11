import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, FileText, Copy, Download, Eye } from "lucide-react";
import { toast } from "sonner";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { generateCV } from "@/lib/career.functions";
import { DocumentRender, toPlainText } from "@/components/document-render";
import { downloadDocumentPdf, createDocumentPdfUrl } from "@/lib/document-pdf";
import { useToolGate, ToolCreditBar } from "@/components/usage-gate";
import { ToolHero, ToolOutro } from "@/components/tool-hero";




export const Route = createFileRoute("/cv")({
  head: () => ({
    meta: [
      { title: "Free AI CV Generator — ATS-Optimized Resumes | ApplyWise" },
      { name: "description", content: "Paste a job description and get an ATS-optimized CV tailored to the role in under 60 seconds. Free AI resume generator by ApplyWise." },
      { property: "og:title", content: "AI CV Generator — ATS-Optimized Resumes" },
      { property: "og:description", content: "Turn any job description into a tailored, ATS-ready CV in 60 seconds." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://applywise.eu/cv" },
    ],
    links: [{ rel: "canonical", href: "https://applywise.eu/cv" }],
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
  const gate = useToolGate("cv");
  const [jd, setJd] = useState("");
  const [bg, setBg] = useState("");
  const [tone, setTone] = useState<"professional" | "confident" | "friendly" | "concise">("professional");
  const [out, setOut] = useState("");
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<"document" | "pdf">("document");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  // Cache the generated blob URL per CV text so toggling views never re-renders the PDF.
  const pdfCache = useRef<{ text: string; url: string } | null>(null);

  useEffect(() => {
    if (view !== "pdf" || !out) return;
    if (pdfCache.current?.text === out) {
      setPdfUrl(pdfCache.current.url);
      return;
    }
    try {
      const url = createDocumentPdfUrl(out);
      if (pdfCache.current) URL.revokeObjectURL(pdfCache.current.url);
      pdfCache.current = { text: out, url };
      setPdfUrl(url);
    } catch {
      setPdfUrl(null);
      toast.error("PDF preview failed");
    }
  }, [out, view]);

  // Revoke the cached blob URL only when the component unmounts.
  useEffect(() => () => {
    if (pdfCache.current) URL.revokeObjectURL(pdfCache.current.url);
    pdfCache.current = null;
  }, []);


  async function onGenerate() {
    if (jd.trim().length < 20 || bg.trim().length < 20) {
      toast.error("Add at least a short job description and a short background.");
      return;
    }
    if (!(await gate.before())) return;
    setLoading(true); setOut("");
    try {
      const res = await run({ data: { jobDescription: jd, background: bg, tone } });
      setOut(res.text);
      toast.success("CV generated. 🎉");
      await gate.after();
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
      toast.success("PDF ready — check your downloads or the new tab");
    } catch {
      toast.error("Your browser blocked the download. Use “Open PDF in a new tab”.");
    }
  }



  return (
    <SiteShell>
      <ToolHero
        eyebrow="CV Generator • built on the latest AI models"
        title="Turn any job description into a"
        titleEm="CV that beats the bots."
        sub="Most CVs are rejected before a human reads them. Paste the posting and your background — the model rewrites your experience in the recruiter's own language, keeps the structure ATS parsers expect, and hands you a clean PDF in under a minute."
        bullets={["3 free generations", "No credit card", "ATS-safe formatting"]}
        icon={FileText}
        steps={[
          { label: "Paste the job description", text: "Any posting, any language. The model reads the requirements, seniority and tone." },
          { label: "Add your background", text: "Rough notes are fine — bullet points, an old CV, or a LinkedIn dump." },
          { label: "Download your tailored CV", text: "Keyword-aligned, quantified, recruiter-readable. Preview it, then export a PDF." },
        ]}
      />
      <section className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6">


        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div>
              <label htmlFor="cv-job-description" className="text-sm font-medium">Job description</label>
              <Textarea id="cv-job-description" value={jd} onChange={(e) => setJd(e.target.value)} placeholder="Paste the full job posting here…" className="mt-2 min-h-[180px]" />
            </div>
            <div>
              <label htmlFor="cv-background" className="text-sm font-medium">Your background</label>
              <Textarea id="cv-background" value={bg} onChange={(e) => setBg(e.target.value)} placeholder="Past roles, skills, education, achievements — or paste your existing CV." className="mt-2 min-h-[180px]" />
            </div>
            <div>
              <span id="cv-tone-label" className="text-sm font-medium">Tone</span>
              <div className="mt-2 flex flex-wrap gap-2" role="group" aria-labelledby="cv-tone-label">
                {(["professional", "confident", "friendly", "concise"] as const).map((t) => (
                  <button key={t} type="button" aria-pressed={tone === t} onClick={() => setTone(t)} className={`rounded-full border px-3 py-1.5 text-xs transition ${tone === t ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:text-foreground"}`}>{t}</button>
                ))}
              </div>
            </div>
            <ToolCreditBar tool="cv" />
            <Button onClick={onGenerate} disabled={loading} size="lg" className="w-full rounded-full">
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Tailoring your CV…</> : "Generate my CV"}
            </Button>
          </div>

          <div className="rounded-3xl border border-border/70 bg-card p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-sm font-semibold">Your tailored CV</div>
              {out && (
                <div className="flex flex-wrap items-center gap-1">
                  <div className="mr-1 flex items-center rounded-full border border-border p-0.5">
                    {(["document", "pdf"] as const).map((v) => (
                      <button
                        key={v}
                        onClick={() => setView(v)}
                        className={`rounded-full px-2.5 py-1 text-xs transition ${view === v ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
                      >
                        {v === "document" ? "Document" : "PDF preview"}
                      </button>
                    ))}
                  </div>
                  <Button size="sm" variant="ghost" onClick={copy} className="gap-1.5 text-xs"><Copy className="h-3.5 w-3.5" /> Copy</Button>
                  <Button size="sm" variant="outline" onClick={downloadPdf} className="gap-1.5 text-xs"><Download className="h-3.5 w-3.5" /> Download PDF</Button>
                </div>
              )}
            </div>
            {out && view === "pdf" ? (
              <div className="mt-3 space-y-2">
                <div className="overflow-hidden rounded-2xl border border-border/60 bg-muted">
                  {pdfUrl ? (
                    <object data={pdfUrl} type="application/pdf" className="h-[720px] w-full">
                      <div className="grid h-[720px] place-items-center px-6 text-center text-sm text-muted-foreground">
                        Your browser can’t display PDFs inline here. Open it in a new tab or download it.
                      </div>
                    </object>
                  ) : (
                    <div className="grid h-[720px] place-items-center text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /></div>
                  )}
                </div>
                {pdfUrl && (
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-xs text-muted-foreground underline hover:text-foreground"
                  >
                    Open PDF in a new tab
                  </a>
                )}
              </div>
            ) : (

              <div className="mt-3 min-h-[400px] rounded-2xl border border-border/60 bg-background p-6">
                {out ? (
                  <DocumentRender text={out} />
                ) : (
                  <span className="flex items-center gap-2 text-sm text-muted-foreground"><Eye className="h-4 w-4" /> Your generated CV will appear here, with a live PDF preview before you download.</span>
                )}
              </div>
            )}
          </div>

        </div>
      </section>
      <ToolOutro
        title="A tailored CV is step one. Match the whole application."
        text="Recruiters compare your CV, your cover letter and your ATS score together. Generate the letter next, then score the pair against the posting before you hit send."
        primaryLabel="Write my cover letter"
        primaryHref="/cover-letter"
        secondaryLabel="Score my CV against the job"
        secondaryHref="/ats"
      />
      {gate.gates}
    </SiteShell>
  );
}
