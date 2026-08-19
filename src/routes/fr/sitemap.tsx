import { createFileRoute } from "@tanstack/react-router";
import { localeHead } from "@/lib/localized-meta";
import { SitemapPage } from "@/routes/sitemap";

export const Route = createFileRoute("/fr/sitemap")({
  head: () => localeHead("fr", "sitemap"),
  component: SitemapPage });
