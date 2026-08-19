import { createFileRoute } from "@tanstack/react-router";
import { localeHead } from "@/lib/localized-meta";
import { AboutPage } from "@/routes/about";

export const Route = createFileRoute("/es/about")({
  head: () => localeHead("es", "about"),
  component: AboutPage });
