import { createFileRoute, notFound } from "@tanstack/react-router";
import { PromptDetail } from "@/routes/prompt.$slug";
import { getPrompt } from "@/lib/mock-data";
import { promptHead } from "@/lib/localized-meta";

export const Route = createFileRoute("/it/prompt/$slug")({
  head: ({ params, loaderData }) => promptHead("it", params.slug, loaderData?.prompt),
  loader: ({ params }) => {
    const prompt = getPrompt(params.slug);
    if (!prompt) throw notFound();
    return { prompt };
  },
  component: PromptDetail,
});
