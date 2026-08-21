import { createFileRoute } from "@tanstack/react-router";
import { BlogIndexPage } from "@/routes/blog/index";

export const Route = createFileRoute("/fr/blog/")({
  head: () => ({
    meta: [{ property: "og:locale", content: "fr_FR" }],
    links: [{ rel: "canonical", href: "https://nexvi.xyz/fr/blog" }],
  }),
  component: BlogIndexPage,
});
