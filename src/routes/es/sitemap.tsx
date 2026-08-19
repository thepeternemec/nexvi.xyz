import { createFileRoute } from "@tanstack/react-router";
import { localeHead } from "@/lib/localized-meta";
import { SitemapPage } from "@/routes/sitemap";

export const Route = createFileRoute("/es/sitemap")({
  head: () => localeHead("es", "sitemap"),
  component: SitemapPage });
