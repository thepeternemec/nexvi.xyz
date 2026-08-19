import { createFileRoute } from "@tanstack/react-router";
import { localeHead } from "@/lib/localized-meta";
import { HumanizerPage } from "@/routes/humanizer";

export const Route = createFileRoute("/es/humanizer")({
  head: () => localeHead("es", "humanizer"),
  component: HumanizerPage });
