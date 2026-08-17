import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronDown, Copy, Download, PanelRightOpen } from "lucide-react";
import { toast } from "sonner";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
  MessageActions,
  MessageAction,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputTools,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChatContext } from "./chat-context";
import { PromptResultList, isPromptResults, type PromptResults } from "./prompt-results";
import { useAuth } from "@/hooks/use-auth";
import { useToolGate } from "@/components/usage-gate";
import { modeMeta, type ChatMode } from "@/lib/chat-modes";
import { addMessage, createThread, type ChatMsg } from "@/lib/chat-store";
import { generateCV, generateCoverLetter, scoreATS, humanizeText } from "@/lib/career.functions";
import { prompts } from "@/lib/mock-data";

type ComposerContext = {
  jobDescription: string;
  background: string;
  company: string;
  role: string;
};

const CTX_KEY = "applywise.chat.context";
const EMPTY_CTX: ComposerContext = { jobDescription: "", background: "", company: "", role: "" };

function loadCtx(): ComposerContext {
  if (typeof window === "undefined") return EMPTY_CTX;
  try {
    const raw = window.localStorage.getItem(CTX_KEY);
    return raw ? { ...EMPTY_CTX, ...(JSON.parse(raw) as Partial<ComposerContext>) } : EMPTY_CTX;
  } catch {
    return EMPTY_CTX;
  }
}

function clean(text: string) {
  return text
    .replace(/```[a-z]*\n?/gi, "")
    .replace(/```/g, "")
    .trim();
}

function pad(text: string, label: string) {
  const t = text.trim();
  return t.length < 20 ? `${t}\n\n(${label})` : t;
}

function atsMarkdown(r: Awaited<ReturnType<typeof scoreATS>>) {
  const lines: string[] = [];
  lines.push(`## ATS match: ${Math.round(r.score)}/100`);
  if (r.verdict) lines.push(`_${r.verdict}_`);
  if (r.subScores.length) {
    lines.push("", "| Area | Score | Weight |", "| --- | --- | --- |");
    for (const s of r.subScores) lines.push(`| ${s.label} | ${Math.round(s.score)} | ${s.weight}% |`);
  }
  lines.push(
    "",
    `**Keyword coverage:** ${r.keywordCoverage.matchedCount}/${r.keywordCoverage.totalCount} (${Math.round(r.keywordCoverage.coveragePct)}%)`,
  );
  if (r.missingKeywords.length) lines.push("", `**Missing keywords:** ${r.missingKeywords.slice(0, 18).join(", ")}`);
  const failed = r.formattingChecks.filter((c) => !c.passed);
  if (failed.length) {
    lines.push("", "**Formatting issues**");
    for (const c of failed) lines.push(`- ${c.name}${c.detail ? ` — ${c.detail}` : ""}`);
  }
  if (r.improvements.length) {
    lines.push("", "**Fix these first**");
    for (const i of r.improvements.slice(0, 8)) lines.push(`- ${i}`);
  }
  if (r.strengths.length) {
    lines.push("", "**Working well**");
    for (const s of r.strengths.slice(0, 6)) lines.push(`- ${s}`);
  }
  return lines.join("\n");
}

const STOP_WORDS = new Set([
  "the","a","an","and","or","for","with","to","of","my","me","i","in","on","how","do","can","you","please","help","need","want","best","some","give","show","find","prompt","prompts","about","that","this","get","any",
]);

function scorePrompt(p: (typeof prompts)[number], tokens: string[]) {
  const title = p.title.toLowerCase();
  const outcome = p.outcome.toLowerCase();
  const desc = p.description.toLowerCase();
  const cat = p.category.toLowerCase();
  const pack = (p.pack ?? "").toLowerCase();
  const tags = p.tags.map((t) => t.toLowerCase()).join(" ");
  let score = 0;
  for (const t of tokens) {
    if (title.includes(t)) score += 6;
    if (tags.includes(t)) score += 4;
    if (cat.includes(t) || pack.includes(t)) score += 3;
    if (outcome.includes(t)) score += 2;
    if (desc.includes(t)) score += 1;
  }
  return score;
}

