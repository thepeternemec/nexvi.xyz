import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  fileName: z.string().min(1).max(300),
  mimeType: z.string().min(1).max(200),
  dataBase64: z.string().min(10).max(14_000_000),
});

/**
 * Extracts plain resume text out of a PDF (or image) upload using the
 * Lovable AI gateway. Plain-text files are read in the browser instead.
 */
export const extractResumeText = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => Input.parse(d))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("AI service is not configured.");

    const isImage = data.mimeType.startsWith("image/");
    const block = isImage
      ? {
          type: "image_url",
          image_url: { url: `data:${data.mimeType};base64,${data.dataBase64}` },
        }
      : {
          type: "file",
          file: {
            filename: data.fileName,
            file_data: `data:${data.mimeType};base64,${data.dataBase64}`,
          },
        };

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Lovable-API-Key": key },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content:
              "You extract resume/CV content from documents. Return the full text as clean Markdown, preserving sections, roles, dates and bullet points. Never invent information. Output only the resume text.",
          },
          {
            role: "user",
            content: [{ type: "text", text: "Extract the full resume text from this file." }, block],
          },
        ],
      }),
    });

    if (!res.ok) {
      const status = res.status;
      if (status === 402) throw new Error("402: AI credits exhausted.");
      if (status === 429) throw new Error("429: Rate limited — try again shortly.");
      throw new Error(`Could not read that file (${status}). Try a PDF or paste the text instead.`);
    }

    const json = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const text = (json.choices?.[0]?.message?.content ?? "").trim();
    if (!text) throw new Error("No text found in that file. Try another export or paste the text.");
    return { text };
  });
