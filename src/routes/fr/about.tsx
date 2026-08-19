import { createFileRoute } from "@tanstack/react-router";
import { localeHead } from "@/lib/localized-meta";
import { AboutPage } from "@/routes/about";

export const Route = createFileRoute("/fr/about")({
  head: () => localeHead("fr", "about"),
  component: AboutPage });
