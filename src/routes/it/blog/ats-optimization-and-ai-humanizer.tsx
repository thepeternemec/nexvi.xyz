import { createFileRoute } from "@tanstack/react-router";
import { AtsHumanizerPost } from "@/routes/blog/ats-optimization-and-ai-humanizer";

export const Route = createFileRoute("/it/blog/ats-optimization-and-ai-humanizer")({
  head: () => ({
    meta: [{ property: "og:locale", content: "it_IT" }],
    links: [{ rel: "canonical", href: "https://nexvi.xyz/it/blog/ats-optimization-and-ai-humanizer" }],
  }),
  component: AtsHumanizerPost,
});
