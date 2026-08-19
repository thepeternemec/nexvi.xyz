import { createFileRoute } from "@tanstack/react-router";
import { localeHead } from "@/lib/localized-meta";
import { CookiesPage } from "@/routes/cookies";

export const Route = createFileRoute("/es/cookies")({
  head: () => localeHead("es", "cookies"),
  component: CookiesPage });
