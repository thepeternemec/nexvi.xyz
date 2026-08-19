import { createFileRoute } from "@tanstack/react-router";
import { localeHead } from "@/lib/localized-meta";
import { Creators } from "@/routes/creators";




export const Route = createFileRoute("/it/creators")({
  head: () => localeHead("it", "creators"),
  component: Creators,
});
