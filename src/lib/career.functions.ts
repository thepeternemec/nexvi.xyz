import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { generateText, Output } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { consumeAiCredit } from "@/lib/ai-guard.server";

const MODEL = "google/gemini-3-flash-preview";

function gateway() {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("AI service is not configured.");
  return createLovableAiGatewayProvider(key)(MODEL);
}

/**
 * Turns AI gateway transport errors into short, user-safe messages so the UI
 * shows a toast instead of an unhandled runtime error / blank screen.
 * 402 = workspace AI credits exhausted, 429 = rate limited.
 */
async function runAi<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    const status = (err as { statusCode?: number; status?: number } | null)?.statusCode
      ?? (err as { status?: number } | null)?.status;
    const raw = err instanceof Error ? err.message : String(err);
    if (status === 402 || /payment required/i.test(raw)) {
      throw new Error("402: AI credits exhausted. Please add credits to continue generating.");
    }
    if (status === 429 || /too many requests|rate limit/i.test(raw)) {
      throw new Error("429: Rate limited — please try again in a moment.");
    }
    throw new Error(raw || "AI request failed. Please try again.");
  }
}


/* ---------- CV ---------- */
const CVInput = z.object({
  jobDescription: z.string().min(20).max(15000),
  background: z.string().min(20).max(15000),
  tone: z.enum(["professional", "confident", "friendly", "concise"]).optional(),
});

export const generateCV = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => CVInput.parse(d))
  .handler(async ({ data }) => {
    await consumeAiCredit("cv");
    const system =
      "You are an elite resume writer and ATS expert. Produce CVs that are tailored, keyword-optimized for ATS, truthful (never invent facts), and ready to paste into a document. Use clear sections: Summary, Skills, Experience, Education. Use action verbs, quantified results, and mirror the job description's keywords naturally.";
    const prompt = `JOB DESCRIPTION:\n${data.jobDescription}\n\nCANDIDATE BACKGROUND:\n${data.background}\n\nTone: ${data.tone ?? "professional"}.\n\nWrite a complete tailored CV in clean Markdown. Start with the candidate name placeholder if not given. Keep to one page worth.`;
    const { text } = await generateText({ model: gateway(), system, prompt });
    return { text };
  });

/* ---------- Cover Letter ---------- */
const CoverInput = z.object({
  jobDescription: z.string().min(20).max(15000),
  background: z.string().min(20).max(15000),
  companyName: z.string().max(200).optional(),
  roleTitle: z.string().max(200).optional(),
  tone: z.enum(["professional", "enthusiastic", "warm", "concise"]).optional(),
});

export const generateCoverLetter = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => CoverInput.parse(d))
  .handler(async ({ data }) => {
    await consumeAiCredit("coverLetter");
    const system =
      "You are an expert cover letter writer. Produce concise, specific, personable cover letters that connect the candidate's real experience to the job's needs. Never fabricate. 250-350 words. Markdown.";
    const prompt = `COMPANY: ${data.companyName ?? "(not provided)"}\nROLE: ${data.roleTitle ?? "(not provided)"}\nTONE: ${data.tone ?? "professional"}\n\nJOB DESCRIPTION:\n${data.jobDescription}\n\nCANDIDATE BACKGROUND:\n${data.background}\n\nWrite the cover letter.`;
    const { text } = await generateText({ model: gateway(), system, prompt });
    return { text };
  });

/* ---------- ATS Score ---------- */
const ATSInput = z.object({
  jobDescription: z.string().min(20).max(15000),
  cv: z.string().min(20).max(15000),
});

const KeywordHit = z.object({
  keyword: z.string(),
  importance: z.enum(["critical", "important", "nice-to-have"]).catch("important"),
  inCV: z.boolean().catch(false),
  frequency: z.number().catch(0),
});

const FormattingCheck = z.object({
  name: z.string(),
  passed: z.boolean().catch(false),
  detail: z.string().catch(""),
});

const SubScore = z.object({
  label: z.string(),
  score: z.number().catch(0),
  weight: z.number().catch(0),
  note: z.string().catch(""),
});

