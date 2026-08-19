import { createFileRoute } from "@tanstack/react-router";
import { localeHead } from "@/lib/localized-meta";
import { SitemapPage } from "@/routes/sitemap";

export const Route = createFileRoute("/de/sitemap")({
  head: () => localeHead("de", "sitemap"),
  component: SitemapPage });
