import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { queryOptions } from "@tanstack/react-query";
import { Package } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { BundleGrid } from "@/components/bundle-card";
import { listBundles } from "@/lib/bundles.functions";

const bundlesQueryOptions = queryOptions({
  queryKey: ["bundles"],
  queryFn: () => listBundles(),
});

export const Route = createFileRoute("/bundles")({
  component: BundlesPage,
  loader: ({ context }) => context.queryClient.ensureQueryData(bundlesQueryOptions),
  head: () => ({
    meta: [
      { title: "Bundles — Prompt Academia" },
      { name: "description", content: "Curated prompt packs and toolkits for real-world outcomes." },
    ],
  }),
});

function BundlesPage() {
  const { data: bundles } = useSuspenseQuery(bundlesQueryOptions);

  return (
    <SiteShell>
      <section className="border-b border-border/60 bg-aurora">
        <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-muted-foreground" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Collections</span>
          </div>
          <h1 className="font-display mt-2 text-5xl tracking-tight sm:text-6xl">Bundles</h1>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Curated prompt packs designed to work together — for careers, content, study, business, and more.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
        <div className="mt-6">
          <BundleGrid items={bundles ?? []} />
        </div>
      </section>
    </SiteShell>
  );
}
