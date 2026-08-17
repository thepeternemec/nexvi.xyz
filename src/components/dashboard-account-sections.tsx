import { useCallback, useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  CalendarClock,
  CreditCard,
  Crown,
  ExternalLink,
  Loader2,
  Mail,
  Settings,
  ShieldCheck,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useSubscription } from "@/hooks/use-subscription";
import { createPortalSession } from "@/utils/payments.functions";
import { getStripeEnvironment } from "@/lib/stripe";
import { getSubscriptionStatusConfig, formatSubscriptionPeriod } from "@/lib/subscription-ui";
import { alternateHref, detectLocaleFromPath } from "@/lib/i18n";

type Profile = {
  full_name: string | null;
  headline: string | null;
  location: string | null;
  avatar_path: string | null;
};

export function DashboardAccountSections() {
  const { user, isAuthenticated } = useAuth();
  const sub = useSubscription();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const locale = detectLocaleFromPath(pathname);
  const href = (p: string) => alternateHref(locale, p);
  const portal = useServerFn(createPortalSession);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState("");

  const load = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("profiles")
      .select("full_name, headline, location, avatar_path")
      .eq("id", user.id)
      .maybeSingle();
    setProfile(data ?? null);
    if (data?.avatar_path) {
      const { data: signed } = await supabase.storage
        .from("avatars")
        .createSignedUrl(data.avatar_path, 60 * 60);
      setAvatarUrl(signed?.signedUrl ?? null);
    } else {
      setAvatarUrl(null);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  if (!isAuthenticated || !user) return null;

  async function openPortal() {
    setBusy("portal");
    try {
      const result = await portal({
        data: { returnUrl: window.location.href, environment: getStripeEnvironment() },
      });
      if ("error" in result) throw new Error(result.error);
      window.open(result.url, "_blank", "noopener,noreferrer");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not open the billing portal");
    } finally {
      setBusy(null);
    }
  }

  async function changeEmail(e: React.FormEvent) {
    e.preventDefault();
    const email = newEmail.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return toast.error("Enter a valid email address.");
    if (email === user?.email?.toLowerCase()) return toast.error("That's already your email.");
    setBusy("email");
    const { error } = await supabase.auth.updateUser(
      { email },
      { emailRedirectTo: `${window.location.origin}/verify-email` },
    );
    if (error) toast.error(error.message);
    else {
      toast.success("Confirmation sent — check both inboxes (and spam/junk). Sent from noreply@notify.applywise.eu.");
      setNewEmail("");
    }
    setBusy(null);
  }

  const statusConfig = sub.loading ? null : getSubscriptionStatusConfig(sub.status);
  const StatusIcon = statusConfig ? statusConfig.icon : null;
  const periodText =
    sub.loading || !sub.currentPeriodEnd
      ? null
      : formatSubscriptionPeriod(sub.status, sub.currentPeriodEnd, sub.cancelAtPeriodEnd);
  const canManagePortal = ["active", "trialing", "past_due"].includes(sub.status || "");

  return (
    <div className="mt-12 grid gap-6 lg:grid-cols-2">
      {/* Account settings */}
      <section className="rounded-3xl border border-border/70 bg-card p-7">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Settings className="h-3.5 w-3.5" /> Account settings
        </div>

        <div className="mt-5 flex items-center gap-4">
          <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-full bg-foreground/5 text-foreground">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Your profile avatar" className="h-full w-full object-cover" />
            ) : (
              <User className="h-6 w-6" />
            )}
          </div>
          <div className="min-w-0">
            <div className="font-display truncate text-lg tracking-tight">
              {profile?.full_name || user.name || "Add your name"}
            </div>
            <div className="truncate text-sm text-muted-foreground">{user.email}</div>
            {profile?.headline && (
              <div className="truncate text-xs text-muted-foreground">{profile.headline}</div>
            )}
          </div>
        </div>

        <dl className="mt-5 space-y-2 text-sm">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted-foreground">Location</dt>
            <dd className="truncate">{profile?.location || "—"}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted-foreground">Profile photo</dt>
            <dd>{profile?.avatar_path ? "Uploaded" : "Not set"}</dd>
          </div>
        </dl>

        <form onSubmit={changeEmail} className="mt-6 space-y-2 border-t border-border/60 pt-5">
          <Label htmlFor="dashboard-new-email" className="flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5" /> Update email address
          </Label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              id="dashboard-new-email"
              type="email"
              placeholder="new@email.com"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              autoComplete="email"
            />
            <Button type="submit" variant="outline" className="rounded-full" disabled={busy === "email"}>
              {busy === "email" && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />} Send link
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            We email a confirmation link to your current and new address.
          </p>
        </form>

        <div className="mt-6 flex flex-wrap gap-2">
          <a href={href("/account")}>
            <Button className="rounded-full">Edit profile details</Button>
          </a>
          <a href={href("/reset-password")}>
            <Button variant="ghost" className="rounded-full">
              Change password
            </Button>
          </a>
        </div>
      </section>

      {/* Subscription management */}
      <section className="rounded-3xl border border-border/70 bg-card p-7">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <CreditCard className="h-3.5 w-3.5" /> Subscription
        </div>

        <div className="mt-5 flex items-end justify-between gap-4">
          <div className="min-w-0">
            <div className="font-display flex items-center gap-2 text-3xl tracking-tight">
              {sub.loading ? "…" : sub.plan === "premium" ? "Premium" : "Free"}
              {sub.isPremium && <Crown className="h-5 w-5 text-primary" />}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
              {sub.loading ? (
                <span className="text-muted-foreground">Loading…</span>
              ) : statusConfig && StatusIcon ? (
                <>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusConfig.badgeClass}`}
                  >
                    <StatusIcon className="h-3.5 w-3.5" />
                    {statusConfig.label}
                  </span>
                  {periodText && (
                    <span className="text-muted-foreground">· {periodText}</span>
                  )}
                </>
              ) : null}
            </div>

            {!sub.loading && statusConfig && (
              <div className={`mt-4 rounded-2xl border p-4 text-sm ${statusConfig.bannerClass}`}>
                <div className="flex items-start gap-3">
                  {StatusIcon && <StatusIcon className="mt-0.5 h-4 w-4 shrink-0" />}
                  <p>{statusConfig.description}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <ul className="mt-5 space-y-3 text-sm">
          {[
            { icon: CreditCard, title: "Payment method", desc: "Update your card or billing address." },
            { icon: CalendarClock, title: "Plan & invoices", desc: "Switch monthly/yearly, download receipts." },
            { icon: ShieldCheck, title: "Cancel anytime", desc: "Keep access until your period ends." },
          ].map((f) => (
            <li key={f.title} className="flex gap-3">
              <f.icon className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
              <div>
                <div className="font-medium">{f.title}</div>
                <p className="text-muted-foreground">{f.desc}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {canManagePortal ? (
            <Button onClick={openPortal} disabled={busy === "portal"} className="rounded-full">
              {busy === "portal" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ExternalLink className="mr-2 h-4 w-4" />
              )}
              {sub.status === "past_due"
                ? "Fix payment method"
                : sub.status === "trialing"
                  ? "Manage trial"
                  : "Update payment details"}
            </Button>
          ) : (
            <a href={href("/pricing")}>
              <Button className="rounded-full">
                <Crown className="mr-2 h-4 w-4" /> Go Premium
              </Button>
            </a>
          )}
          <a href={href("/subscription")}>
            <Button variant="outline" className="rounded-full">
              Billing overview
            </Button>
          </a>
        </div>
        {canManagePortal && (
          <p className="mt-2 text-xs text-muted-foreground">The billing portal opens in a new tab.</p>
        )}
      </section>
    </div>
  );
}
