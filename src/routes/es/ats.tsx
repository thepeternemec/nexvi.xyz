import { createFileRoute } from "@tanstack/react-router";
import { localeHead } from "@/lib/localized-meta";
import { ATSPage } from "@/routes/ats";




export const Route = createFileRoute("/es/ats")({
  head: () => localeHead("es", "ats"),
  component: ATSPage,
});
