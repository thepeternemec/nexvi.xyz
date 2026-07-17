import { createFileRoute } from "@tanstack/react-router";
import { Creator } from "@/routes/creator";




export const Route = createFileRoute("/es/creator")({
  head: () => ({ meta: [{ title: "Creator — ApplyWise" }] }),

  component: Creator,
});
