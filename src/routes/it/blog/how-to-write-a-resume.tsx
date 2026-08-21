import { createFileRoute } from "@tanstack/react-router";
import { ResumeGuidePage } from "@/routes/blog/how-to-write-a-resume";

export const Route = createFileRoute("/it/blog/how-to-write-a-resume")({
  head: () => ({
    meta: [{ property: "og:locale", content: "it_IT" }],
    links: [{ rel: "canonical", href: "https://nexvi.xyz/it/blog/how-to-write-a-resume" }],
  }),
  component: ResumeGuidePage,
});
