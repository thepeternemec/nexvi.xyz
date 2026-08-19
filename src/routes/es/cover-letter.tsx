import { createFileRoute } from "@tanstack/react-router";
import { localeHead } from "@/lib/localized-meta";
import { CoverLetterPage } from "@/routes/cover-letter";




export const Route = createFileRoute("/es/cover-letter")({
  head: () => localeHead("es", "cover-letter"),
  component: CoverLetterPage,
});
