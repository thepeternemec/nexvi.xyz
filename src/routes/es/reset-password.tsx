import { createFileRoute } from "@tanstack/react-router";
import { localeHead } from "@/lib/localized-meta";
import { ResetPasswordPage } from "@/routes/reset-password";

export const Route = createFileRoute("/es/reset-password")({
  head: () => localeHead("es", "reset-password"),
  component: ResetPasswordPage,
});
