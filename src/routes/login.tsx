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
import { lovable } from "@/integrations/lovable/index";
import { BrandMark } from "@/components/brand-mark";
import { alternateHref, detectLocaleFromPath } from "@/lib/i18n";
import {
  AlertCircle,
  ArrowRight,
  Check,
  Inbox,
  KeyRound,
  LogIn,
  Mail,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";

type LoginSearch = { next?: string };

function isSafeNext(next: string | undefined): next is string {
  return !!next && next.startsWith("/") && !next.startsWith("//");
}

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Nexvi" },
      { name: "description", content: "Sign in to your Nexvi account." },
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

  const [mode, setMode] = useState<"auth" | "forgot" | "forgot-sent">("auth");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);

  async function signInWithProvider(provider: "google" | "apple") {
    const setBusy = provider === "google" ? setGoogleLoading : setAppleLoading;
    const label = provider === "google" ? "Google" : "Apple";
    setBusy(true);
    try {
      sessionStorage.setItem("nexvi:next", nextPath);
      const result = await lovable.auth.signInWithOAuth(provider, {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        toast.error(result.error.message ?? `Could not sign in with ${label}`);
        return;
      }
      if (result.redirected) return;
      window.location.href = nextPath;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : `Could not sign in with ${label}`);
    } finally {
      setBusy(false);
    }
  }

  const signInWithGoogle = () => signInWithProvider("google");
  const signInWithApple = () => signInWithProvider("apple");


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
            emailRedirectTo: `${window.location.origin}/verify-email?next=${encodeURIComponent(nextPath)}`,
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
          "Email sent — please check your inbox, spam, or junk folder. Sent from noreply@notify.nexvi.xyz."
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
          emailRedirectTo: `${window.location.origin}/verify-email?next=${encodeURIComponent(nextPath)}`,
        },
      });
      if (error) throw error;
      toast.success("Verification email sent — check your inbox, spam, or junk folder. Sent from noreply@notify.nexvi.xyz.");
      setResendCountdown(30);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not resend email"
      );
    } finally {
      setResendLoading(false);
    }
  }

  async function sendResetLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setForgotLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}${href("/reset-password")}`,
      });
      if (error) throw error;
      toast.success("Reset link sent — check your inbox, spam, or junk folder. Sent from noreply@notify.nexvi.xyz.");
      setMode("forgot-sent");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not send reset link"
      );
    } finally {
      setForgotLoading(false);
    }
  }

  const pageTitle =
    mode === "forgot-sent"
      ? "Reset link sent"
      : mode === "forgot"
      ? "Reset your password"
      : title;

  const pageSubtitle =
    mode === "forgot-sent"
      ? "A password reset link was sent to your email. Please check your inbox, then click it to set a new password."
      : mode === "forgot"
      ? "Enter your email and we'll send you a link to reset your password."
      : subtitle;

  const perks = signup
    ? [
        "Tailored CVs scored against the real job description",
        "ATS keyword coverage and formatting checks",
        "Cover letters and Humanizer included, free to start",
      ]
    : [
        "Pick up your saved prompts and documents",
        "Track your ATS scores over time",
        "Credits and plan usage in one dashboard",
      ];

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      {/* Left: Stripe-style signal panel */}
      <div className="relative hidden overflow-hidden border-r border-border/60 lg:block">
        <div className="absolute inset-0 -z-10 bg-signal" />
        <div className="absolute inset-0 -z-10 bg-grid opacity-[0.55] mask-fade-b" />
        <div className="relative flex h-full flex-col justify-between p-12 xl:p-16">
          <a href={href("/")} className="inline-flex items-center gap-2">
            <BrandMark size="md" />
          </a>

          <div className="max-w-md">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-[11px] font-medium tracking-wide text-muted-foreground backdrop-blur">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              Built on the latest Claude &amp; GPT models
            </div>
            <h2 className="mt-6 font-display text-[2.75rem] leading-[1.05] tracking-tight">
              Align your CV to the job,
              <br />
              <span className="text-gradient">not to a template.</span>
            </h2>
            <ul className="mt-8 space-y-3">
              {perks.map((p) => (
                <li key={p} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
                    <Check className="h-3 w-3" />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-between border-t border-border/60 pt-6 text-xs text-muted-foreground">
            <span>© Nexvi</span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" />
              Encrypted &amp; private by default
            </span>
          </div>
        </div>
      </div>

      {/* Right: form */}
      <div className="relative flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-[26rem]">
          <a href={href("/")} className="mb-8 inline-flex items-center gap-2 lg:hidden">
            <BrandMark size="lg" />
          </a>
          <div className="rounded-2xl border border-border/70 bg-card/70 p-7 shadow-[0_24px_60px_-40px_color-mix(in_oklab,var(--primary)_45%,transparent)] backdrop-blur-xl sm:p-8">
            <h1 className="font-display text-3xl tracking-tight">{pageTitle}</h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {pageSubtitle}
            </p>


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
            <div className="mt-8 space-y-4 rounded-2xl border border-border/70 bg-card/70 p-6 text-center shadow-[0_24px_60px_-40px_color-mix(in_oklab,var(--primary)_45%,transparent)] backdrop-blur-xl">
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
                  Please check your inbox and click it to{" "}
                  {signup ? "create your account" : "sign in"}.
                </p>
              </div>

              {/* Deliverability tip */}
              <div className="rounded-xl border border-border/70 bg-muted/50 p-4 text-left">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Inbox className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Can’t find the email?
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      Check your spam, junk, or promotions folder. Messages come from{" "}
                      <span className="font-medium text-foreground">noreply@notify.nexvi.xyz</span>{" "}
                      — add that address to your contacts so future emails land in your inbox.
                    </p>
                  </div>
                </div>
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
          ) : mode === "forgot-sent" ? (
            <div className="mt-8 space-y-4 rounded-2xl border border-border/70 bg-card/70 p-6 text-center shadow-[0_24px_60px_-40px_color-mix(in_oklab,var(--primary)_45%,transparent)] backdrop-blur-xl">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <KeyRound className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-display text-xl tracking-tight">
                  Reset link sent
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  A password reset link was sent to your email. Please check
                  your inbox, then click it to set a new password.
                </p>
              </div>

              {/* Deliverability tip */}
              <div className="rounded-xl border border-border/70 bg-muted/50 p-4 text-left">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Inbox className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Can’t find the email?
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      Check your spam, junk, or promotions folder. Messages come from{" "}
                      <span className="font-medium text-foreground">noreply@notify.nexvi.xyz</span>{" "}
                      — add that address to your contacts so future emails land in your inbox.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                asChild
                size="lg"
                className="w-full rounded-full"
              >
                <a href={`${href("/login")}?next=${encodeURIComponent(nextPath)}`}>
                  <LogIn className="mr-2 h-4 w-4" />
                  Back to sign in
                </a>
              </Button>
            </div>
          ) : mode === "forgot" ? (
            <form className="mt-8 space-y-4" onSubmit={sendResetLink}>
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
              <Button
                type="submit"
                size="lg"
                disabled={forgotLoading}
                className="w-full rounded-full"
              >
                {forgotLoading ? "Please wait…" : "Send reset link"}
              </Button>
              <button
                type="button"
                onClick={() => setMode("auth")}
                className="block w-full text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
              >
                Back to sign in
              </button>
            </form>
          ) : (
            <>
            <div className="mt-8 space-y-4">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={signInWithGoogle}
                disabled={googleLoading}
                className="w-full rounded-full"
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47a5.54 5.54 0 0 1-2.4 3.63v3h3.86c2.26-2.08 3.56-5.15 3.56-8.87Z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.96-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A11.99 11.99 0 0 0 12 24Z" />
                  <path fill="#FBBC05" d="M5.27 14.29a7.19 7.19 0 0 1 0-4.58V6.62H1.29a11.99 11.99 0 0 0 0 10.76l3.98-3.09Z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.7 0 3.99 2.47 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75Z" />
                </svg>
                {googleLoading ? "Please wait…" : "Continue with Google"}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={signInWithApple}
                disabled={appleLoading}
                className="w-full rounded-full"
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
                  <path d="M16.36 12.79c.02 2.63 2.3 3.5 2.33 3.51-.02.06-.37 1.26-1.21 2.5-.73 1.07-1.49 2.13-2.69 2.15-1.18.02-1.56-.7-2.91-.7-1.35 0-1.77.68-2.89.72-1.15.04-2.03-1.15-2.77-2.21-1.6-2.32-2.83-6.56-1.18-9.42.82-1.42 2.28-2.32 3.87-2.35 1.14-.02 2.21.77 2.91.77.69 0 2-.95 3.37-.81.57.02 2.18.21 3.21 1.73-.08.05-1.92 1.12-1.9 3.35M14.4 4.2c.62-.75 1.04-1.79.93-2.83-.89.04-1.98.6-2.62 1.34-.58.66-1.08 1.72-.95 2.74.99.08 2.01-.5 2.64-1.25" />
                </svg>
                {appleLoading ? "Please wait…" : "Continue with Apple"}
              </Button>
              <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-border/70" />
                <span className="text-xs uppercase tracking-wide text-muted-foreground">or</span>
                <span className="h-px flex-1 bg-border/70" />
              </div>
            </div>
            <form className="mt-4 space-y-4" onSubmit={onSubmit}>
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
              {!signup && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setMode("forgot");
                      setPassword("");
                    }}
                    className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
                  >
                    Forgot password?
                  </button>
                </div>
              )}
              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="cta-sheen w-full rounded-full"
              >
                {loading ? "Please wait…" : cta}
                {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </form>
            </>
          )}

            {!existingAccount && !showVerify && mode === "auth" && (
              <p className="mt-6 border-t border-border/60 pt-5 text-center text-sm text-muted-foreground">
                {alt}{" "}
                <a
                  href={`${href(altLink)}?next=${encodeURIComponent(nextPath)}`}
                  className="font-medium text-foreground underline-offset-4 hover:underline"
                >
                  {altCta}
                </a>
              </p>
            )}
          </div>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            By continuing you agree to our{" "}
            <a href={href("/terms")} className="underline underline-offset-4 hover:text-foreground">
              Terms &amp; Privacy
            </a>
            .
          </p>
        </div>
      </div>
    </div>

  );
}
