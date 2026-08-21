import { createFileRoute } from "@tanstack/react-router";
import { BlogIndexPage } from "@/routes/blog/index";

export const Route = createFileRoute("/de/blog/")({
  head: () => ({
    meta: [{ property: "og:locale", content: "de_DE" }],
    links: [{ rel: "canonical", href: "https://nexvi.xyz/de/blog" }],
  }),
  component: BlogIndexPage,
});
