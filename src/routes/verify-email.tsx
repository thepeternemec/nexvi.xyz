import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2, Loader2, Mail } from "lucide-react";

type VerifySearch = {
  next?: string;
  code?: string;
  type?: string;
};

type Status = "verifying" | "confirmed" | "expired" | "lookup";

export const Route = createFileRoute("/verify-email")({
  head: () => ({
    meta: [
      { title: "Verify your email — ApplyWise" },
      { name: "description", content: "Verify your ApplyWise email address." },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: VerifyEmailPage,
});

function parseHashToken(name: string): string | null {
  const match = window.location.hash.match(new RegExp(`${name}=([^&]*)`));
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

export function VerifyEmailPage() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as VerifySearch;
  const nextPath =
    typeof search.next === "string" && search.next.startsWith("/")
      ? search.next
      : "/dashboard";
  const [status, setStatus] = useState<Status>("verifying");
  const [email, setEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function runVerification() {
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
        } else if (code && (type === "signup" || type === "email")) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        }

        const { data, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;

        const confirmed = !!data.user?.email_confirmed_at;
        if (!mounted) return;

        if (confirmed) {
          setStatus("confirmed");
          toast.success("Email confirmed. Redirecting to sign in…");
          const timer = setTimeout(() => {
            navigate({
              to: "/login",
              search: { next: nextPath },
            } as never);
          }, 2500);
          return () => clearTimeout(timer);
        }

        // No token and not confirmed — ask the user to check their inbox or resend.
        setStatus("lookup");
      } catch (err) {
        if (!mounted) return;
        setStatus("expired");
        toast.error(
          err instanceof Error ? err.message : "Verification link is invalid or expired."
        );
      }
    }

    runVerification();

    return () => {
      mounted = false;
    };
  }, [navigate, nextPath]);

  async function resendEmail() {
    if (!email) return;
    setResendLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/verify-email?next=${encodeURIComponent(nextPath)}`,
        },
      });
      if (error) throw error;
      toast.success("Verification email resent — check your inbox (and spam).");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not resend email");
    } finally {
      setResendLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm space-y-6 text-center">
        <a href="/" className="inline-flex items-center justify-center gap-2">
          <BrandMark size="lg" />
        </a>

        {status === "verifying" && (
          <div className="rounded-2xl border border-border bg-muted/40 p-8">
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
            <h1 className="mt-4 font-display text-2xl tracking-tight">Verifying your email…</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Hang tight while we confirm your email address.
            </p>
          </div>
        )}

        {status === "confirmed" && (
          <div className="rounded-2xl border border-border bg-muted/40 p-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h1 className="mt-4 font-display text-2xl tracking-tight">
              You’re all set
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Your email is verified. We’re redirecting you to sign in.
            </p>
            <Button
              asChild
              className="mt-4 w-full rounded-full"
              size="lg"
            >
              <a href={`/login?next=${encodeURIComponent(nextPath)}`}>Continue to sign in</a>
            </Button>
          </div>
        )}

        {(status === "expired" || status === "lookup") && (
          <div className="rounded-2xl border border-border bg-muted/40 p-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Mail className="h-6 w-6" />
            </div>
            <h1 className="mt-4 font-display text-2xl tracking-tight">
              Check your inbox
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {status === "expired"
                ? "This verification link is invalid or has expired. Enter your email and we’ll send a fresh link."
                : "We haven't confirmed your email yet. Open the link we sent, or enter your email to resend it."}
            </p>
            <div className="mt-6 space-y-3 text-left">
              <div className="space-y-1.5">
                <Label htmlFor="resend-email">Email</Label>
                <Input
                  id="resend-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
              <Button
                onClick={resendEmail}
                disabled={resendLoading || !email}
                className="w-full rounded-full"
                size="lg"
              >
                {resendLoading ? "Sending…" : "Resend verification email"}
              </Button>
            </div>
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Didn’t arrive? Check your spam or promotions folder.
        </p>
      </div>
    </div>
  );
}
