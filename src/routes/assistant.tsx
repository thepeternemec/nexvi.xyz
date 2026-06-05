import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Send, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SiteShell } from "@/components/site-shell";
import { PromptCard } from "@/components/prompt-card";
import { prompts } from "@/lib/mock-data";

export const Route = createFileRoute("/assistant")({ component: Assistant });

type Msg = { role: "user" | "ai"; content: string; recs?: string[] };

const starters = [
  "I want to land a new job in 60 days",
  "Help me tailor my CV to a specific role",
  "I'm switching careers — how do I reposition?",
  "Write a cover letter for this JD",
  "Prep me for behavioral interviews",
  "Negotiate a counter-offer",
];

function recommend(input: string): string[] {
  const text = input.toLowerCase();
  const pick = (kw: string[]) => prompts.filter(p => kw.some(k => p.title.toLowerCase().includes(k) || p.category.includes(k) || p.tags.some(t => t.includes(k))));
  let r: typeof prompts = [];
  if (/(cv|resume)/.test(text)) r = pick(["cv", "resume", "ats"]);
  else if (/(cover letter|letter)/.test(text)) r = pick(["cover-letter", "cover letter"]);
  else if (/(ats|keyword|score)/.test(text)) r = pick(["ats", "keyword"]);
  else if (/(interview|behavioral|star)/.test(text)) r = pick(["interview", "star"]);
  else if (/(linkedin|profile|headline)/.test(text)) r = pick(["linkedin"]);
  else if (/(recruiter|outreach|cold)/.test(text)) r = pick(["outreach", "recruiter"]);
  else if (/(negotiat|offer|salary|comp)/.test(text)) r = pick(["negotiation", "comp"]);
  else if (/(switch|change|pivot|career change)/.test(text)) r = pick(["career-change", "pivot"]);
  else if (/(network|referral|intro)/.test(text)) r = pick(["networking", "referral"]);
  else if (/(student|grad|intern|no experience)/.test(text)) r = pick(["grad", "student"]);
  else r = prompts.slice(0, 3);
  return r.slice(0, 3).map(p => p.id);
}

function Assistant() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "ai", content: "Hi — I'm your AI career guide. Tell me your target role or what's stuck in your job search. I'll hand-pick the right prompts and walk you through." },
  ]);
  const [input, setInput] = useState("");

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Msg = { role: "user", content: text };
    const ids = recommend(text);
    const aiMsg: Msg = {
      role: "ai",
      content: `Beautiful. Here's where I'd start — these three are loved by people working on the same goal:`,
      recs: ids,
    };
    setMessages(m => [...m, userMsg, aiMsg]);
    setInput("");
  };

  return (
    <SiteShell>
      <section className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 lg:py-20">
        <div className="text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-amber-400 text-white shadow-lg">
            <Sparkles className="h-5 w-5" />
          </div>
          <h1 className="font-display mt-4 text-4xl tracking-tight sm:text-5xl">Your AI career guide</h1>
          <p className="mt-2 text-muted-foreground">What's your next move?</p>
        </div>

        <div className="mt-10 space-y-5">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-3xl px-5 py-3 text-[15px] ${m.role === "user" ? "bg-foreground text-background" : "bg-card border border-border/70"}`}>
                <div>{m.content}</div>
                {m.recs && (
                  <div className="mt-4 grid gap-3 sm:grid-cols-1">
                    {m.recs.map(id => {
                      const p = prompts.find(x => x.id === id)!;
                      return (
                        <Link key={id} to="/prompt/$slug" params={{ slug: p.slug }} className="group flex items-center gap-3 rounded-2xl border border-border/70 bg-background p-3 hover:border-foreground/30">
                          <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${p.cover}`} />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{p.title}</div>
                            <div className="text-xs text-muted-foreground truncate">{p.outcome}</div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {messages.length === 1 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {starters.map(s => (
              <button key={s} onClick={() => send(s)} className="rounded-full border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground hover:border-foreground/30 hover:text-foreground">
                {s}
              </button>
            ))}
          </div>
        )}

        <form
          onSubmit={(e) => { e.preventDefault(); send(input); }}
          className="sticky bottom-4 mt-10 flex items-center gap-2 rounded-2xl border border-border bg-background/95 p-2 shadow-lg backdrop-blur"
        >
          <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Tell me what you want to achieve…" className="h-11 border-0 bg-transparent shadow-none focus-visible:ring-0" />
          <Button type="submit" className="rounded-xl"><Send className="h-4 w-4" /></Button>
        </form>
      </section>
    </SiteShell>
  );
}
