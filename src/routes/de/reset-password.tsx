import { createFileRoute } from "@tanstack/react-router";
import { localeHead } from "@/lib/localized-meta";
import { ResetPasswordPage } from "@/routes/reset-password";

export const Route = createFileRoute("/de/reset-password")({
  head: () => localeHead("de", "reset-password"),
  component: ResetPasswordPage,
});
