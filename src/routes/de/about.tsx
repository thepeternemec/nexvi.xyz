import { createFileRoute } from "@tanstack/react-router";
import { localeHead } from "@/lib/localized-meta";
import { AboutPage } from "@/routes/about";

export const Route = createFileRoute("/de/about")({
  head: () => localeHead("de", "about"),
  component: AboutPage });
