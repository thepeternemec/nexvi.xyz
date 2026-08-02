import { createFileRoute } from "@tanstack/react-router";
import { SitemapPage } from "@/routes/sitemap";

export const Route = createFileRoute("/de/sitemap")({ component: SitemapPage });
