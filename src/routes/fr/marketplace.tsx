import { createFileRoute } from "@tanstack/react-router";
import { Marketplace } from "@/routes/marketplace";




export const Route = createFileRoute("/fr/marketplace")({
  head: () => ({ meta: [{ title: "Marketplace — ApplyWise" }] }),
  validateSearch: (s: Record<string, unknown>) => ({
    q: typeof s.q === "string" ? s.q : undefined,
    category: typeof s.category === "string" ? s.category : undefined,
    pack: typeof s.pack === "string" ? s.pack : undefined,
    sort: (s.sort as string | undefined) ?? "popular",
    price: (s.price as string | undefined) ?? "all",
    beginner: s.beginner === "1" ? "1" : undefined,
  }),
  component: Marketplace,
});
