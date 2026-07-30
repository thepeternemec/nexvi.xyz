import {
  createFileRoute,
  useRouterState,
  useSearch,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { alternateHref, detectLocaleFromPath } from "@/lib/i18n";
import { AlertCircle, LogIn, Mail, RotateCcw } from "lucide-react";

type LoginSearch = { next?: string };

function isSafeNext(next: string | undefined): next is string {
  return !!next && next.startsWith("/") && !next.startsWith("//");
}

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — ApplyWise" },
      { name: "description", content: "Sign in to your ApplyWise account." },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: Login,

  validateSearch: (s: Record<string, unknown>): LoginSearch => ({
    next: typeof s.next === "string" ? s.next : undefined,
  }),
});

export function Login() {
  return (
    <AuthShell
      title="Welcome back."
      subtitle="Sign in to keep going."
      cta="Sign in"
      alt="Don't have an account?"
      altLink="/signup"
      altCta="Create one"
    />
  );
}

export function AuthShell({
  title,
  subtitle,
  cta,
  alt,
  altLink,
  altCta,
  signup,
}: {
  title: string;
  subtitle: string;
  cta: string;
  alt: string;
  altLink: string;
  altCta: string;
  signup?: boolean;
}) {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as LoginSearch;
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const locale = detectLocaleFromPath(pathname);
  const href = (p: string) => alternateHref(locale, p);
  const nextPath = isSafeNext(search.next) ? search.next : href("/dashboard");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [existingAccount, setExistingAccount] = useState(false);

  const [resendLoading, setResendLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = setTimeout(() => setResendCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (signup) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}${nextPath}`,
            data: { name },
          },
        });
        if (error) throw error;
        // Supabase returns a user with an empty `identities` array when the
        // email is already registered — no confirmation email is sent.
        if (data.user && (data.user.identities?.length ?? 0) === 0) {
          toast.error(
            "This email already has an account — no verification email was sent. Sign in instead."
          );
          setExistingAccount(true);
          setShowVerify(false);
          return;
        }
        if (data.session) {
          toast.success("Account created!");
          window.location.href = nextPath;
          return;
        }
        toast.success(
          "Email sent — please check your inbox and spam folders."
        );
        setShowVerify(true);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Welcome back!");
        window.location.href = nextPath;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      if (
        typeof message === "string" &&
        message.toLowerCase().includes("email not confirmed")
      ) {
        setShowVerify(true);
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function resendVerification() {
    if (!email || resendCountdown > 0) return;
    setResendLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: {
          emailRedirectTo: `${window.location.origin}${nextPath}`,
        },
      });
      if (error) throw error;
      toast.success("Verification email sent — check your inbox (and spam).");
      setResendCountdown(30);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not resend email"
      );
    } finally {
      setResendLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-aurora lg:block">
        <div className="absolute inset-0 bg-grain opacity-50" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <a href={href("/")} className="flex items-center gap-2">
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
          <a href={href("/")} className="mb-8 inline-flex items-center gap-2 lg:hidden">
            <span className="font-display text-xl">ApplyWise</span>
          </a>
          <h1 className="font-display text-4xl tracking-tight">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>

          {existingAccount ? (
            <div className="mt-8 space-y-4 rounded-2xl border border-border bg-muted/40 p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-display text-xl tracking-tight">
                  This email already has an account
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  We didn't send a verification email because{" "}
                  <span className="font-medium text-foreground">{email}</span>{" "}
                  is already registered.
                </p>
              </div>
              <Button asChild size="lg" className="w-full rounded-full">
                <a href={`${href("/login")}?next=${encodeURIComponent(nextPath)}`}>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign in with this email
                </a>
              </Button>
              <button
                type="button"
                onClick={() => {
                  setExistingAccount(false);
                  setPassword("");
                }}
                className="block w-full text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
              >
                Use a different email
              </button>
            </div>
          ) : showVerify ? (
            <div className="mt-8 space-y-4 rounded-2xl border border-border bg-muted/40 p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-display text-xl tracking-tight">
                  {signup
                    ? "Confirm your email to finish signing up"
                    : "Confirm your email to finish signing in"}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  A verification link was sent to{" "}
                  <span className="font-medium text-foreground">{email}</span>.
                  Please check your inbox and spam folders, then click it to{" "}
                  {signup ? "create your account" : "sign in"}.
                </p>
              </div>
              <Button
                variant="outline"
                className="w-full rounded-full"
                onClick={resendVerification}
                disabled={resendLoading || resendCountdown > 0}
              >
                <RotateCcw
                  className={`mr-2 h-4 w-4 ${resendLoading ? "animate-spin" : ""}`}
                />
                {resendCountdown > 0
                  ? `Resend in ${resendCountdown}s`
                  : "Resend verification email"}
              </Button>
              <button
                type="button"
                onClick={() => {
                  setShowVerify(false);
                  setPassword("");
                }}
                className="block w-full text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
              >
                Back to {signup ? "sign up" : "sign in"}
              </button>
            </div>
          ) : (
            <form className="mt-8 space-y-4" onSubmit={onSubmit}>
              {signup && (
                <div className="space-y-1.5">
                  <Label htmlFor="name">Your name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Rivera"
                  />
                </div>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="w-full rounded-full"
              >
                {loading ? "Please wait…" : cta}
              </Button>
            </form>
          )}

          {!existingAccount && !showVerify && (
            <p className="mt-6 text-center text-sm text-muted-foreground">
              {alt}{" "}
              <a
                href={`${href(altLink)}?next=${encodeURIComponent(nextPath)}`}
                className="font-medium text-foreground hover:underline"
              >
                {altCta}
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
