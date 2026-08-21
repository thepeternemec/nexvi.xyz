import { createFileRoute } from "@tanstack/react-router";
import { AtsHumanizerPost } from "@/routes/blog/ats-optimization-and-ai-humanizer";

export const Route = createFileRoute("/es/blog/ats-optimization-and-ai-humanizer")({
  head: () => ({
    meta: [{ property: "og:locale", content: "es_ES" }],
    links: [{ rel: "canonical", href: "https://nexvi.xyz/es/blog/ats-optimization-and-ai-humanizer" }],
  }),
  component: AtsHumanizerPost,
});
