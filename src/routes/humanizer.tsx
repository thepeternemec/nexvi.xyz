import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Sparkles, Copy, Download, ArrowRightLeft } from "lucide-react";
import { toast } from "sonner";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { humanizeText } from "@/lib/career.functions";

export const Route = createFileRoute("/humanizer")({
  head: () => ({
    meta: [
      { title: "AI Humanizer — ApplyWise" },
      { name: "description", content: "Remove signs of AI-generated writing from your CV, cover letter, or any text. Sound natural and human." },
      { property: "og:title", content: "AI Humanizer — ApplyWise" },
      { property: "og:description", content: "Rewrite AI text so it sounds like you wrote it. Based on Wikipedia's Signs of AI Writing guide." },
    ],
  }),
  component: HumanizerPage,
});

function HumanizerPage() {
  const run = useServerFn(humanizeText);
  const [input, setInput] = useState("");
  const [out, setOut] = useState("");
  const [strength, setStrength] = useState<"light" | "balanced" | "strong">("balanced");
  const [loading, setLoading] = useState(false);

  async function onRun() {
    if (input.trim().length < 10) {
      toast.error("Paste at least a short paragraph to humanize.");
      return;
    }
    setLoading(true); setOut("");
    try {
      const res = await run({ data: { text: input, strength } });
      setOut(res.text);
      toast.success("Humanized.");
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
      <section className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-foreground text-background"><Sparkles className="h-5 w-5" /></div>
          <div>
            <h1 className="font-display text-3xl tracking-tight sm:text-4xl">Humanizer</h1>
            <p className="text-sm text-muted-foreground">Strip AI tells from your CV, cover letter, or any text — keep the meaning, lose the robot.</p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Paste AI-generated text</label>
              <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste your CV summary, cover letter, or any AI-written text…" className="mt-2 min-h-[280px]" />
            </div>
            <div>
              <label className="text-sm font-medium">Editing strength</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {(["light", "balanced", "strong"] as const).map((t) => (
                  <button key={t} onClick={() => setStrength(t)} className={`rounded-full border px-3 py-1.5 text-xs capitalize transition ${strength === t ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:text-foreground"}`}>{t}</button>
                ))}
              </div>
            </div>
            <Button onClick={onRun} disabled={loading} size="lg" className="w-full rounded-full">
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Humanizing…</> : <><ArrowRightLeft className="h-4 w-4" /> Humanize text</>}
            </Button>
            <p className="text-xs text-muted-foreground">
              Based on the open-source <a href="https://github.com/blader/humanizer" target="_blank" rel="noreferrer" className="underline">Humanizer</a> skill and Wikipedia's Signs of AI Writing guide.
            </p>
          </div>

          <div className="rounded-3xl border border-border/70 bg-card p-5">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">Humanized output</div>
              {out && (
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={copy}><Copy className="h-4 w-4" /></Button>
                  <Button size="sm" variant="ghost" onClick={download}><Download className="h-4 w-4" /></Button>
                </div>
              )}
            </div>
            <div className="mt-3 min-h-[400px] whitespace-pre-wrap rounded-2xl bg-muted/30 p-4 text-sm leading-relaxed">
              {out || <span className="text-muted-foreground">Your humanized text will appear here.</span>}
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
