import { FileText, Mail, Sparkles, Gauge, Library, type LucideIcon } from "lucide-react";
import type { ToolKey } from "@/lib/plan-limits";

export type ChatMode = "cv" | "coverLetter" | "ats" | "humanizer" | "prompts";

export type ModeMeta = {
  id: ChatMode;
  label: string;
  short: string;
  blurb: string;
  icon: LucideIcon;
  placeholder: string;
  tool: ToolKey | null;
  /** Context fields this mode needs before it can run. */
  needs: Array<"jobDescription" | "background" | "text">;
  page: string;
  starters: string[];
};

export const CHAT_MODES: ModeMeta[] = [
  {
    id: "cv",
    label: "CV Generator",
    short: "CV",
    blurb: "A tailored, ATS-ready CV for one specific role.",
    icon: FileText,
    placeholder: "Tell me anything extra — target seniority, what to emphasise…",
    tool: "cv",
    needs: ["jobDescription", "background"],
    page: "/cv",
    starters: [
      "Emphasise leadership and measurable impact",
      "Keep it to one page, senior tone",
      "Highlight my transferable skills for a career switch",
    ],
  },
  {
    id: "coverLetter",
    label: "Cover Letter",
    short: "Letter",
    blurb: "A short, specific letter written for this job — not for everyone.",
    icon: Mail,
    placeholder: "Anything to mention? Company, hook, tone…",
    tool: "coverLetter",
    needs: ["jobDescription", "background"],
    page: "/cover-letter",
    starters: [
      "Warm tone, mention why I admire the company",
      "Concise and direct — under 250 words",
      "Enthusiastic, first-time applicant in this industry",
    ],
  },
  {
    id: "ats",
    label: "ATS Optimizer",
    short: "ATS",
    blurb: "See your match score, keyword coverage and formatting checks.",
    icon: Gauge,
    placeholder: "Optional: what should I look at closely?",
    tool: "ats",
    needs: ["jobDescription", "background"],
    page: "/ats",
    starters: [
      "Score my CV against this job",
      "Which critical keywords am I missing?",
      "Is my formatting ATS-safe?",
    ],
  },
  {
    id: "humanizer",
    label: "Humanizer",
    short: "Humanize",
    blurb: "Rewrite AI-sounding text so it reads like a person wrote it.",
    icon: Sparkles,
    placeholder: "Paste the text you want humanized…",
    tool: "humanizer",
    needs: ["text"],
    page: "/humanizer",
    starters: [
      "Humanize this cover letter draft",
      "Make this summary sound less like ChatGPT",
      "Light edit only — keep my voice",
    ],
  },
  {
    id: "prompts",
    label: "Prompt Library",
    short: "Prompts",
    blurb: "Find the right job-search prompt for what you're stuck on.",
    icon: Library,
    placeholder: "What are you stuck on? e.g. salary negotiation…",
    tool: null,
    needs: [],
    page: "/library",
    starters: [
      "Prep me for behavioral interviews",
      "Help me negotiate a counter-offer",
      "I'm switching careers — how do I reposition?",
    ],
  },
];

export function modeMeta(mode: ChatMode): ModeMeta {
  return CHAT_MODES.find((m) => m.id === mode) ?? CHAT_MODES[0];
}

export function isChatMode(value: string | null | undefined): value is ChatMode {
  return !!value && CHAT_MODES.some((m) => m.id === value);
}
