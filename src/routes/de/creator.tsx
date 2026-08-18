import { createFileRoute } from "@tanstack/react-router";
import { Creator } from "@/routes/creator";




export const Route = createFileRoute("/de/creator")({
  head: () => ({ meta: [{ title: "Creator — Nexvi" }] }),

  component: Creator,
});
