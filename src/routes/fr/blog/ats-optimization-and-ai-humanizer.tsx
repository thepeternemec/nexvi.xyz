import { createFileRoute } from "@tanstack/react-router";
import { AtsHumanizerPost } from "@/routes/blog/ats-optimization-and-ai-humanizer";

export const Route = createFileRoute("/fr/blog/ats-optimization-and-ai-humanizer")({
  head: () => ({
    meta: [{ property: "og:locale", content: "fr_FR" }],
    links: [{ rel: "canonical", href: "https://nexvi.xyz/fr/blog/ats-optimization-and-ai-humanizer" }],
  }),
  component: AtsHumanizerPost,
});
