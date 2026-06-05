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
      { title: "Bundles — getHeired" },
      { name: "description", content: "Curated prompt packs for every step of the job hunt — CV, cover letter, interview, negotiation." },
    ],
  }),
});

function BundlesPage() {
  const { data: bundles } = useSuspenseQuery(bundlesQueryOptions);

  return (
    <SiteShell>
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-foreground/[0.04] via-background to-background dark:from-foreground/[0.08]" />
        <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-20">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Bundles</span>
          </div>
          <h1 className="font-display mt-3 text-4xl tracking-tight sm:text-5xl lg:text-6xl">Bundles for every stage of the hunt.</h1>
          <p className="mt-3 max-w-xl text-muted-foreground leading-relaxed">
            Curated prompt packs that work together — from first CV to final negotiation.
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
