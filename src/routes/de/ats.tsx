import { createFileRoute } from "@tanstack/react-router";
import { localeHead } from "@/lib/localized-meta";
import { ATSPage } from "@/routes/ats";




export const Route = createFileRoute("/de/ats")({
  head: () => localeHead("de", "ats"),
  component: ATSPage,
});
