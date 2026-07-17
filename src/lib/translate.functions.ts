import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createHash } from "crypto";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";
import { locales, type Locale } from "./i18n";

const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  de: "German",
  es: "Spanish",
  it: "Italian",
  fr: "French",
};

function hashText(text: string) {
  return createHash("sha1").update(text).digest("hex");
}

const InputSchema = z.object({
  texts: z.array(z.string()).min(1).max(200),
  targetLocale: z.enum(locales as [Locale, ...Locale[]]),
});

export const translateBatch = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }) => {
    const { texts, targetLocale } = data;
    if (targetLocale === "en") {
      const out: Record<string, string> = {};
      for (const t of texts) out[t] = t;
      return { translations: out };
    }

    // Dedupe
    const unique = Array.from(new Set(texts.map((t) => t.trim()).filter(Boolean)));
    if (unique.length === 0) return { translations: {} };

    const result: Record<string, string> = {};

    // Load cache
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const hashes = unique.map(hashText);
      const { data: cached } = await supabaseAdmin
        .from("translations_cache")
        .select("hash, source, translated")
        .eq("locale", targetLocale)
        .in("hash", hashes);
      if (cached) {
        for (const row of cached) {
          result[row.source] = row.translated;
        }
      }
    } catch (e) {
      console.error("translation cache read failed", e);
    }

    const missing = unique.filter((t) => !(t in result));

    if (missing.length > 0) {
      const key = process.env.LOVABLE_API_KEY;
      if (!key) throw new Error("Missing LOVABLE_API_KEY");
      const gateway = createLovableAiGatewayProvider(key);
      const model = gateway("google/gemini-3-flash-preview");

      // Chunk to keep prompts small
      const chunkSize = 40;
      for (let i = 0; i < missing.length; i += chunkSize) {
        const chunk = missing.slice(i, i + chunkSize);
        const prompt = [
          `You are a professional translator. Translate each of the following UI strings from English to ${LOCALE_NAMES[targetLocale]}.`,
          "Rules:",
          "- Return ONLY a JSON array of strings, same length and order as the input. No prose, no code fences.",
          "- Preserve punctuation, capitalization style, emojis, and placeholders like {name} or %s exactly.",
          "- Do NOT translate: brand names (ApplyWise, Lovable, ChatGPT, Claude, Gemini, ATS, CV, PM, HR, AI, MCP), URLs, or code.",
          "- Keep translations concise and natural; match a product marketing / SaaS UI tone.",
          "",
          `Inputs (JSON array of ${chunk.length} strings):`,
          JSON.stringify(chunk),
          "",
          `Output: a JSON array of exactly ${chunk.length} ${LOCALE_NAMES[targetLocale]} strings.`,
        ].join("\n");

        try {
          const { text } = await generateText({ model, prompt });
          // Parse the JSON array from the model output (strip any code fences)
          const cleaned = text
            .trim()
            .replace(/^```(?:json)?/i, "")
            .replace(/```$/i, "")
            .trim();
          let translations: string[] = [];
          try {
            const parsed = JSON.parse(cleaned);
            if (Array.isArray(parsed)) translations = parsed.map((v) => String(v));
          } catch {
            // Try to extract the first JSON array substring
            const m = cleaned.match(/\[[\s\S]*\]/);
            if (m) {
              try {
                const parsed = JSON.parse(m[0]);
                if (Array.isArray(parsed)) translations = parsed.map((v) => String(v));
              } catch {
                /* ignore */
              }
            }
          }
          const rows: {
            hash: string;
            locale: string;
            source: string;
            translated: string;
          }[] = [];
          for (let j = 0; j < chunk.length; j++) {
            const src = chunk[j];
            const tr = translations[j] && translations[j].trim().length > 0 ? translations[j] : src;
            result[src] = tr;
            rows.push({ hash: hashText(src), locale: targetLocale, source: src, translated: tr });
          }
          try {
            const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
            await supabaseAdmin.from("translations_cache").upsert(rows, { onConflict: "hash,locale" });
          } catch (e) {
            console.error("translation cache write failed", e);
          }
        } catch (e) {
          console.error("translation call failed", e);
          for (const src of chunk) if (!(src in result)) result[src] = src;
        }
      }
    }

    // Return mapping for every requested (original) text
    const out: Record<string, string> = {};
    for (const t of texts) {
      const trimmed = t.trim();
      out[t] = result[trimmed] ?? t;
    }
    return { translations: out };
  });
