import { createFileRoute } from "@tanstack/react-router";
import { localeHead } from "@/lib/localized-meta";
import { Pricing } from "@/routes/pricing";




export const Route = createFileRoute("/fr/pricing")({
  head: () => localeHead("fr", "pricing"),
  component: Pricing,
});
