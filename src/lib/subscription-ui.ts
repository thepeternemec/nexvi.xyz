import {
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Crown,
  type LucideIcon,
} from "lucide-react";
import type { SubscriptionSnapshot } from "@/lib/subscriptions.functions";

export type SubscriptionStatusConfig = {
  label: string;
  description: string;
  icon: LucideIcon;
  badgeClass: string;
  bannerClass: string;
};

export function getSubscriptionStatusConfig(
  status: SubscriptionSnapshot["status"],
): SubscriptionStatusConfig {
  switch (status) {
    case "trialing":
      return {
        label: "Trial active",
        description:
          "You're exploring Premium for free. Upgrade before your trial ends to keep full access.",
        icon: Clock,
        badgeClass:
          "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
        bannerClass:
          "border-amber-200/70 bg-amber-50/60 dark:border-amber-900/40 dark:bg-amber-900/20",
      };
    case "past_due":
      return {
        label: "Payment issue",
        description:
          "Your latest payment failed. Update your card or billing address to keep Premium access.",
        icon: AlertCircle,
        badgeClass:
          "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
        bannerClass:
          "border-rose-200/70 bg-rose-50/60 dark:border-rose-900/40 dark:bg-rose-900/20",
      };
    case "canceled":
      return {
        label: "Canceled",
        description:
          "Your subscription was canceled. Upgrade again to unlock all Premium tools.",
        icon: XCircle,
        badgeClass:
          "bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
        bannerClass:
          "border-border/70 bg-muted/40 dark:bg-muted/20",
      };
    case "active":
      return {
        label: "Active",
        description: "Your Premium plan is running smoothly.",
        icon: CheckCircle2,
        badgeClass:
          "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
        bannerClass:
          "border-emerald-200/70 bg-emerald-50/60 dark:border-emerald-900/40 dark:bg-emerald-900/20",
      };
    default:
      return {
        label: "No active plan",
        description:
          "You're on the Free plan. Upgrade for unlimited CVs, cover letters and ATS tools.",
        icon: Crown,
        badgeClass:
          "bg-muted text-muted-foreground",
        bannerClass:
          "border-border/70 bg-muted/40 dark:bg-muted/20",
      };
  }
}

export function formatSubscriptionPeriod(
  status: SubscriptionSnapshot["status"],
  currentPeriodEnd: string | null,
  cancelAtPeriodEnd: boolean,
): string | null {
  if (!currentPeriodEnd) return null;
  const date = new Date(currentPeriodEnd).toLocaleDateString();

  if (cancelAtPeriodEnd) {
    return `access ends ${date}`;
  }

  switch (status) {
    case "trialing":
      return `trial ends ${date}`;
    case "past_due":
      return `payment retries until ${date}`;
    case "canceled":
      return `access ended ${date}`;
    default:
      return `renews ${date}`;
  }
}
