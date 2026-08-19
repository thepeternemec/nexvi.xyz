import { createFileRoute } from "@tanstack/react-router";
import { localeHead } from "@/lib/localized-meta";
import { ATSPage } from "@/routes/ats";




export const Route = createFileRoute("/it/ats")({
  head: () => localeHead("it", "ats"),
  component: ATSPage,
});
