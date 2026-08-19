import { createFileRoute } from "@tanstack/react-router";
import { localeHead } from "@/lib/localized-meta";
import { Creators } from "@/routes/creators";




export const Route = createFileRoute("/de/creators")({
  head: () => localeHead("de", "creators"),
  component: Creators,
});
