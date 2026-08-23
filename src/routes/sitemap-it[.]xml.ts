import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { renderLocaleSitemap, XML_HEADERS } from "@/lib/sitemap-entries";

/** Per-locale sitemap for "it", listed in /sitemap.xml (sitemap index). */
export const Route = createFileRoute("/sitemap-it.xml")({
  server: {
    handlers: {
      GET: async () => new Response(renderLocaleSitemap("it"), { headers: XML_HEADERS }),
    },
  },
});
