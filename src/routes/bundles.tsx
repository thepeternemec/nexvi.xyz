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
      <section className="border-b border-border/60 bg-muted/30">
        <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-20">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Collections</span>
          </div>
          <h1 className="font-display mt-3 text-4xl tracking-tight sm:text-5xl lg:text-6xl">Bundles</h1>
          <p className="mt-3 max-w-xl text-muted-foreground leading-relaxed">
            Curated prompt packs designed to work together — for careers, content, study, business, and more.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
        <div>
          <BundleGrid items={bundles ?? []} />
        </div>
      </section>
    </SiteShell>
  );
}
