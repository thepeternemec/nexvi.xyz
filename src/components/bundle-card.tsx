import { Link } from "@tanstack/react-router";
import { Crown, Lock, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useSubscription } from "@/hooks/use-subscription";

// Topic-driven color tokens. Each topic gets a calm, distinct surface tint
// + a matching accent used for the topic icon foreground.
const TOPIC_COLORS: Record<string, { bg: string; fg: string }> = {
  career: { bg: "bg-[#e8eef7]", fg: "text-[#2d4a7c]" },
  business: { bg: "bg-[#eaf1ec]", fg: "text-[#2f5a3a]" },
  marketing: { bg: "bg-[#fbeae3]", fg: "text-[#a14a25]" },
  content: { bg: "bg-[#f3e9f1]", fg: "text-[#7a3a6a]" },
  writing: { bg: "bg-[#f0ece2]", fg: "text-[#6b5a2a]" },
  productivity: { bg: "bg-[#e6efee]", fg: "text-[#2e5a55]" },
  study: { bg: "bg-[#ecebf5]", fg: "text-[#4a4680]" },
  education: { bg: "bg-[#ecebf5]", fg: "text-[#4a4680]" },
  health: { bg: "bg-[#e6f0ea]", fg: "text-[#2f6a45]" },
  lifestyle: { bg: "bg-[#f7ecea]", fg: "text-[#8a3f3a]" },
  travel: { bg: "bg-[#e6eef3]", fg: "text-[#2c5a78]" },
  finance: { bg: "bg-[#eef0e6]", fg: "text-[#5a6a2a]" },
  design: { bg: "bg-[#f0eaf3]", fg: "text-[#5e3a78]" },
  coding: { bg: "bg-[#e8ecef]", fg: "text-[#3a4750]" },
  creative: { bg: "bg-[#f7eee6]", fg: "text-[#8a5530]" },
  relationships: { bg: "bg-[#f7e9ec]", fg: "text-[#8a3a52]" },
  parenting: { bg: "bg-[#fbf0e3]", fg: "text-[#a06a25]" },
  cooking: { bg: "bg-[#fbeee0]", fg: "text-[#9a5a20]" },
  fitness: { bg: "bg-[#eaf0e3]", fg: "text-[#4a6a25]" },
};

const FALLBACK = { bg: "bg-[#eeeae3]", fg: "text-[#5a5046]" };

function colorsForTopic(slug: string | null | undefined) {
  if (!slug) return FALLBACK;
  return TOPIC_COLORS[slug] ?? FALLBACK;
}

type BundleCardProps = {
  bundle: {
    slug: string;
    title: string;
    description: string | null;
    cover: string | null;
    is_premium: boolean;
    category_slug?: string | null;
  };
};

export function BundleCard({ bundle }: BundleCardProps) {
  const { isPremium: hasPremium } = useSubscription();
  const premium = bundle.is_premium;
  const locked = premium && !hasPremium;
  const { bg: tint, fg: accent } = colorsForTopic(bundle.category_slug);

  return (
    <Link
      to="/bundle/$slug"
      params={{ slug: bundle.slug }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-border hover:shadow-[0_8px_32px_-12px_rgba(0,0,0,0.12)]"
    >
      <div className={`relative aspect-[16/10] w-full ${tint}`}>
        <div className="absolute inset-0 flex items-center justify-center opacity-25">
          <Package className={`h-24 w-24 ${accent}`} strokeWidth={0.8} />
        </div>
        <div className="absolute left-4 top-4 flex gap-2">
          {premium ? (
            <Badge className="rounded-full border-0 bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-500/20 dark:text-amber-200 dark:hover:bg-amber-500/20">
              <Crown className="mr-1 h-3 w-3 text-amber-600 dark:text-amber-300" /> Premium
            </Badge>
          ) : (
            <Badge className="rounded-full border-0 bg-background/80 text-foreground hover:bg-background">Free</Badge>
          )}
        </div>
        <div className="absolute bottom-4 left-4">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-foreground/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground/80 backdrop-blur-sm">
            <Package className="h-3 w-3" /> Bundle
          </div>
        </div>
        {locked && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 backdrop-blur-sm transition duration-300 group-hover:opacity-100">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-card px-3.5 py-2 text-xs font-medium text-foreground shadow-sm ring-1 ring-border">
              <Lock className="h-3.5 w-3.5" /> Upgrade to unlock
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2.5 p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg leading-snug tracking-tight">{bundle.title}</h3>
        </div>
        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{bundle.description}</p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex items-center gap-2">
            <div className="grid h-6 w-6 place-items-center rounded-full bg-muted text-[10px] font-semibold text-muted-foreground">
              <Package className="h-3 w-3" />
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
      <div className="grid place-items-center rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-20 text-center">
        <Package className="h-6 w-6 text-muted-foreground" />
        <div className="mt-3 font-display text-xl">No bundles yet.</div>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">Check back soon for curated prompt packs.</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((b) => (
        <BundleCard key={b.slug} bundle={b} />
      ))}
    </div>
  );
}
