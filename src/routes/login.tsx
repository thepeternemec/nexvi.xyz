import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

type LoginSearch = { next?: string };

function isSafeNext(next: string | undefined): next is string {
  return !!next && next.startsWith("/") && !next.startsWith("//");
}

export const Route = createFileRoute("/login")({
  component: Login,
  validateSearch: (s: Record<string, unknown>): LoginSearch => ({
    next: typeof s.next === "string" ? s.next : undefined,
  }),
});

function Login() {
  return <AuthShell title="Welcome back." subtitle="Sign in to keep going." cta="Sign in" alt="Don't have an account?" altLink="/signup" altCta="Create one" />;
}

export function AuthShell({ title, subtitle, cta, alt, altLink, altCta, signup }: { title: string; subtitle: string; cta: string; alt: string; altLink: string; altCta: string; signup?: boolean }) {
  const navigate = useNavigate();
  const search = Route.useSearch() as LoginSearch;
  const nextPath = isSafeNext(search.next) ? search.next : "/dashboard";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (signup) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}${nextPath}`,
            data: { name },
          },
        });
        if (error) throw error;
        toast.success("Check your email to confirm your account.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
        window.location.href = nextPath;
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-aurora lg:block">
        <div className="absolute inset-0 bg-grain opacity-50" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-foreground text-background"><Sparkles className="h-4 w-4" /></div>
            <span className="font-display text-xl">ApplyWise</span>
          </Link>
          <div>
            <h2 className="font-display text-5xl leading-tight tracking-tight">AI prompts that help you actually land the job.</h2>
            <p className="mt-4 max-w-md text-muted-foreground">Loved by 50,000+ candidates preparing tailored CVs, cover letters, and interviews.</p>
          </div>
          <div className="text-xs text-muted-foreground">© ApplyWise</div>
        </div>
      </div>
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <Link to="/" className="mb-8 inline-flex items-center gap-2 lg:hidden">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-foreground text-background"><Sparkles className="h-4 w-4" /></div>
            <span className="font-display text-xl">ApplyWise</span>
          </Link>
          <h1 className="font-display text-4xl tracking-tight">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          <form className="mt-8 space-y-4" onSubmit={onSubmit}>
            {signup && (
              <div className="space-y-1.5">
                <Label htmlFor="name">Your name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex Rivera" />
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <Button type="submit" size="lg" disabled={loading} className="w-full rounded-full">{loading ? "Please wait…" : cta}</Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {alt} <Link to={altLink} search={{ next: nextPath }} className="font-medium text-foreground hover:underline">{altCta}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
