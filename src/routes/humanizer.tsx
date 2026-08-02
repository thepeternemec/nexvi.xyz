import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Sparkles, Copy, Download, ArrowRightLeft } from "lucide-react";
import { toast } from "sonner";
import { diffWords } from "diff";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { humanizeText } from "@/lib/career.functions";
import { useToolGate, ToolCreditBar } from "@/components/usage-gate";
import { ToolHero, ToolOutro } from "@/components/tool-hero";

export const Route = createFileRoute("/humanizer")({
  head: () => ({
    meta: [
      { title: "AI Text Humanizer for CVs & Cover Letters | ApplyWise" },
      { name: "description", content: "Remove signs of AI-generated writing from your CV, cover letter, or any text. Rewrite it so it reads naturally and sounds like you." },
      { property: "og:title", content: "AI Humanizer — ApplyWise" },
      { property: "og:description", content: "Rewrite AI text so it sounds like you wrote it. Based on Wikipedia's Signs of AI Writing guide." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/humanizer" },
    ],
    links: [{ rel: "canonical", href: "/humanizer" }],
  }),

  component: HumanizerPage,
});

function HumanizerPage() {
  const run = useServerFn(humanizeText);
  const gate = useToolGate("humanizer");
  const [input, setInput] = useState("");
  const [out, setOut] = useState("");
  const [original, setOriginal] = useState("");
  const [strength, setStrength] = useState<"light" | "balanced" | "strong">("balanced");
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<"diff" | "clean">("diff");

  const diff = useMemo(() => {
    if (!original || !out) return null;
    return diffWords(original, out);
  }, [original, out]);

  const stats = useMemo(() => {
    if (!diff) return null;
    let added = 0, removed = 0;
    for (const p of diff) {
      if (p.added) added += p.value.trim().split(/\s+/).filter(Boolean).length;
      if (p.removed) removed += p.value.trim().split(/\s+/).filter(Boolean).length;
    }
    return { added, removed };
  }, [diff]);

  async function onRun() {
    if (input.trim().length < 10) {
      toast.error("Paste at least a short paragraph to humanize.");
      return;
    }
    if (!(await gate.before())) return;
    setLoading(true); setOut("");
    try {
      const res = await run({ data: { text: input, strength } });
      setOriginal(input);
      setOut(res.text);
      toast.success("Humanized. 🎉");
      await gate.after();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed";
      toast.error(msg.includes("402") ? "AI credits exhausted." : msg.includes("429") ? "Rate limited — try again shortly." : "Failed to humanize");
    } finally { setLoading(false); }
  }

  function copy() { navigator.clipboard.writeText(out); toast.success("Copied"); }
  function download() {
    const blob = new Blob([out], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "humanized.txt"; a.click(); URL.revokeObjectURL(url);
  }

  return (
    <SiteShell>
      <ToolHero
        eyebrow="Humanizer • see every change"
        title="Keep the AI speed. Lose the"
        titleEm="AI tells."
        sub="Recruiters spot the patterns: hollow superlatives, tricolons, \u201cdelve\u201d, \u201crobust\u201d, sentences that say nothing twice. The Humanizer rewrites those away and shows you a word-level diff, so you stay in control of every edit."
        bullets={["Word-level diff view", "Three editing strengths", "Works on any text"]}
        icon={Sparkles}
        steps={[
          { label: "Paste your text", text: "A CV summary, a cover letter, a LinkedIn About section — anything that reads machine-made." },
          { label: "Choose an editing strength", text: "Light keeps your structure; strong rebuilds the rhythm of the sentences." },
          { label: "Review the diff", text: "Green is added, red is cut. Accept the version that still sounds like you." },
        ]}
      />
      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">

        <div className="mt-8 space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-border/70 bg-card p-5">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-sm font-semibold">Original</div>
                {stats && <div className="text-xs text-muted-foreground"><span className="text-rose-500">−{stats.removed}</span> words</div>}
              </div>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste your CV summary, cover letter, or any AI-written text…"
                className="min-h-[400px] max-h-[70vh] resize-y overflow-auto border-0 bg-transparent p-0 text-sm leading-relaxed shadow-none focus-visible:ring-0"
              />
              <div className="mt-4 border-t border-border/60 pt-4">
                <div className="mb-4">
                  <label className="text-sm font-medium">Editing strength</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(["light", "balanced", "strong"] as const).map((t) => (
                      <button key={t} onClick={() => setStrength(t)} className={`rounded-full border px-3 py-1.5 text-xs capitalize transition ${strength === t ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:text-foreground"}`}>{t}</button>
                    ))}
                  </div>
                </div>
                <div className="mb-4"><ToolCreditBar tool="humanizer" /></div>
                <Button onClick={onRun} disabled={loading} className="w-full rounded-full" size="lg">
                  {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Humanizing…</> : <><ArrowRightLeft className="h-4 w-4" /> Humanize text</>}
                </Button>
              </div>
            </div>


            <div className="rounded-3xl border border-border/70 bg-card p-5">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-sm font-semibold">Humanized</div>
                  {out && (
                    <div className="flex rounded-full border border-border p-0.5 text-xs">
                      <button onClick={() => setView("diff")} className={`rounded-full px-2.5 py-0.5 transition ${view === "diff" ? "bg-foreground text-background" : "text-muted-foreground"}`}>Diff</button>
                      <button onClick={() => setView("clean")} className={`rounded-full px-2.5 py-0.5 transition ${view === "clean" ? "bg-foreground text-background" : "text-muted-foreground"}`}>Clean</button>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {stats && <div className="text-xs text-muted-foreground"><span className="text-emerald-500">+{stats.added}</span> words</div>}
                  {out && (
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={copy}><Copy className="h-4 w-4" /></Button>
                      <Button size="sm" variant="ghost" onClick={download}><Download className="h-4 w-4" /></Button>
                    </div>
                  )}
                </div>
              </div>
              <div className="min-h-[400px] max-h-[70vh] overflow-auto whitespace-pre-wrap text-sm leading-relaxed">
                {!out && <span className="text-muted-foreground">Your humanized text — with changes highlighted — will appear here.</span>}
                {out && view === "clean" && out}
                {out && view === "diff" && diff && diff.map((part, i) => {
                  if (part.added) return <span key={i} className="rounded bg-emerald-500/15 px-0.5 text-emerald-700 dark:text-emerald-300">{part.value}</span>;
                  if (part.removed) return <span key={i} className="rounded bg-rose-500/15 px-0.5 text-rose-700 line-through decoration-rose-400/60 dark:text-rose-300">{part.value}</span>;
                  return <span key={i}>{part.value}</span>;
                })}
              </div>
            </div>
          </div>

          {out && (
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-rose-500/25" /> Removed / replaced</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-emerald-500/25" /> Added</span>
            </div>
          )}


        </div>
      </section>
      <ToolOutro
        title="Now put that voice into a full application."
        text="Humanized text works hardest inside a document that's already aligned to the role. Generate a tailored CV or cover letter, then run it back through here for the final pass."
        primaryLabel="Generate a tailored CV"
        primaryHref="/cv"
        secondaryLabel="Write a cover letter"
        secondaryHref="/cover-letter"
      />
      {gate.gates}
    </SiteShell>
  );
}
