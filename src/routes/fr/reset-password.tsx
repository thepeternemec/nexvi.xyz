import { createFileRoute } from "@tanstack/react-router";
import { ResetPasswordPage } from "@/routes/reset-password";

export const Route = createFileRoute("/fr/reset-password")({
  component: ResetPasswordPage,
});
