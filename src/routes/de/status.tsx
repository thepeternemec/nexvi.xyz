import { createFileRoute } from "@tanstack/react-router";
import { localeHead } from "@/lib/localized-meta";
import { StatusPage } from "@/routes/status";

export const Route = createFileRoute("/de/status")({
  head: () => localeHead("de", "status"),
  component: StatusPage });
