import { createFileRoute } from "@tanstack/react-router";
import { CopilotPost } from "@/routes/blog/nexvi-copilot";

export const Route = createFileRoute("/de/blog/nexvi-copilot")({
  head: () => ({
    meta: [{ property: "og:locale", content: "de_DE" }],
    links: [{ rel: "canonical", href: "https://nexvi.xyz/de/blog/nexvi-copilot" }],
  }),
  component: CopilotPost,
});
