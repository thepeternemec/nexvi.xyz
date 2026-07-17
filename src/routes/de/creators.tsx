import { createFileRoute } from "@tanstack/react-router";
import { Creators } from "@/routes/creators";




export const Route = createFileRoute("/de/creators")({
  head: () => ({ meta: [{ title: "Creators — ApplyWise" }] }),

  component: Creators,
});
