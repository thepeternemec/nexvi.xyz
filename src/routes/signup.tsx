import { createFileRoute } from "@tanstack/react-router";
import { AuthShell } from "./login";

export const Route = createFileRoute("/signup")({ component: Signup });

function Signup() {
  return <AuthShell signup title="Create your account." subtitle="Free forever. Upgrade when you're ready." cta="Create account" alt="Already have an account?" altLink="/login" altCta="Sign in" />;
}
