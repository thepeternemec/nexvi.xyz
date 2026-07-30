import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { prompts } from "@/lib/mock-data";

// TODO: replace with your project URL once a project name or custom domain is set.
const BASE_URL = "";

const LOCALES = ["de", "es", "it", "fr"] as const;

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/cv", changefreq: "weekly", priority: "0.9" },
          { path: "/cover-letter", changefreq: "weekly", priority: "0.9" },
          { path: "/humanizer", changefreq: "weekly", priority: "0.8" },
          { path: "/ats", changefreq: "weekly", priority: "0.8" },
          { path: "/marketplace", changefreq: "daily", priority: "0.9" },
          { path: "/pricing", changefreq: "monthly", priority: "0.7" },
        ];

        for (const p of prompts) {
          entries.push({ path: `/prompt/${p.slug}`, changefreq: "monthly", priority: "0.6" });
        }

        for (const l of LOCALES) {
          for (const path of ["", "/cv", "/cover-letter", "/ats", "/marketplace", "/pricing"]) {
            entries.push({ path: `/${l}${path}`, changefreq: "weekly", priority: "0.5" });
          }
          for (const p of prompts) {
            entries.push({ path: `/${l}/prompt/${p.slug}`, changefreq: "monthly", priority: "0.4" });
          }
        }

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
