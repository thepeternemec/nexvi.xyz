import { createFileRoute } from "@tanstack/react-router";
import { BlogIndexPage } from "@/routes/blog/index";

export const Route = createFileRoute("/es/blog/")({
  head: () => ({
    meta: [{ property: "og:locale", content: "es_ES" }],
    links: [{ rel: "canonical", href: "https://nexvi.xyz/es/blog" }],
  }),
  component: BlogIndexPage,
});
