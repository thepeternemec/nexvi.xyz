import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { renderLocaleSitemap, XML_HEADERS } from "@/lib/sitemap-entries";

/** Per-locale sitemap for "en", listed in /sitemap.xml (sitemap index). */
export const Route = createFileRoute("/sitemap-en.xml")({
  server: {
    handlers: {
      GET: async () => new Response(renderLocaleSitemap("en"), { headers: XML_HEADERS }),
    },
  },
});
