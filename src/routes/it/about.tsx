import { createFileRoute } from "@tanstack/react-router";
import { localeHead } from "@/lib/localized-meta";
import { AboutPage } from "@/routes/about";

export const Route = createFileRoute("/it/about")({
  head: () => localeHead("it", "about"),
  component: AboutPage });
