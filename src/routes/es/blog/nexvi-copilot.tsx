import { createFileRoute } from "@tanstack/react-router";
import { CopilotPost } from "@/routes/blog/nexvi-copilot";

export const Route = createFileRoute("/es/blog/nexvi-copilot")({
  head: () => ({
    meta: [{ property: "og:locale", content: "es_ES" }],
    links: [{ rel: "canonical", href: "https://nexvi.xyz/es/blog/nexvi-copilot" }],
  }),
  component: CopilotPost,
});
