import { createFileRoute } from "@tanstack/react-router";
import { localeHead } from "@/lib/localized-meta";
import { StatusPage } from "@/routes/status";

export const Route = createFileRoute("/it/status")({
  head: () => localeHead("it", "status"),
  component: StatusPage });
