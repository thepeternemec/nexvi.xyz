import { createFileRoute } from "@tanstack/react-router";
import { localeHead } from "@/lib/localized-meta";
import { CVPage } from "@/routes/cv";




export const Route = createFileRoute("/es/cv")({
  head: () => localeHead("es", "cv"),
  component: CVPage,
});
