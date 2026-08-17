import { createFileRoute } from "@tanstack/react-router";
import { PromptsPage } from "@/routes/prompts";

export const Route = createFileRoute("/fr/prompts")({
  head: () => ({ meta: [{ title: "Prompt Library — ApplyWise" }] }),
  validateSearch: (s: Record<string, unknown>) => ({
    q: typeof s.q === "string" ? s.q : undefined,
    category: typeof s.category === "string" ? s.category : undefined,
    pack: typeof s.pack === "string" ? s.pack : undefined,
    sort: (s.sort as string | undefined) ?? undefined,
    price: (s.price as string | undefined) ?? undefined,
    beginner: s.beginner === "1" ? "1" : undefined,
  }),
  component: PromptsPage,
});
