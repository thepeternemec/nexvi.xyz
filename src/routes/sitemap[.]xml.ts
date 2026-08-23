import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { renderSitemapIndex, XML_HEADERS } from "@/lib/sitemap-entries";

/**
 * Sitemap index. Google reads this one URL and discovers a dedicated
 * per-locale sitemap for en/de/es/it/fr, so each language is tracked
 * separately in Search Console.
 */
export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () =>
        new Response(renderSitemapIndex(), {
          // No X-Robots-Tag here: a "noindex" header makes Google refuse to
          // read the sitemap ("Sitemap could not be read").
          headers: XML_HEADERS,
        }),
    },
  },
});
