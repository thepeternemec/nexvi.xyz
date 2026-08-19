import { createFileRoute } from "@tanstack/react-router";
import { localeHead } from "@/lib/localized-meta";
import { Dashboard } from "@/routes/dashboard";

export const Route = createFileRoute("/es/dashboard")({
  head: () => localeHead("es", "dashboard"),
  component: Dashboard });
