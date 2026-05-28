import { Link } from "@tanstack/react-router";
import { Crown, Lock, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useSubscription } from "@/hooks/use-subscription";

type BundleCardProps = {
  bundle: {
    slug: string;
    title: string;
    description: string | null;
    cover: string | null;
    is_premium: boolean;
  };
};

export function BundleCard({ bundle }: BundleCardProps) {
  const { isPremium: hasPremium } = useSubscription();
  const premium = bundle.is_premium;
  const locked = premium && !hasPremium;
  const gradient = bundle.cover || "from-violet-500 via-fuchsia-500 to-amber-400";

  return (
    <Link
      to="/bundle/$slug"
      params={{ slug: bundle.slug }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-border/70 bg-card transition-all hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-[0_20px_60px_-20px_rgb(0_0_0_/0.15)]"
    >
      <div className={`relative aspect-[16/10] w-full bg-gradient-to-br ${gradient}`}>
        <div className="absolute inset-0 bg-grain opacity-60" />
        <div className="absolute left-4 top-4 flex gap-1.5">
          {premium ? (
            <Badge className="rounded-full bg-gradient-to-r from-amber-400 to-rose-500 text-white shadow-sm hover:from-amber-400 hover:to-rose-500">
              <Crown className="mr-1 h-3 w-3" /> Premium
            </Badge>
          ) : (
            <Badge className="rounded-full bg-white/90 text-foreground hover:bg-white">Free</Badge>
          )}
        </div>
        <div className="absolute bottom-4 left-4">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-black/30 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white backdrop-blur">
            <Package className="h-3 w-3" /> Bundle
          </div>
        </div>
        {locked && (
          <div className="absolute inset-0 flex items-center justify-center bg-foreground/40 opacity-0 backdrop-blur-[2px] transition group-hover:opacity-100">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-medium text-foreground shadow">
              <Lock className="h-3.5 w-3.5" /> Premium — Upgrade to unlock
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-xl leading-tight tracking-tight">{bundle.title}</h3>
        </div>
        <p className="line-clamp-2 text-sm text-muted-foreground">{bundle.description}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-400 text-[10px] font-semibold text-white">
              <Package className="h-3.5 w-3.5" />
            </div>
            <span className="text-xs text-muted-foreground">Prompt Academia</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function BundleGrid({ items }: { items: BundleCardProps["bundle"][] }) {
  if (items.length === 0) {
    return (
      <div className="grid place-items-center rounded-3xl border border-dashed border-border bg-muted/30 px-6 py-20 text-center">
        <Package className="h-6 w-6 text-muted-foreground" />
        <div className="mt-3 font-display text-xl">No bundles yet.</div>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">Check back soon for curated prompt packs.</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((b) => (
        <BundleCard key={b.slug} bundle={b} />
      ))}
    </div>
  );
}
