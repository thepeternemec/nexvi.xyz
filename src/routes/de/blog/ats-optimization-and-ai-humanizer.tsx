import { createFileRoute } from "@tanstack/react-router";
import { AtsHumanizerPost } from "@/routes/blog/ats-optimization-and-ai-humanizer";

export const Route = createFileRoute("/de/blog/ats-optimization-and-ai-humanizer")({
  head: () => ({
    meta: [{ property: "og:locale", content: "de_DE" }],
    links: [{ rel: "canonical", href: "https://nexvi.xyz/de/blog/ats-optimization-and-ai-humanizer" }],
  }),
  component: AtsHumanizerPost,
});
