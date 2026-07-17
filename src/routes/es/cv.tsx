import { createFileRoute } from "@tanstack/react-router";
import { CVPage } from "@/routes/cv";




export const Route = createFileRoute("/es/cv")({
  head: () => ({ meta: [{ title: "AI CV Generator — ApplyWise" }] }),

  component: CVPage,
});
