import { createFileRoute } from "@tanstack/react-router";
import { PromptDetail } from "@/routes/prompt.$slug";
import { getPrompt } from "@/lib/mock-data";
import { notFound } from "@tanstack/react-router";



export const Route = createFileRoute("/de/prompt/$slug")({
  head: () => ({ meta: [{ title: "Prompt — ApplyWise" }] }),
  loader: ({ params }) => {
    const prompt = getPrompt(params.slug);
    if (!prompt) throw notFound();
    return { prompt };
  },
  component: PromptDetail,
});
