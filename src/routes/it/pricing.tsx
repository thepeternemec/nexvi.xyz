import { createFileRoute } from "@tanstack/react-router";
import { localeHead } from "@/lib/localized-meta";
import { Pricing } from "@/routes/pricing";




export const Route = createFileRoute("/it/pricing")({
  head: () => localeHead("it", "pricing"),
  component: Pricing,
});
