import { createFileRoute } from "@tanstack/react-router";
import { ResumeGuidePage } from "@/routes/blog/how-to-write-a-resume";

export const Route = createFileRoute("/de/blog/how-to-write-a-resume")({
  head: () => ({
    meta: [{ property: "og:locale", content: "de_DE" }],
    links: [{ rel: "canonical", href: "https://nexvi.xyz/de/blog/how-to-write-a-resume" }],
  }),
  component: ResumeGuidePage,
});
