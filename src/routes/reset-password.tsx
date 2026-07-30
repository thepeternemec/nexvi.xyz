import {
  createFileRoute,
  useNavigate,
  useSearch,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { alternateHref, detectLocaleFromPath } from "@/lib/i18n";
import { AlertCircle, CheckCircle2, KeyRound, Loader2, Lock } from "lucide-react";

type ResetSearch = { next?: string };

function parseHashToken(name: string): string | null {
  const match = window.location.hash.match(new RegExp(`${name}=([^&]*)`));
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset your password — ApplyWise" },
      {
        name: "description",
        content: "Set a new password for your ApplyWise account.",
      },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: ResetPasswordPage,
});

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as ResetSearch;
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const locale = detectLocaleFromPath(pathname);
  const loginHref = alternateHref(locale, "/login");
  const nextPath =
    typeof search.next === "string" && search.next.startsWith("/")
      ? search.next
      : "/dashboard";

  const [status, setStatus] = useState<"loading" | "ready" | "success" | "invalid">(
    "loading"
  );
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [updating, setUpdating] = useState(false);

  const [email, setEmail] = useState("");
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        const type = url.searchParams.get("type");
        const accessToken = parseHashToken("access_token");
        const refreshToken = parseHashToken("refresh_token");

        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (error) throw error;
        } else if (code && type === "recovery") {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        } else {
          throw new Error("No recovery token");
        }

        const { data, error: userError } = await supabase.auth.getUser();
        if (userError || !data.user) throw new Error("No recovered session");

        if (!mounted) return;
        setStatus("ready");
      } catch (err) {
        if (!mounted) return;
        setStatus("invalid");
      }
    }

    init();

    return () => {
      mounted = false;
    };
  }, []);

  async function requestNewLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setRequesting(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}${alternateHref(locale, "/reset-password")}`,
      });
      if (error) throw error;
      toast.success("Reset link sent — check your inbox (and spam).");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not send reset link"
      );
    } finally {
      setRequesting(false);
    }
  }

  async function updatePassword(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }

    setUpdating(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setStatus("success");
      toast.success("Password updated");
      setTimeout(() => {
        navigate({ to: loginHref, search: { next: nextPath } } as never);
      }, 2000);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not update password"
      );
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-aurora lg:block">
        <div className="absolute inset-0 bg-grain opacity-50" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <a href={alternateHref(locale, "/")} className="flex items-center gap-2">
            <span className="font-display text-xl">ApplyWise</span>
          </a>
          <div>
            <h2 className="font-display text-5xl leading-tight tracking-tight">
              AI prompts that help you actually land the job.
            </h2>
            <p className="mt-4 max-w-md text-muted-foreground">
              Loved by 50,000+ candidates preparing tailored CVs, cover
              letters, and interviews.
            </p>
          </div>
          <div className="text-xs text-muted-foreground">© ApplyWise</div>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <a
            href={alternateHref(locale, "/")}
            className="mb-8 inline-flex items-center gap-2 lg:hidden"
          >
            <span className="font-display text-xl">ApplyWise</span>
          </a>

          {status === "loading" && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="mt-4 text-sm text-muted-foreground">
                Verifying your reset link…
              </p>
            </div>
          )}

          {status === "ready" && (
            <>
              <h1 className="font-display text-4xl tracking-tight">
                Reset your password
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Enter a new password for your account.
              </p>
              <form className="mt-8 space-y-4" onSubmit={updatePassword}>
                <div className="space-y-1.5">
                  <Label htmlFor="new-password">New password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="confirm-password">Confirm new password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    required
                    minLength={6}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  disabled={updating}
                  className="w-full rounded-full"
                >
                  {updating ? "Please wait…" : "Update password"}
                </Button>
              </form>
            </>
          )}

          {status === "success" && (
            <div className="mt-8 space-y-4 rounded-2xl border border-border bg-muted/40 p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-display text-xl tracking-tight">
                  Password updated
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Your password has been updated. Redirecting to sign in…
                </p>
              </div>
              <Button asChild size="lg" className="w-full rounded-full">
                <a href={`${loginHref}?next=${encodeURIComponent(nextPath)}`}>
                  Continue to sign in
                </a>
              </Button>
            </div>
          )}

          {status === "invalid" && (
            <div className="mt-8 space-y-4 rounded-2xl border border-border bg-muted/40 p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-display text-xl tracking-tight">
                  Reset link is invalid or expired.
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Enter your email to request a new one.
                </p>
              </div>
              <form className="mt-4 space-y-3 text-left" onSubmit={requestNewLink}>
                <div className="space-y-1.5">
                  <Label htmlFor="resend-email">Email</Label>
                  <Input
                    id="resend-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={requesting || !email}
                  className="w-full rounded-full"
                  size="lg"
                >
                  {requesting ? "Sending…" : "Send reset link"}
                </Button>
              </form>
              <a
                href={`${loginHref}?next=${encodeURIComponent(nextPath)}`}
                className="block w-full text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
              >
                Back to sign in
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
