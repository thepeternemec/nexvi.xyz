import { createFileRoute } from "@tanstack/react-router";
import { localeHead } from "@/lib/localized-meta";
import { HumanizerPage } from "@/routes/humanizer";

export const Route = createFileRoute("/de/humanizer")({
  head: () => localeHead("de", "humanizer"),
  component: HumanizerPage });
