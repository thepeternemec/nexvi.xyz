import { createFileRoute } from "@tanstack/react-router";
import { localeHead } from "@/lib/localized-meta";
import { ResetPasswordPage } from "@/routes/reset-password";

export const Route = createFileRoute("/fr/reset-password")({
  head: () => localeHead("fr", "reset-password"),
  component: ResetPasswordPage,
});
