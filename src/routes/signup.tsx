import { createFileRoute } from "@tanstack/react-router";
import { AuthShell } from "./login";

type SignupSearch = { next?: string };

export const Route = createFileRoute("/signup")({
  component: Signup,
  validateSearch: (s: Record<string, unknown>): SignupSearch => ({
    next: typeof s.next === "string" ? s.next : undefined,
  }),
});

export function Signup() {
  return <AuthShell signup title="Create your account." subtitle="Free forever. Upgrade when you're ready." cta="Create account" alt="Already have an account?" altLink="/login" altCta="Sign in" />;
}
