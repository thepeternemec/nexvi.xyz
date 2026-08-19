import { createFileRoute } from "@tanstack/react-router";
import { localeHead } from "@/lib/localized-meta";
import { CoverLetterPage } from "@/routes/cover-letter";




export const Route = createFileRoute("/fr/cover-letter")({
  head: () => localeHead("fr", "cover-letter"),
  component: CoverLetterPage,
});
