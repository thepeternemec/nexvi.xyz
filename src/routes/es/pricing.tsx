import { createFileRoute } from "@tanstack/react-router";
import { Pricing } from "@/routes/pricing";




export const Route = createFileRoute("/es/pricing")({
  head: () => ({ meta: [{ title: "Pricing — ApplyWise" }] }),

  component: Pricing,
});
