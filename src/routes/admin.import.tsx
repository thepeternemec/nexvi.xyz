import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Upload, ShieldCheck, FileJson, Sparkles, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SiteShell } from "@/components/site-shell";
import { supabase } from "@/integrations/supabase/client";
import { importPrompts, claimAdminIfFirst, getPromptStats } from "@/lib/prompts.functions";

export const Route = createFileRoute("/admin/import")({ component: AdminImport });

const SAMPLE = JSON.stringify(
  {
    prompts: [
      {
        slug: "sunday-reset-routine",
        title: "Sunday Reset Routine",
        outcome: "Start every week feeling in control",
        description: "A 30-minute guided reset that plans your week, tidies your digital life, and sets one meaningful intention.",
        category_slug: "productivity",
        audience: ["students", "freelancers", "parents"],
        difficulty: "beginner",
        beginner: true,
        price: 0,
        tools: ["ChatGPT", "Claude"],
        tags: ["weekly review", "habits", "calm"],
        creator_name: "Maya Chen",
        creator_handle: "@mayawrites",
        body: "Act as a calm Sunday-evening coach. Ask me what went well, what drained me, and what matters next week. Then output a themed plan with 3 priorities, a shutdown ritual, and one small intention.",
        instructions: ["Open ChatGPT or Claude", "Paste the prompt", "Answer the three questions honestly", "Save the output in your notes"],
        examples: [{ input: "Tired week, big project Tuesday", output: "3 priorities, calendar blocks, shutdown ritual." }],
        tips: ["Do it with tea, not on your phone", "Keep answers to 1–2 sentences each"],
      },
    ],
    upsert: true,
  },
  null,
  2,
);

function AdminImport() {
  const navigate = useNavigate();
  const claim = useServerFn(claimAdminIfFirst);
  const runImport = useServerFn(importPrompts);
  const stats = useServerFn(getPromptStats);

  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [counts, setCounts] = useState<{ total: number; published: number } | null>(null);

  const parseResult = useMemo(() => {
    if (!text.trim()) return { ok: false as const, count: 0, error: null as string | null };
    try {
      const obj = JSON.parse(text);
      const arr = Array.isArray(obj) ? obj : obj?.prompts;
      if (!Array.isArray(arr)) return { ok: false as const, count: 0, error: "Expected an array, or { prompts: [...] }" };
      return { ok: true as const, count: arr.length, error: null };
    } catch (e) {
      return { ok: false as const, count: 0, error: e instanceof Error ? e.message : "Invalid JSON" };
    }
  }, [text]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        navigate({ to: "/login" });
        return;
      }
      try {
        const res = await claim();
        setIsAdmin(res.isAdmin);
        const s = await stats();
        setCounts(s);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to verify role");
      } finally {
        setChecking(false);
      }
    })();
  }, [claim, stats, navigate]);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const t = await file.text();
    setText(t);
  }

  async function onSubmit() {
    if (!parseResult.ok) return;
    setSubmitting(true);
    try {
      const obj = JSON.parse(text);
      const prompts = Array.isArray(obj) ? obj : obj.prompts;
      const upsert = !Array.isArray(obj) ? !!obj.upsert : true;
      const res = await runImport({ data: { prompts, upsert } });
      toast.success(`Imported ${res.count} prompt${res.count === 1 ? "" : "s"}`);
      const s = await stats();
      setCounts(s);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Import failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (checking) {
    return (
      <SiteShell>
        <div className="mx-auto max-w-3xl px-4 py-24 text-center text-muted-foreground">Checking access…</div>
      </SiteShell>
    );
  }

  if (!isAdmin) {
    return (
      <SiteShell>
        <div className="mx-auto max-w-md px-4 py-24 text-center">
          <ShieldCheck className="mx-auto h-10 w-10 text-muted-foreground" />
          <h1 className="font-display mt-4 text-3xl">Admins only</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your account isn't an admin yet. The first signed-in user automatically becomes the admin — if that should be
            you, contact whoever owns the workspace.
          </p>
          <Button asChild className="mt-6 rounded-full"><Link to="/dashboard">Back to dashboard</Link></Button>
        </div>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <section className="border-b border-border/60 bg-aurora">
        <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6">
          <div className="flex items-center gap-2 text-xs text-muted-foreground"><Sparkles className="h-3.5 w-3.5" /> Admin</div>
          <h1 className="font-display mt-1 text-5xl tracking-tight">Import prompts</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Paste a JSON array or a <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{`{ "prompts": [...] }`}</code>{" "}
            object. Existing slugs are updated when <code className="rounded bg-muted px-1.5 py-0.5 text-xs">upsert: true</code>.
          </p>
          {counts && (
            <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-border/60 bg-background/80 px-4 py-2 text-sm shadow-sm">
              <Database className="h-4 w-4 text-muted-foreground" />
              <span><span className="font-medium">{counts.total}</span> total · <span className="font-medium">{counts.published}</span> published</span>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Label htmlFor="json" className="text-base">Prompts JSON</Label>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={() => setText(SAMPLE)}>
                  <FileJson className="mr-1.5 h-3.5 w-3.5" /> Load sample
                </Button>
                <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium hover:border-foreground/30">
                  <Upload className="h-3.5 w-3.5" /> Upload .json
                  <input type="file" accept="application/json,.json" className="hidden" onChange={onFile} />
                </label>
              </div>
            </div>
            <Textarea
              id="json"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder='Paste JSON here…'
              className="min-h-[420px] font-mono text-xs"
            />
            <div className="flex items-center justify-between gap-3 text-sm">
              <div className="text-muted-foreground">
                {parseResult.error ? <span className="text-destructive">{parseResult.error}</span>
                  : parseResult.ok ? <>Ready to import <span className="font-medium text-foreground">{parseResult.count}</span> prompt{parseResult.count === 1 ? "" : "s"}.</>
                  : "Waiting for input…"}
              </div>
              <Button onClick={onSubmit} disabled={!parseResult.ok || submitting} className="rounded-full">
                {submitting ? "Importing…" : "Import prompts"}
              </Button>
            </div>
          </div>

          <aside className="space-y-4 rounded-2xl border border-border/60 bg-card/50 p-5 text-sm">
            <h3 className="font-display text-lg">Schema</h3>
            <p className="text-muted-foreground">Each prompt requires <code>slug</code>, <code>title</code>, and <code>body</code>. Everything else is optional.</p>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li><span className="text-foreground">category_slug</span> — career, productivity, content, study, marketing, startup, fitness, travel, email, slides, social, skills</li>
              <li><span className="text-foreground">audience</span> — students, freelancers, marketers, creators, small business, parents…</li>
              <li><span className="text-foreground">tools</span> — ChatGPT, Claude, Gemini, Midjourney</li>
              <li><span className="text-foreground">difficulty</span> — beginner · intermediate · advanced</li>
              <li><span className="text-foreground">price</span> — 0 for free, otherwise USD</li>
              <li><span className="text-foreground">examples / faqs / variables</span> — arrays of objects</li>
              <li><span className="text-foreground">instructions / tips / tags</span> — arrays of strings</li>
            </ul>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}
