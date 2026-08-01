export type ToolKey = "cv" | "coverLetter" | "ats" | "humanizer";

export const FREE_LIMITS: Record<ToolKey, number> & { anonymous: number } = {
  cv: 3,
  coverLetter: 3,
  ats: 3,
  humanizer: 3,
  anonymous: 1,
};

export const PREMIUM_LIMITS: Record<ToolKey, number> = {
  cv: Infinity,
  coverLetter: Infinity,
  ats: Infinity,
  humanizer: Infinity,
};

export const TOOL_META: Record<ToolKey, { label: string; plural: string; href: string }> = {
  cv: { label: "CV Generator", plural: "CVs", href: "/cv" },
  coverLetter: { label: "Cover Letter Generator", plural: "Cover Letters", href: "/cover-letter" },
  ats: { label: "ATS Score Checker", plural: "ATS analyses", href: "/ats" },
  humanizer: { label: "AI Humanizer", plural: "Humanizer runs", href: "/humanizer" },
};

export const TOOL_KEYS: ToolKey[] = ["cv", "coverLetter", "ats", "humanizer"];

export const PREMIUM_BENEFITS = [
  "Unlimited CV Generator",
  "Unlimited Cover Letters",
  "Unlimited ATS Scoring",
  "Unlimited AI Humanizer",
  "Faster AI generation",
  "Priority support",
  "Access to future premium features",
];

export function limitFor(tool: ToolKey, plan: "free" | "premium"): number {
  return plan === "premium" ? PREMIUM_LIMITS[tool] : FREE_LIMITS[tool];
}
