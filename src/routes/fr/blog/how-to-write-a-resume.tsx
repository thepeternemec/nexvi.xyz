import { createFileRoute } from "@tanstack/react-router";
import { ResumeGuidePage } from "@/routes/blog/how-to-write-a-resume";

export const Route = createFileRoute("/fr/blog/how-to-write-a-resume")({
  head: () => ({
    meta: [{ property: "og:locale", content: "fr_FR" }],
    links: [{ rel: "canonical", href: "https://nexvi.xyz/fr/blog/how-to-write-a-resume" }],
  }),
  component: ResumeGuidePage,
});
