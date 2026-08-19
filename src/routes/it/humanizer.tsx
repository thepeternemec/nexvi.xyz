import { createFileRoute } from "@tanstack/react-router";
import { localeHead } from "@/lib/localized-meta";
import { HumanizerPage } from "@/routes/humanizer";

export const Route = createFileRoute("/it/humanizer")({
  head: () => localeHead("it", "humanizer"),
  component: HumanizerPage });
