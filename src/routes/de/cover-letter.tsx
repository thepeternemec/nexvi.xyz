import { createFileRoute } from "@tanstack/react-router";
import { localeHead } from "@/lib/localized-meta";
import { CoverLetterPage } from "@/routes/cover-letter";




export const Route = createFileRoute("/de/cover-letter")({
  head: () => localeHead("de", "cover-letter"),
  component: CoverLetterPage,
});
