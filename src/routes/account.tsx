import { createFileRoute, useRouterState } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Camera, Loader2, Trash2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SiteShell } from "@/components/site-shell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { alternateHref, detectLocaleFromPath } from "@/lib/i18n";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Account settings — ApplyWise" },
      { name: "description", content: "Edit your ApplyWise profile details and update your avatar." },
      { property: "og:title", content: "Account settings — ApplyWise" },
      { property: "og:description", content: "Edit your ApplyWise profile details and update your avatar." },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: AccountSettings,
});

type ProfileForm = {
  full_name: string;
  headline: string;
  location: string;
  website: string;
  bio: string;
};

const EMPTY: ProfileForm = { full_name: "", headline: "", location: "", website: "", bio: "" };
const MAX_AVATAR_BYTES = 3 * 1024 * 1024;

export function AccountSettings() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const locale = detectLocaleFromPath(pathname);
  const href = (p: string) => alternateHref(locale, p);

  const [form, setForm] = useState<ProfileForm>(EMPTY);
  const [avatarPath, setAvatarPath] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const signAvatar = useCallback(async (path: string | null) => {
    if (!path) {
      setAvatarUrl(null);
      return;
    }
    const { data } = await supabase.storage.from("avatars").createSignedUrl(path, 60 * 60);
    setAvatarUrl(data?.signedUrl ?? null);
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    let mounted = true;
    (async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, headline, location, website, bio, avatar_path")
        .eq("id", user.id)
        .maybeSingle();
      if (!mounted) return;
      if (error) toast.error("Could not load your profile.");
      setForm({
        full_name: data?.full_name ?? user.name ?? "",
        headline: data?.headline ?? "",
        location: data?.location ?? "",
        website: data?.website ?? "",
        bio: data?.bio ?? "",
      });
      setAvatarPath(data?.avatar_path ?? null);
      await signAvatar(data?.avatar_path ?? null);
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [user, authLoading, signAvatar]);

  const update = (key: keyof ProfileForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (form.full_name.trim().length > 100) return toast.error("Name must be under 100 characters.");
    if (form.bio.length > 600) return toast.error("Bio must be under 600 characters.");
    setSaving(true);
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: form.full_name.trim() || null,
      headline: form.headline.trim() || null,
      location: form.location.trim() || null,
      website: form.website.trim() || null,
      bio: form.bio.trim() || null,
      avatar_path: avatarPath,
    });
    if (error) {
      toast.error("Could not save your profile.");
    } else {
      await supabase.auth.updateUser({ data: { name: form.full_name.trim() || null } });
      toast.success("Profile updated.");
    }
    setSaving(false);
  };

  const handleAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !user) return;
    if (!file.type.startsWith("image/")) return toast.error("Please choose an image file.");
    if (file.size > MAX_AVATAR_BYTES) return toast.error("Image must be smaller than 3 MB.");

    setUploading(true);
    const ext = file.name.split(".").pop()?.toLowerCase() || "png";
    const path = `${user.id}/avatar-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (upErr) {
      toast.error("Upload failed. Please try again.");
      setUploading(false);
      return;
    }
    const { error: dbErr } = await supabase.from("profiles").upsert({ id: user.id, avatar_path: path });
    if (dbErr) {
      toast.error("Could not save your avatar.");
    } else {
      if (avatarPath) await supabase.storage.from("avatars").remove([avatarPath]);
      setAvatarPath(path);
      await signAvatar(path);
      toast.success("Avatar updated.");
    }
    setUploading(false);
  };

  const removeAvatar = async () => {
    if (!user || !avatarPath) return;
    setUploading(true);
    await supabase.storage.from("avatars").remove([avatarPath]);
    const { error } = await supabase.from("profiles").upsert({ id: user.id, avatar_path: null });
    if (error) toast.error("Could not remove your avatar.");
    else {
      setAvatarPath(null);
      setAvatarUrl(null);
      toast.success("Avatar removed.");
    }
    setUploading(false);
  };

  return (
    <SiteShell>
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-foreground/[0.04] via-background to-background dark:from-foreground/[0.08]" />
        <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Account</div>
          <h1 className="font-display mt-2 text-4xl tracking-tight sm:text-5xl">Account settings</h1>
          <p className="mt-2 text-muted-foreground">Update your name, profile details and avatar.</p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
        {authLoading || loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading your profile…
          </div>
        ) : !isAuthenticated ? (
          <div className="rounded-2xl border border-border/70 bg-card p-8 text-center">
            <h2 className="font-display text-2xl tracking-tight">Sign in to manage your account</h2>
            <p className="mt-2 text-sm text-muted-foreground">Your profile details and avatar live in your ApplyWise account.</p>
            <a href={href("/login")}>
              <Button className="mt-5 rounded-full">Sign in</Button>
            </a>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-8">
            <div className="rounded-2xl border border-border/70 bg-card p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-full bg-foreground/5 text-foreground">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Your profile avatar" className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-7 w-7" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">Profile photo</div>
                  <p className="mt-1 text-sm text-muted-foreground">JPG or PNG, up to 3 MB.</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                      disabled={uploading}
                      onClick={() => fileRef.current?.click()}
                    >
                      {uploading ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Camera className="mr-1.5 h-4 w-4" />}
                      {avatarPath ? "Change photo" : "Upload photo"}
                    </Button>
                    {avatarPath && (
                      <Button type="button" variant="ghost" size="sm" className="rounded-full" disabled={uploading} onClick={removeAvatar}>
                        <Trash2 className="mr-1.5 h-4 w-4" /> Remove
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card p-6">
              <h2 className="font-display text-xl tracking-tight">Profile details</h2>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full name</Label>
                  <Input id="full_name" maxLength={100} value={form.full_name} onChange={update("full_name")} placeholder="Alex Novak" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="headline">Headline</Label>
                  <Input id="headline" maxLength={120} value={form.headline} onChange={update("headline")} placeholder="Product Designer" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" maxLength={120} value={form.location} onChange={update("location")} placeholder="Berlin, Germany" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website or LinkedIn</Label>
                  <Input id="website" maxLength={200} value={form.website} onChange={update("website")} placeholder="https://linkedin.com/in/you" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="bio">Short bio</Label>
                  <Textarea id="bio" rows={4} maxLength={600} value={form.bio} onChange={update("bio")} placeholder="A few lines about your experience and what you're looking for." />
                  <div className="text-xs text-muted-foreground">{form.bio.length}/600</div>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Email</Label>
                  <Input value={user?.email ?? ""} disabled readOnly />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button type="submit" className="rounded-full" disabled={saving}>
                {saving && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />} Save changes
              </Button>
              <a href={href("/dashboard")}>
                <Button type="button" variant="ghost" className="rounded-full">Back to dashboard</Button>
              </a>
            </div>
          </form>
        )}
      </section>
    </SiteShell>
  );
}
