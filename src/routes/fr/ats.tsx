import { createFileRoute } from "@tanstack/react-router";
import { ATSPage } from "@/routes/ats";




export const Route = createFileRoute("/fr/ats")({
  head: () => ({ meta: [{ title: "ATS Optimizer — ApplyWise" }] }),

  component: ATSPage,
});
