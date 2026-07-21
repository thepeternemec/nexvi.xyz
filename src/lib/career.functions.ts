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
  keyword: z.string().max(80),
  importance: z.enum(["critical", "important", "nice-to-have"]),
  inCV: z.boolean(),
  frequency: z.number().min(0).max(50),
});

const FormattingCheck = z.object({
  name: z.string().max(80),
  passed: z.boolean(),
  detail: z.string().max(240),
});

const SubScore = z.object({
  label: z.string().max(60),
  score: z.number().min(0).max(100),
  weight: z.number().min(0).max(100),
  note: z.string().max(240),
});

const ATSSchema = z.object({
  score: z.number().min(0).max(100),
  verdict: z.string().max(300),
  subScores: z.array(SubScore).max(6),
  keywordCoverage: z.object({
    matchedCount: z.number().min(0).max(200),
    totalCount: z.number().min(0).max(200),
    coveragePct: z.number().min(0).max(100),
    keywords: z.array(KeywordHit).max(40),
  }),
  formattingChecks: z.array(FormattingCheck).max(12),
  sectionCoverage: z.array(z.object({
    section: z.string().max(60),
    present: z.boolean(),
    quality: z.enum(["strong", "adequate", "weak", "missing"]),
    note: z.string().max(240),
  })).max(8),
  matchedKeywords: z.array(z.string().max(80)).max(40),
  missingKeywords: z.array(z.string().max(80)).max(40),
  strengths: z.array(z.string().max(300)).max(10),
  improvements: z.array(z.string().max(400)).max(10),
  rewriteTips: z.array(z.string().max(400)).max(8),
});

export const scoreATS = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => ATSInput.parse(d))
  .handler(async ({ data }) => {
    const system =
      "You are a strict ATS (Applicant Tracking System) analyzer. Compare a CV against a job description. Produce a detailed, objective breakdown: overall score, weighted sub-scores (Keyword Match, Skills Alignment, Experience Relevance, Formatting/Parseability, Impact & Metrics), formatting/parseability checks (contact info, standard section headings, bullet usage, date formats, no tables/columns/images, ATS-safe fonts, file-friendly length, action verbs, quantified achievements), keyword coverage with importance and CV frequency, and per-section coverage (Summary, Skills, Experience, Education, Certifications). Base every judgement strictly on the CV text provided; never invent.";
    const prompt = `JOB DESCRIPTION:\n${data.jobDescription}\n\nCANDIDATE CV:\n${data.cv}\n\nReturn the full structured ATS analysis. The overall score must equal the weighted average of subScores (weights sum to 100). coveragePct = round(matchedCount/totalCount*100).`;
    const { experimental_output } = await generateText({
      model: gateway(),
      system,
      prompt,
      experimental_output: Output.object({ schema: ATSSchema }),
    });
    return experimental_output;
  });
