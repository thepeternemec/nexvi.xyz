import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  return <AuthShell title="Welcome back." subtitle="Sign in to keep going." cta="Sign in" alt="Don't have an account?" altLink="/signup" altCta="Create one" />;
}

export function AuthShell({ title, subtitle, cta, alt, altLink, altCta, signup }: { title: string; subtitle: string; cta: string; alt: string; altLink: string; altCta: string; signup?: boolean }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-aurora lg:block">
        <div className="absolute inset-0 bg-grain opacity-50" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-amber-400 text-white"><Sparkles className="h-4 w-4" /></div>
            <span className="font-display text-xl">Prompt Academia</span>
          </Link>
          <div>
            <h2 className="font-display text-5xl leading-tight tracking-tight">AI prompts that help you actually get things done.</h2>
            <p className="mt-4 max-w-md text-muted-foreground">Loved by 50,000+ students, creators, freelancers, and small business owners.</p>
          </div>
          <div className="text-xs text-muted-foreground">© Prompt Academia</div>
        </div>
      </div>
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <Link to="/" className="mb-8 inline-flex items-center gap-2 lg:hidden">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-amber-400 text-white"><Sparkles className="h-4 w-4" /></div>
            <span className="font-display text-xl">Prompt Academia</span>
          </Link>
          <h1 className="font-display text-4xl tracking-tight">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          <form className="mt-8 space-y-4" onSubmit={(e) => { e.preventDefault(); window.location.href = "/dashboard"; }}>
            {signup && (
              <div className="space-y-1.5">
                <Label htmlFor="name">Your name</Label>
                <Input id="name" placeholder="Alex Rivera" />
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" />
            </div>
            <Button type="submit" size="lg" className="w-full rounded-full">{cta}</Button>
          </form>
          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
          </div>
          <Button variant="outline" className="w-full rounded-full">Continue with Google</Button>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {alt} <Link to={altLink} className="font-medium text-foreground hover:underline">{altCta}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
