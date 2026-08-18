import { createFileRoute } from "@tanstack/react-router";
import { CoverLetterPage } from "@/routes/cover-letter";




export const Route = createFileRoute("/de/cover-letter")({
  head: () => ({ meta: [{ title: "Cover Letter Generator — Nexvi" }] }),

  component: CoverLetterPage,
});
