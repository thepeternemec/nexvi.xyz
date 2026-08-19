import { createFileRoute } from "@tanstack/react-router";
import { localeHead } from "@/lib/localized-meta";
import { TermsPage } from "@/routes/terms";

export const Route = createFileRoute("/fr/terms")({
  head: () => localeHead("fr", "terms"),
  component: TermsPage });
