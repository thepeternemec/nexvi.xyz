import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { generateText, Output } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

const MODEL = "google/gemini-3-flash-preview";

function gateway() {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("AI service is not configured.");
  return createLovableAiGatewayProvider(key)(MODEL);
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
  score: z.number(),
  verdict: z.string(),
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
    const system =
      "You are a strict ATS (Applicant Tracking System) analyzer. Compare a CV against a job description. Produce a detailed, objective breakdown: overall score, weighted sub-scores (Keyword Match, Skills Alignment, Experience Relevance, Formatting/Parseability, Impact & Metrics), formatting/parseability checks (contact info, standard section headings, bullet usage, date formats, no tables/columns/images, ATS-safe fonts, file-friendly length, action verbs, quantified achievements), keyword coverage with importance and CV frequency, and per-section coverage (Summary, Skills, Experience, Education, Certifications). Base every judgement strictly on the CV text provided; never invent. Always return every field in the schema; use empty arrays or short strings when unsure.";
    const prompt = `JOB DESCRIPTION:\n${data.jobDescription}\n\nCANDIDATE CV:\n${data.cv}\n\nReturn the full structured ATS analysis. The overall score must equal the weighted average of subScores (weights sum to 100). coveragePct = round(matchedCount/totalCount*100).`;
    try {
      const { experimental_output } = await generateText({
        model: gateway(),
        system,
        prompt,
        experimental_output: Output.object({ schema: ATSSchema }),
      });
      return experimental_output;
    } catch {
      // Fallback: ask for plain JSON and parse leniently
      const { text } = await generateText({
        model: gateway(),
        system: system + " Respond ONLY with a single JSON object, no prose, no code fences.",
        prompt,
      });
      const cleaned = text.replace(/```(?:json)?/gi, "").trim();
      const s = cleaned.indexOf("{");
      const e = cleaned.lastIndexOf("}");
      const parsed = JSON.parse(cleaned.slice(s, e + 1));
      return ATSSchema.parse(parsed);
    }
  });
