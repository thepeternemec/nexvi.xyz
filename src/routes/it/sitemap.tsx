import { createFileRoute } from "@tanstack/react-router";
import { localeHead } from "@/lib/localized-meta";
import { SitemapPage } from "@/routes/sitemap";

export const Route = createFileRoute("/it/sitemap")({
  head: () => localeHead("it", "sitemap"),
  component: SitemapPage });
