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

const ATSSchema = z.object({
  score: z.number().min(0).max(100),
  verdict: z.string().max(300),
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
      "You are a strict ATS (Applicant Tracking System) analyzer. Compare a CV against a job description, extract keywords, judge match quality, and propose concrete improvements. Be objective.";
    const prompt = `JOB DESCRIPTION:\n${data.jobDescription}\n\nCANDIDATE CV:\n${data.cv}\n\nProduce the structured analysis.`;
    const { experimental_output } = await generateText({
      model: gateway(),
      system,
      prompt,
      experimental_output: Output.object({ schema: ATSSchema }),
    });
    return experimental_output;
  });