function recommendPrompts(input: string): { content: string; data: PromptResults } {
  const tokens = input
    .toLowerCase()
    .split(/[^a-z0-9+]+/)
    .filter((t) => t.length > 2 && !STOP_WORDS.has(t));

  const ranked = prompts
    .map((p) => ({ p, score: scorePrompt(p, tokens) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || b.p.uses - a.p.uses)
    .map((x) => x.p);

  const matched = ranked.length > 0;
  const list = matched ? ranked : [...prompts].sort((a, b) => b.uses - a.uses);

  const content = matched
    ? `Here ${list.length === 1 ? "is the prompt" : `are the ${list.length} prompts`} that match your request.`
    : tokens.length
      ? `I couldn't match “${input.trim()}” exactly — here's the full library instead.`
      : `Here's the full prompt library (${prompts.length} prompts).`;

  return {
    content,
    data: {
      kind: "prompt-results",
      query: input.trim(),
      total: matched ? list.length : 0,
      items: list.map((p) => ({
        slug: p.slug,
        title: p.title,
        outcome: p.outcome,
        category: p.category,
        pack: p.pack ?? null,
      })),
    },
  };
}


export function ChatWindow({
  threadId,
  initialMode = "cv",
  initialMessages = [],
  onOpenSidebar,
}: {
  threadId?: string;
  initialMode?: ChatMode;
  initialMessages?: ChatMsg[];
  onOpenSidebar?: () => void;
}) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [mode] = useState<ChatMode>(initialMode);
  const [messages, setMessages] = useState<ChatMsg[]>(initialMessages);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [ctx, setCtx] = useState<ComposerContext>(EMPTY_CTX);
  const [ctxOpen, setCtxOpen] = useState(false);
  const activeThread = useRef<string | undefined>(threadId);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [previewSlug, setPreviewSlug] = useState<string | null>(null);


  const meta = modeMeta(mode);
  const gate = useToolGate(meta.tool ?? "cv");

  useEffect(() => {
    setCtx(loadCtx());
  }, []);

  // Both chat routes remount this component via `key`, so thread/message
  // props are only ever read as initial state — no re-sync effect needed.


  useEffect(() => {
    textareaRef.current?.focus();
  }, [threadId, busy]);

  function updateCtx(patch: Partial<ComposerContext>) {
    setCtx((prev: ComposerContext) => {
      const next = { ...prev, ...patch };
      try {
        window.localStorage.setItem(CTX_KEY, JSON.stringify(next));
      } catch {
        /* storage unavailable — context stays in memory */
      }
      return next;
    });
  }

  const insertPrompt = useCallback((slug: string) => {
    const p = prompts.find((x) => x.slug === slug);
    if (!p) return;
    setPreviewSlug(p.slug);
  }, []);

  const previewPrompt = useMemo(
    () => (previewSlug ? prompts.find((p) => p.slug === previewSlug) : undefined),
    [previewSlug],
  );

  function applyPreview() {
    if (!previewPrompt) return;
    setInput(previewPrompt.body);
    setPreviewSlug(null);
    setTimeout(() => textareaRef.current?.focus(), 0);
  }


  const ready = useMemo(() => {
    if (meta.needs.includes("jobDescription") && !ctx.jobDescription.trim()) return false;
    if (meta.needs.includes("background") && !ctx.background.trim()) return false;
    return true;
  }, [ctx.background, ctx.jobDescription, meta.needs]);

  const runCV = useServerFn(generateCV);
  const runCover = useServerFn(generateCoverLetter);
  const runATS = useServerFn(scoreATS);
  const runHumanize = useServerFn(humanizeText);

  function push(msg: ChatMsg) {
    setMessages((m) => [...m, msg]);
  }

  async function persist(role: "user" | "assistant", content: string, data?: unknown) {
    if (!user) return;
    let id = activeThread.current;
    if (!id) {
      const created = await createThread(user.id, content || meta.label, mode);
      id = created.id;
      activeThread.current = id;
    }
    await addMessage({ threadId: id, userId: user.id, role, content, mode, data });
    await queryClient.invalidateQueries({ queryKey: ["chat-threads"] });
  }

  async function send(raw: string) {
    const text = raw.trim();
    if (busy) return;

    if (mode === "humanizer" && !text && !ctx.background.trim()) {
      toast.error("Paste the text you want humanized.");
      return;
    }
    if (mode !== "humanizer" && mode !== "prompts" && !ready) {
      setCtxOpen(true);
      push({
        id: `local-${Date.now()}`,
        role: "assistant",
        content:
          "I need two things first: the **job description** and **your background / current CV**. Add them in the context panel and I'll get to work.",
        mode,
      });
      return;
    }
    if (mode === "prompts") {
      const q = text || "job search";
      const res = recommendPrompts(q);
      push({ id: `u-${Date.now()}`, role: "user", content: q, mode });
      push({ id: `a-${Date.now()}`, role: "assistant", content: res.content, mode, data: res.data });
      setInput("");
      try {
        await persist("user", q);
        await persist("assistant", res.content, res.data);
      } catch {
        /* history is best-effort */
      }
      return;
    }

    if (!(await gate.before())) return;

    const userContent =
      text ||
      (mode === "ats"
        ? "Score my CV against this job description."
        : mode === "cv"
          ? "Write my tailored CV for this role."
          : "Write my cover letter for this role.");

    push({ id: `u-${Date.now()}`, role: "user", content: userContent, mode });
    setInput("");
    setBusy(true);

    try {
      await persist("user", userContent);

      let content = "";
      let data: unknown;

      if (mode === "cv") {
        const res = await runCV({
          data: {
            jobDescription: pad(ctx.jobDescription, "Short job description provided by user."),
            background: pad(`${ctx.background}\n\n${text}`.trim(), "Brief background provided by user."),
          },
        });
        content = clean(res.text);
      } else if (mode === "coverLetter") {
        const res = await runCover({
          data: {
            jobDescription: pad(ctx.jobDescription, "Short job description provided by user."),
            background: pad(`${ctx.background}\n\n${text}`.trim(), "Brief background provided by user."),
            companyName: ctx.company || undefined,
            roleTitle: ctx.role || undefined,
          },
        });
        content = clean(res.text);
      } else if (mode === "ats") {
        const res = await runATS({
          data: {
            jobDescription: pad(ctx.jobDescription, "Short job description provided by user."),
            cv: pad(ctx.background, "Brief CV provided by user."),
          },
        });
        content = atsMarkdown(res);
        data = res;
      } else {
        const res = await runHumanize({
          data: { text: pad(text || ctx.background, "Short text provided by user.") },
        });
        content = clean(res.text);
      }

      push({ id: `a-${Date.now()}`, role: "assistant", content, mode, data });
      await persist("assistant", content, data);
      await gate.after();

      if (!threadId && activeThread.current) {
        navigate({
          to: "/copilot/$threadId",
          params: { threadId: activeThread.current },
          replace: true,
        }).catch(() => undefined);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Generation failed";
      const quota = /free preview|free limit|credits|sign in again/i.test(msg);
      toast.error(
        quota
          ? msg
          : msg.includes("402")
            ? "AI credits exhausted."
            : msg.includes("429")
              ? "Rate limited — try again shortly."
              : msg,
      );
      push({
        id: `e-${Date.now()}`,
        role: "assistant",
        content: quota
          ? `${msg}\n\nCreate a free account to keep generating — it takes a few seconds.`
          : "That request didn't go through. Try again in a moment.",
        mode,
      });

    } finally {
      setBusy(false);
    }
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text).then(
      () => toast.success("Copied"),
      () => toast.error("Copy failed"),
    );
  }

  function download(text: string) {
    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${mode}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-border/60 px-3 py-2.5 sm:px-5">
        {onOpenSidebar && (
          <Button variant="ghost" size="icon-sm" className="lg:hidden" onClick={onOpenSidebar} aria-label="Open menu">
            <PanelRightOpen className="h-4 w-4" />
          </Button>
        )}
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border/70 bg-background">
            <meta.icon className="h-3.5 w-3.5" />
          </span>
          <span className="truncate text-[13px] font-semibold">{meta.label}</span>
        </div>
      </div>


      {/* Context panel */}
      {meta.needs.length > 0 && (
        <div className="border-b border-border/60 bg-muted/20">
          <button
            onClick={() => setCtxOpen((o) => !o)}
            className="flex w-full items-center justify-between px-3 py-2 text-left text-[12.5px] font-medium sm:px-5"
          >
            <span className="text-muted-foreground">
              Context ·{" "}
              <span className={ready ? "text-primary" : "text-foreground"}>
                {ready ? "ready" : "job description + your background needed"}
              </span>
            </span>
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition ${ctxOpen ? "rotate-180" : ""}`} />
          </button>
          {ctxOpen && (
            <div className="grid gap-3 px-3 pb-4 sm:px-5 lg:grid-cols-2">
              {mode === "coverLetter" && (
                <div className="grid grid-cols-2 gap-3 lg:col-span-2">
                  <Input
                    value={ctx.company}
                    onChange={(e) => updateCtx({ company: e.target.value })}
                    placeholder="Company (optional)"
                  />
                  <Input
                    value={ctx.role}
                    onChange={(e) => updateCtx({ role: e.target.value })}
                    placeholder="Role title (optional)"
                  />
                </div>
              )}
              {meta.needs.includes("jobDescription") && (
                <div>
                  <label className="text-[12px] font-medium text-muted-foreground">Job description</label>
                  <Textarea
                    value={ctx.jobDescription}
                    onChange={(e) => updateCtx({ jobDescription: e.target.value })}
                    placeholder="Paste the job posting…"
                    className="mt-1.5 min-h-[110px]"
                  />
                </div>
              )}
              {meta.needs.includes("background") && (
                <div>
                  <label className="text-[12px] font-medium text-muted-foreground">Your CV / background</label>
                  <Textarea
                    value={ctx.background}
                    onChange={(e) => updateCtx({ background: e.target.value })}
                    placeholder="Paste your CV or summarise your experience…"
                    className="mt-1.5 min-h-[110px]"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Transcript */}
      <ChatContext.Provider value={{ insertPrompt }}>
        <Conversation className="min-h-0 flex-1">
          <ConversationContent className="mx-auto w-full max-w-3xl">
            {messages.length === 0 ? (
              <div className="py-14 text-center">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-border/70 bg-card">
                  <meta.icon className="h-5 w-5 text-primary" />
                </div>
                <h2 className="font-display mt-4 text-2xl tracking-tight">{meta.label}</h2>
                <p className="mx-auto mt-1.5 max-w-md text-sm text-muted-foreground">{meta.blurb}</p>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {meta.starters.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="rounded-full border border-border/70 bg-background px-3 py-1.5 text-[12.5px] text-muted-foreground transition hover:border-foreground/25 hover:text-foreground"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((m) => (
                <Message from={m.role} key={m.id}>
                  <MessageContent>
                    <MessageResponse>{m.content}</MessageResponse>
                    {m.role === "assistant" && (
                      <MessageActions className="mt-2">
                        <MessageAction label="Copy" onClick={() => copy(m.content)}>
                          <Copy className="h-3.5 w-3.5" />
                        </MessageAction>
                        <MessageAction label="Download" onClick={() => download(m.content)}>
                          <Download className="h-3.5 w-3.5" />
                        </MessageAction>
                      </MessageActions>
                    )}
                  </MessageContent>
                </Message>
              ))
            )}
            {previewPrompt && (
              <div className="mt-2 rounded-xl border border-border/70 bg-card p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Prompt preview</p>
                    <h3 className="mt-1 text-sm font-medium">{previewPrompt.title}</h3>
                    {previewPrompt.description && (
                      <p className="mt-1 text-[12.5px] text-muted-foreground">{previewPrompt.description}</p>
                    )}

                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setPreviewSlug(null)}>
                    Dismiss
                  </Button>
                </div>
                <pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap rounded-lg border border-border/60 bg-muted/40 p-3 text-[12.5px] leading-relaxed text-foreground">
                  {previewPrompt.body}
                </pre>
                <div className="mt-3 flex items-center justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => copy(previewPrompt.body)}>
                    Copy
                  </Button>
                  <Button size="sm" onClick={applyPreview}>
                    Apply
                  </Button>
                </div>
              </div>
            )}
            {busy && (
              <Message from="assistant">
                <MessageContent>
                  <Shimmer>Working on it…</Shimmer>
                </MessageContent>
              </Message>
            )}

          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
      </ChatContext.Provider>

      {/* Composer */}
      <div className="border-t border-border/60 px-3 py-3 sm:px-5">
        <div className="mx-auto w-full max-w-3xl">
          <PromptInput
            onSubmit={(message, event) => {
              event.preventDefault();
              void send(message.text || input);
            }}
          >
            <PromptInputTextarea
              key={mode}
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={meta.placeholder}
            />
            <PromptInputFooter className="justify-between">
              <PromptInputTools>
                <span key={mode} className="inline-flex items-center gap-1.5 px-1 text-[11.5px] text-muted-foreground">
                  <meta.icon className="h-3.5 w-3.5" /> {meta.label}
                </span>

              </PromptInputTools>
              <PromptInputSubmit status={busy ? "submitted" : undefined} disabled={busy} />
            </PromptInputFooter>
          </PromptInput>
          {!user && (
            <p className="mt-2 text-center text-[11.5px] text-muted-foreground">
              Sign in to keep your conversations and history.
            </p>
          )}
        </div>
      </div>
      {gate.gates}
    </div>
  );
}
