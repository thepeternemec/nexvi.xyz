import { createFileRoute } from "@tanstack/react-router";
import { localeHead } from "@/lib/localized-meta";
import { CookiesPage } from "@/routes/cookies";

export const Route = createFileRoute("/de/cookies")({
  head: () => localeHead("de", "cookies"),
  component: CookiesPage });
