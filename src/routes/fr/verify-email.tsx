import { createFileRoute } from "@tanstack/react-router";
import { localeHead } from "@/lib/localized-meta";
import { VerifyEmailPage } from "@/routes/verify-email";

export const Route = createFileRoute("/fr/verify-email")({
  head: () => localeHead("fr", "verify-email"),
  component: VerifyEmailPage });
