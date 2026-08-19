import { createFileRoute } from "@tanstack/react-router";
import { localeHead } from "@/lib/localized-meta";
import { CVPage } from "@/routes/cv";




export const Route = createFileRoute("/de/cv")({
  head: () => localeHead("de", "cv"),
  component: CVPage,
});
