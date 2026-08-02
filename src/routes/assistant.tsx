import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Send, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SiteShell } from "@/components/site-shell";
import { PromptCard } from "@/components/prompt-card";
import { prompts } from "@/lib/mock-data";
import { useLocale } from "@/lib/locale-context";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "AI Job Application Assistant — ApplyWise" },
      { name: "description", content: "Describe your job search goal and get the right ApplyWise prompt or tool for it." },
      { property: "og:title", content: "AI Job Application Assistant — ApplyWise" },
      { property: "og:description", content: "Get matched to the right prompt for your job search task." },
      { property: "og:url", content: "https://applywise.eu/assistant" },
    ],
    links: [{ rel: "canonical", href: "https://applywise.eu/assistant" }],
  }),
  component: Assistant,
});



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

export function Assistant() {
  const { locale } = useLocale();
  const greetings: Record<string, string> = {
    en: "Hi — I'm your AI career guide. Tell me your target role or what's stuck in your job search. I'll hand-pick the right prompts and walk you through.",
    de: "Hi — ich bin dein KI-Karriereguide. Sag mir deine Zielrolle oder wo du bei der Jobsuche feststeckst. Ich wähle die passenden Prompts aus und begleite dich.",
    es: "Hola — soy tu guía de carrera con IA. Cuéntame tu puesto objetivo o dónde te has atascado en la búsqueda de empleo. Elegiré los prompts adecuados y te acompañaré.",
    fr: "Salut — je suis ton guide de carrière IA. Dis-moi le poste que tu vises ou ce qui te bloque dans ta recherche d'emploi. Je choisirai les bons prompts et t'accompagnerai.",
    it: "Ciao — sono la tua guida di carriera IA. Dimmi il ruolo che vuoi raggiungere o dove sei bloccato nella ricerca di lavoro. Sceglierò i prompt giusti e ti guiderò.",
  };
  const followups: Record<string, string> = {
    en: "Beautiful. Here's where I'd start — these three are loved by people working on the same goal:",
    de: "Wunderbar. Hier würde ich anfangen — diese drei werden von Leuten mit dem gleichen Ziel geliebt:",
    es: "Perfecto. Aquí es por donde empezaría — estos tres son los favoritos de quienes trabajan en el mismo objetivo:",
    fr: "Parfait. Voici par où je commencerais — ces trois sont adorés par ceux qui visent le même objectif :",
    it: "Perfetto. Ecco da dove partirei — questi tre sono amati da chi lavora sullo stesso obiettivo:",
  };
  const [messages, setMessages] = useState<Msg[]>([
    { role: "ai", content: greetings[locale] ?? greetings.en },
  ]);
  const [input, setInput] = useState("");

  // Keep greeting in sync when locale changes and it's still the only message
  if (messages.length === 1 && messages[0].role === "ai" && messages[0].content !== (greetings[locale] ?? greetings.en)) {
    setMessages([{ role: "ai", content: greetings[locale] ?? greetings.en }]);
  }

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Msg = { role: "user", content: text };
    const ids = recommend(text);
    const aiMsg: Msg = {
      role: "ai",
      content: followups[locale] ?? followups.en,
      recs: ids,
    };
    setMessages(m => [...m, userMsg, aiMsg]);
    setInput("");
  };


  return (
    <SiteShell>
      <section className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 lg:py-20">
        <div className="text-center">
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
          <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="e.g. Senior PM at a Series B fintech…" className="h-11 border-0 bg-transparent shadow-none focus-visible:ring-0" />
          <Button type="submit" className="rounded-xl"><Send className="h-4 w-4" /></Button>
        </form>
      </section>
    </SiteShell>
  );
}
