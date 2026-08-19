import { createFileRoute } from "@tanstack/react-router";
import { localeHead } from "@/lib/localized-meta";
import { Dashboard } from "@/routes/dashboard";

export const Route = createFileRoute("/it/dashboard")({
  head: () => localeHead("it", "dashboard"),
  component: Dashboard });
