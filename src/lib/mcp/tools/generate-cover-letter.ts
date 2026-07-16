import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { generateText } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

const MODEL = "google/gemini-3-flash-preview";

export default defineTool({
  name: "generate_cover_letter",
  title: "Generate cover letter",
  description:
    "Generate a concise, tailored cover letter in Markdown for a specific role and company using the candidate's background.",
  inputSchema: {
    jobDescription: z.string().describe("The full job description text."),
    background: z.string().describe("Candidate background: experience, skills, achievements."),
    companyName: z.string().optional().describe("Company name."),
    roleTitle: z.string().optional().describe("Role title."),
    tone: z
      .enum(["professional", "enthusiastic", "warm", "concise"])
      .optional()
      .describe("Writing tone. Defaults to professional."),
  },
  annotations: { readOnlyHint: true, openWorldHint: false },
  handler: async ({ jobDescription, background, companyName, roleTitle, tone }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) {
      return {
        content: [{ type: "text", text: "AI service is not configured." }],
        isError: true,
      };
    }
    const model = createLovableAiGatewayProvider(key)(MODEL);
    const system =
      "You are an expert cover letter writer. Produce concise, specific, personable cover letters that connect the candidate's real experience to the job's needs. Never fabricate. 250-350 words. Markdown.";
    const prompt = `COMPANY: ${companyName ?? "(not provided)"}\nROLE: ${roleTitle ?? "(not provided)"}\nTONE: ${tone ?? "professional"}\n\nJOB DESCRIPTION:\n${jobDescription}\n\nCANDIDATE BACKGROUND:\n${background}\n\nWrite the cover letter.`;
    const { text } = await generateText({ model, system, prompt });
    return { content: [{ type: "text", text }] };
  },
});
