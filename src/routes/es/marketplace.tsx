import { createFileRoute } from "@tanstack/react-router";
import { Marketplace } from "@/routes/marketplace";




export const Route = createFileRoute("/es/marketplace")({
  head: () => ({ meta: [{ title: "Marketplace — ApplyWise" }] }),
  validateSearch: (s) => ({
    q: typeof s.q === "string" ? s.q : undefined,
    category: typeof s.category === "string" ? s.category : undefined,
    pack: typeof s.pack === "string" ? s.pack : undefined,
    sort: (s.sort) ?? "popular",
    price: (s.price) ?? "all",
    beginner: s.beginner === "1" ? "1" : undefined,
  }),
  component: Marketplace,
});
