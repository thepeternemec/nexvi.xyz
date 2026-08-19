import { createFileRoute } from "@tanstack/react-router";
import { localeHead } from "@/lib/localized-meta";
import { CoverLetterPage } from "@/routes/cover-letter";




export const Route = createFileRoute("/it/cover-letter")({
  head: () => localeHead("it", "cover-letter"),
  component: CoverLetterPage,
});
