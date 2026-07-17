import { createFileRoute } from "@tanstack/react-router";
import { BundlesPage } from "@/routes/bundles";
import { queryOptions } from "@tanstack/react-query";
import { listBundles } from "@/lib/bundles.functions";

const bundlesQueryOptions = queryOptions({ queryKey: ["bundles"], queryFn: () => listBundles() });

export const Route = createFileRoute("/es/bundles")({
  head: () => ({ meta: [{ title: "Bundles — ApplyWise" }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(bundlesQueryOptions),
  component: BundlesPage,
});
