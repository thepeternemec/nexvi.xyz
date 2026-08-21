import { createFileRoute } from "@tanstack/react-router";
import { BlogIndexPage } from "@/routes/blog/index";

export const Route = createFileRoute("/it/blog/")({
  head: () => ({
    meta: [{ property: "og:locale", content: "it_IT" }],
    links: [{ rel: "canonical", href: "https://nexvi.xyz/it/blog" }],
  }),
  component: BlogIndexPage,
});
