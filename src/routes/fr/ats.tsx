import { createFileRoute } from "@tanstack/react-router";
import { localeHead } from "@/lib/localized-meta";
import { ATSPage } from "@/routes/ats";




export const Route = createFileRoute("/fr/ats")({
  head: () => localeHead("fr", "ats"),
  component: ATSPage,
});
