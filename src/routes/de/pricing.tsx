import { createFileRoute } from "@tanstack/react-router";
import { Pricing } from "@/routes/pricing";




export const Route = createFileRoute("/de/pricing")({
  head: () => ({ meta: [{ title: "Pricing — Nexvi" }] }),

  component: Pricing,
});
