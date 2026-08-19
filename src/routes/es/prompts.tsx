import { createFileRoute } from "@tanstack/react-router";
import { localeHead } from "@/lib/localized-meta";
import { PromptsPage } from "@/routes/prompts";

export const Route = createFileRoute("/es/prompts")({
  head: () => localeHead("es", "prompts"),
  validateSearch: (s: Record<string, unknown>) => ({
    q: typeof s.q === "string" ? s.q : undefined,
    category: typeof s.category === "string" ? s.category : undefined,
    pack: typeof s.pack === "string" ? s.pack : undefined,
    sort: (s.sort as string | undefined) ?? undefined,
    price: (s.price as string | undefined) ?? undefined,
    beginner: s.beginner === "1" || s.beginner === 1 ? 1 : undefined,
  }),
  component: PromptsPage,
});