const ATSSchema = z.object({
  score: z.number().catch(0),
  verdict: z.string().catch(""),
  subScores: z.array(SubScore).catch([]),
  keywordCoverage: z.object({
    matchedCount: z.number().catch(0),
    totalCount: z.number().catch(0),
    coveragePct: z.number().catch(0),
    keywords: z.array(KeywordHit).catch([]),
  }).catch({ matchedCount: 0, totalCount: 0, coveragePct: 0, keywords: [] }),
  formattingChecks: z.array(FormattingCheck).catch([]),
  sectionCoverage: z.array(z.object({
    section: z.string(),
    present: z.boolean().catch(false),
    quality: z.enum(["strong", "adequate", "weak", "missing"]).catch("adequate"),
    note: z.string().catch(""),
  })).catch([]),
  matchedKeywords: z.array(z.string()).catch([]),
  missingKeywords: z.array(z.string()).catch([]),
  strengths: z.array(z.string()).catch([]),
  improvements: z.array(z.string()).catch([]),
  rewriteTips: z.array(z.string()).catch([]),
});

export const scoreATS = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => ATSInput.parse(d))
  .handler(async ({ data }) => {
    await consumeAiCredit("ats");
    const system =
      "You are a strict ATS (Applicant Tracking System) analyzer. Compare a CV against a job description and produce a detailed, objective breakdown. Base every judgement strictly on the CV text provided; never invent. Respond with ONE JSON object only (no prose, no markdown code fences). The JSON must have these keys: score (0-100), verdict (short string), subScores (array of {label, score, weight, note} for Keyword Match, Skills Alignment, Experience Relevance, Formatting/Parseability, Impact & Metrics; weights sum to 100), keywordCoverage {matchedCount, totalCount, coveragePct, keywords: [{keyword, importance:'critical'|'important'|'nice-to-have', inCV, frequency}]}, formattingChecks [{name, passed, detail}] (contact info, standard section headings, bullet usage, date formats, no tables/columns/images, ATS-safe fonts, length, action verbs, quantified achievements), sectionCoverage [{section, present, quality:'strong'|'adequate'|'weak'|'missing', note}] for Summary/Skills/Experience/Education/Certifications, matchedKeywords[], missingKeywords[], strengths[], improvements[], rewriteTips[]. score must equal weighted average of subScores. coveragePct = round(matchedCount/totalCount*100).";
    const prompt = `JOB DESCRIPTION:\n${data.jobDescription}\n\nCANDIDATE CV:\n${data.cv}`;
    const { text } = await generateText({ model: gateway(), system, prompt });
    const cleaned = text.replace(/```(?:json)?/gi, "").replace(/```/g, "").trim();
    const s = cleaned.indexOf("{");
    const e = cleaned.lastIndexOf("}");
    if (s === -1 || e === -1) throw new Error("AI did not return JSON. Try again.");
    let parsed: unknown;
    try {
      parsed = JSON.parse(cleaned.slice(s, e + 1));
    } catch {
      throw new Error("Could not parse AI response. Try again.");
    }
    return ATSSchema.parse(parsed);
  });

/* ---------- Humanizer ---------- */
const HumanizeInput = z.object({
  text: z.string().min(10).max(20000),
  strength: z.enum(["light", "balanced", "strong"]).optional(),
});

export const humanizeText = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => HumanizeInput.parse(d))
  .handler(async ({ data }) => {
    await consumeAiCredit("humanizer");
    const system =
      "You are the Humanizer editor, based on Wikipedia's 'Signs of AI writing' guide. Rewrite the given text so it no longer reads as AI-generated, while preserving every factual claim. Rules: (1) Cut inflated symbolism, promotional adjectives ('vibrant', 'rich', 'seamless', 'transformative'), and hollow -ing analyses ('underscoring', 'highlighting', 'reflecting'). (2) Remove vague attributions ('many experts say', 'it is widely believed'). (3) Kill em dash overuse — replace with commas, periods, or parentheses where natural. (4) Break the rule-of-three cadence; vary list length. (5) Avoid AI vocabulary: delve, tapestry, testament, navigate, landscape, realm, robust, leverage, crucial, pivotal, foster, underscore, moreover, furthermore, in conclusion, in today's world. (6) Prefer active voice. (7) Drop negative parallelisms ('not just X but Y'). (8) Cut filler ('it is important to note', 'it's worth mentioning'). (9) Vary sentence length — mix short and long. (10) Preserve information, not shape: merge/split paragraphs freely. Output ONLY the rewritten text, no preamble, no explanation, no markdown fences.";
    const strength = data.strength ?? "balanced";
    const prompt = `Editing strength: ${strength}. ${strength === "light" ? "Make minimal surface changes." : strength === "strong" ? "Aggressively rewrite phrasing and cadence." : "Balance faithfulness with natural rewriting."}\n\nTEXT TO HUMANIZE:\n${data.text}`;
    const { text } = await generateText({ model: gateway(), system, prompt });
    return { text: text.replace(/```[a-z]*\n?/gi, "").replace(/```/g, "").trim() };
  });
