import { createFileRoute } from "@tanstack/react-router";
import { localeHead } from "@/lib/localized-meta";
import { CVPage } from "@/routes/cv";




export const Route = createFileRoute("/it/cv")({
  head: () => localeHead("it", "cv"),
  component: CVPage,
});
