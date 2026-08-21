import { createFileRoute } from "@tanstack/react-router";
import { CopilotPost } from "@/routes/blog/nexvi-copilot";

export const Route = createFileRoute("/fr/blog/nexvi-copilot")({
  head: () => ({
    meta: [{ property: "og:locale", content: "fr_FR" }],
    links: [{ rel: "canonical", href: "https://nexvi.xyz/fr/blog/nexvi-copilot" }],
  }),
  component: CopilotPost,
});
