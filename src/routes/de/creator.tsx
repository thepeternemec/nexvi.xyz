import { createFileRoute } from "@tanstack/react-router";
import { localeHead } from "@/lib/localized-meta";
import { Creator } from "@/routes/creator";




export const Route = createFileRoute("/de/creator")({
  head: () => localeHead("de", "creator"),
  component: Creator,
});
