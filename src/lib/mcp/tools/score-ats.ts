import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { generateText, Output } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

const MODEL = "google/gemini-3-flash-preview";

const ATSSchema = z.object({
  score: z.number(),
  verdict: z.string(),
  matchedKeywords: z.array(z.string()),
  missingKeywords: z.array(z.string()),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  rewriteTips: z.array(z.string()),
});

export default defineTool({
  name: "score_ats",
  title: "Score CV against job (ATS)",
  description:
    "Analyze a CV against a job description and return an ATS match score (0-100), matched/missing keywords, strengths, and concrete improvements.",
  inputSchema: {
    jobDescription: z.string().describe("The full job description text."),
    cv: z.string().describe("The candidate's CV text (plain text or Markdown)."),
  },
  annotations: { readOnlyHint: true, openWorldHint: false },
  handler: async ({ jobDescription, cv }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) {
      return {
        content: [{ type: "text", text: "AI service is not configured." }],
        isError: true,
      };
    }
    const model = createLovableAiGatewayProvider(key)(MODEL);
    const system =
      "You are a strict ATS analyzer. Compare a CV against a job description, extract keywords, judge match quality, and propose concrete improvements. Be objective.";
    const prompt = `JOB DESCRIPTION:\n${jobDescription}\n\nCANDIDATE CV:\n${cv}\n\nProduce the structured analysis. Score is 0-100.`;
    const { experimental_output } = await generateText({
      model,
      system,
      prompt,
      experimental_output: Output.object({ schema: ATSSchema }),
    });
    return {
      content: [{ type: "text", text: JSON.stringify(experimental_output, null, 2) }],
      structuredContent: experimental_output,
    };
  },
});
