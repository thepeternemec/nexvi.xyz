import { createFileRoute, notFound } from "@tanstack/react-router";
import { PromptDetail } from "@/routes/prompt.$slug";
import { getPrompt, type Prompt } from "@/lib/mock-data";
import { promptHead } from "@/lib/localized-meta";

export const Route = createFileRoute("/de/prompt/$slug")({
  component: PromptDetail,
  loader: ({ params }): { prompt: Prompt } => {
    const prompt = getPrompt(params.slug);
    if (!prompt) throw notFound();
    return { prompt };
  },
  head: ({ params, loaderData }) => promptHead("de", params.slug, loaderData?.prompt),
});
