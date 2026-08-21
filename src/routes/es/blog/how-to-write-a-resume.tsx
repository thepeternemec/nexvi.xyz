import { createFileRoute } from "@tanstack/react-router";
import { ResumeGuidePage } from "@/routes/blog/how-to-write-a-resume";

export const Route = createFileRoute("/es/blog/how-to-write-a-resume")({
  head: () => ({
    meta: [{ property: "og:locale", content: "es_ES" }],
    links: [{ rel: "canonical", href: "https://nexvi.xyz/es/blog/how-to-write-a-resume" }],
  }),
  component: ResumeGuidePage,
});
