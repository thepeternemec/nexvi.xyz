import { createFileRoute } from "@tanstack/react-router";
import { Creators } from "@/routes/creators";




export const Route = createFileRoute("/es/creators")({
  head: () => ({ meta: [{ title: "Creators — Nexvi" }] }),

  component: Creators,
});
