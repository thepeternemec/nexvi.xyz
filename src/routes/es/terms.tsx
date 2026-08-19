import { createFileRoute } from "@tanstack/react-router";
import { localeHead } from "@/lib/localized-meta";
import { TermsPage } from "@/routes/terms";

export const Route = createFileRoute("/es/terms")({
  head: () => localeHead("es", "terms"),
  component: TermsPage });
