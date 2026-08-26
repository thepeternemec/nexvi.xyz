import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";

export const Route = createFileRoute("/status")({
  head: () => ({
    meta: [
      { title: "System Status — Nexvi" },
      { name: "description", content: "Live availability of Nexvi services: CV generator, cover letters, ATS scoring, Humanizer and prompt library." },
      { property: "og:title", content: "Nexvi System Status" },
      { property: "og:description", content: "Real-time operational status for all Nexvi AI career tools." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://nexvi.xyz/status" },
    ],
    links: [{ rel: "canonical", href: "https://nexvi.xyz/status" }],
  }),
  component: StatusPage,
});

const services = [
  { name: "Website & app", note: "Landing, dashboard and prompt library" },
  { name: "CV Generator", note: "AI tailoring and PDF export" },
  { name: "Cover Letter Generator", note: "AI drafting and export" },
  { name: "ATS Optimizer", note: "Scoring and keyword analysis" },
  { name: "Humanizer", note: "Rewriting engine" },
  { name: "Copilot chat", note: "AI assistant and context-aware answers" },
  { name: "Gemini API", note: "Google generative AI responses" },
  { name: "Supabase", note: "Auth, database and storage" },
  { name: "Stripe payments", note: "Checkout, subscriptions and billing" },
  { name: "Accounts & billing", note: "Sign-in, subscriptions, payments" },
];

export function StatusPage() {
  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
        <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </span>
          All Systems Operational
        </div>
        <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight">System status</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Current availability of every Nexvi service. If something looks wrong on your side, email{" "}
          <a className="underline hover:text-foreground" href="mailto:info@nexvi.xyz">info@nexvi.xyz</a>.
        </p>

        <ul className="mt-8 divide-y divide-border rounded-2xl border border-border/70 bg-card">
          {services.map((s) => (
            <li key={s.name} className="flex items-center justify-between gap-4 px-4 py-4">
              <div>
                <div className="text-sm font-medium">{s.name}</div>
                <div className="text-xs text-muted-foreground">{s.note}</div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Operational
              </span>
            </li>
          ))}
        </ul>
      </div>
    </SiteShell>
  );
}
