import { createFileRoute } from "@tanstack/react-router";
import { localeHead } from "@/lib/localized-meta";
import { ResetPasswordPage } from "@/routes/reset-password";

export const Route = createFileRoute("/it/reset-password")({
  head: () => localeHead("it", "reset-password"),
  component: ResetPasswordPage,
});
