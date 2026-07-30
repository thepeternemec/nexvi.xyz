import type { Pack, Prompt } from "@/lib/mock-data";

/**
 * Builds an "Apply-ready" output template: a single block you can paste into
 * ChatGPT or Claude with your job description and CV already scaffolded.
 */
export function buildApplyTemplate(prompt: Prompt): string {
  return [
    `# Apply-ready template — ${prompt.title}`,
    `Goal: ${prompt.outcome}`,
    "",
    "## 1. Your inputs",
    "JOB TITLE: <role you are applying for>",
    "COMPANY: <company name>",
    "JOB DESCRIPTION:",
    "<<<PASTE THE FULL JOB DESCRIPTION HERE>>>",
    "",
    "YOUR CV / BACKGROUND:",
    "<<<PASTE YOUR CV HERE>>>",
    "",
    "## 2. The prompt",
    prompt.body,
    "",
    "## 3. Output format I want back",
    "- A ready-to-send version I can copy straight into my application",
    "- A short list of what you changed and why",
    "- Any facts you need from me, listed as questions at the end",
    "- No markdown bold markers, plain text only",
    "",
    "## 4. Apply checklist",
    ...(prompt.instructions.length
      ? prompt.instructions.map((s, i) => `${i + 1}. ${s}`)
      : ["1. Run the prompt", "2. Review for accuracy", "3. Send the application"]),
  ].join("\n");
}

/** Apply-ready template that chains every prompt in a pack into one workflow. */
export function buildPackTemplate(pack: Pack, items: Prompt[]): string {
  return [
    `# Apply-ready workflow — ${pack.name}`,
    pack.description,
    "",
    "## Shared inputs (fill once, reuse for every step)",
    "JOB TITLE: <role>",
    "COMPANY: <company>",
    "JOB DESCRIPTION:",
    "<<<PASTE THE FULL JOB DESCRIPTION HERE>>>",
    "",
    "YOUR CV / BACKGROUND:",
    "<<<PASTE YOUR CV HERE>>>",
    "",
    ...items.flatMap((p, i) => [
      `## Step ${i + 1} — ${p.title}`,
      `Outcome: ${p.outcome}`,
      p.body,
      "",
    ]),
    "## Finish",
    "Return each step's output separately, plain text, no markdown bold markers.",
    "End with a one-line readiness check: am I ready to submit this application?",
  ].join("\n");
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through */
  }
  try {
    const el = document.createElement("textarea");
    el.value = text;
    el.style.position = "fixed";
    el.style.opacity = "0";
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(el);
    return ok;
  } catch {
    return false;
  }
}

export function downloadText(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
