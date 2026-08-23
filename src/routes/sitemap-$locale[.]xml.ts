import { createFileRoute, notFound } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { isSitemapLocale, renderLocaleSitemap, XML_HEADERS } from "@/lib/sitemap-entries";

/** Per-locale sitemap: /sitemap-en.xml, /sitemap-de.xml, /sitemap-es.xml, ... */
export const Route = createFileRoute("/sitemap-$locale.xml")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const locale = String(params.locale).toLowerCase();
        if (!isSitemapLocale(locale)) throw notFound();
        return new Response(renderLocaleSitemap(locale), { headers: XML_HEADERS });
      },
    },
  },
});
