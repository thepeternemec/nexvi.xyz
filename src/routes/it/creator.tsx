import { createFileRoute } from "@tanstack/react-router";
import { localeHead } from "@/lib/localized-meta";
import { Creator } from "@/routes/creator";




export const Route = createFileRoute("/it/creator")({
  head: () => localeHead("it", "creator"),
  component: Creator,
});
