import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { renderLocaleSitemap, XML_HEADERS } from "@/lib/sitemap-entries";

/** Per-locale sitemap for "es", listed in /sitemap.xml (sitemap index). */
export const Route = createFileRoute("/sitemap-es.xml")({
  server: {
    handlers: {
      GET: async () => new Response(renderLocaleSitemap("es"), { headers: XML_HEADERS }),
    },
  },
});
