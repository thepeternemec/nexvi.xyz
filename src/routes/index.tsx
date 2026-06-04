import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/landing-page";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "getHeired — AI CVs, Cover Letters & ATS Optimization" },
      { name: "description", content: "Paste a job description. Get an ATS-optimized CV, tailored cover letter, and a match score with concrete fixes — in 60 seconds." },
      { property: "og:title", content: "getHeired — Land your next job with AI" },
      { property: "og:description", content: "Tailored CVs, cover letters, and ATS scoring for every job description." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: LandingPage,
});
