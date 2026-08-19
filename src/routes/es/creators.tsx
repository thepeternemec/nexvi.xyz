import { createFileRoute } from "@tanstack/react-router";
import { localeHead } from "@/lib/localized-meta";
import { Creators } from "@/routes/creators";




export const Route = createFileRoute("/es/creators")({
  head: () => localeHead("es", "creators"),
  component: Creators,
});
