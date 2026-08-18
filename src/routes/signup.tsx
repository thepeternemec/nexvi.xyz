import { createFileRoute } from "@tanstack/react-router";
import { AuthShell } from "./login";

type SignupSearch = { next?: string };

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create your account — Nexvi" },
      { name: "description", content: "Create a free Nexvi account." },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: Signup,

  validateSearch: (s: Record<string, unknown>): SignupSearch => ({
    next: typeof s.next === "string" ? s.next : undefined,
  }),
});

export function Signup() {
  return <AuthShell signup title="Create your account." subtitle="Free forever. Upgrade when you're ready." cta="Create account" alt="Already have an account?" altLink="/login" altCta="Sign in" />;
}
