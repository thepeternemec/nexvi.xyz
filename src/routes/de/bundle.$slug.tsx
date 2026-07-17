import { createFileRoute } from "@tanstack/react-router";
import BundleDetail from "@/routes/bundle.$slug";
import { getBundlePrompts } from "@/lib/bundles.functions";
import { notFound } from "@tanstack/react-router";



export const Route = createFileRoute("/de/bundle/$slug")({
  head: () => ({ meta: [{ title: "Bundle — ApplyWise" }] }),
  loader: async ({ params }) => {
    const data = await getBundlePrompts({ data: { bundleSlug: params.slug } });
    if (!data.bundle) throw notFound();
    return data;
  },
  component: BundleDetail,
});
