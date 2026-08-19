import { createFileRoute } from "@tanstack/react-router";
import { localeHead } from "@/lib/localized-meta";
import { Creators } from "@/routes/creators";




export const Route = createFileRoute("/fr/creators")({
  head: () => localeHead("fr", "creators"),
  component: Creators,
});
