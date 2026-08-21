import { createFileRoute } from "@tanstack/react-router";
import { CopilotPost } from "@/routes/blog/nexvi-copilot";

export const Route = createFileRoute("/it/blog/nexvi-copilot")({
  head: () => ({
    meta: [{ property: "og:locale", content: "it_IT" }],
    links: [{ rel: "canonical", href: "https://nexvi.xyz/it/blog/nexvi-copilot" }],
  }),
  component: CopilotPost,
});
