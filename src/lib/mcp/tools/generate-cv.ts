import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { generateText } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

const MODEL = "google/gemini-3-flash-preview";

export default defineTool({
  name: "generate_cv",
  title: "Generate tailored CV",
  description:
    "Generate an ATS-optimized CV in Markdown, tailored to a specific job description using the candidate's background.",
  inputSchema: {
    jobDescription: z
      .string()
      .describe("The full job description text to tailor the CV to."),
    background: z
      .string()
      .describe("Candidate background: experience, skills, education, achievements."),
    tone: z
      .enum(["professional", "confident", "friendly", "concise"])
      .optional()
      .describe("Writing tone. Defaults to professional."),
  },
  annotations: { readOnlyHint: true, openWorldHint: false },
  handler: async ({ jobDescription, background, tone }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) {
      return {
        content: [{ type: "text", text: "AI service is not configured." }],
        isError: true,
      };
    }
    const model = createLovableAiGatewayProvider(key)(MODEL);
    const system =
      "You are an elite resume writer and ATS expert. Produce CVs that are tailored, keyword-optimized for ATS, truthful (never invent facts), and ready to paste into a document. Use clear sections: Summary, Skills, Experience, Education. Use action verbs, quantified results, and mirror the job description's keywords naturally.";
    const prompt = `JOB DESCRIPTION:\n${jobDescription}\n\nCANDIDATE BACKGROUND:\n${background}\n\nTone: ${tone ?? "professional"}.\n\nWrite a complete tailored CV in clean Markdown.`;
    const { text } = await generateText({ model, system, prompt });
    return { content: [{ type: "text", text }] };
  },
});
