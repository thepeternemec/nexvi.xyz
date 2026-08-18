import { createFileRoute } from "@tanstack/react-router";
import { ATSPage } from "@/routes/ats";




export const Route = createFileRoute("/es/ats")({
  head: () => ({ meta: [{ title: "ATS Optimizer — Nexvi" }] }),

  component: ATSPage,
});
