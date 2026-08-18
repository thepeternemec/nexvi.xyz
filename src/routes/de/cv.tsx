import { createFileRoute } from "@tanstack/react-router";
import { CVPage } from "@/routes/cv";




export const Route = createFileRoute("/de/cv")({
  head: () => ({ meta: [{ title: "AI CV Generator — Nexvi" }] }),

  component: CVPage,
});
