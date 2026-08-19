import { createFileRoute } from "@tanstack/react-router";
import { localeHead } from "@/lib/localized-meta";
import { VerifyEmailPage } from "@/routes/verify-email";

export const Route = createFileRoute("/it/verify-email")({
  head: () => localeHead("it", "verify-email"),
  component: VerifyEmailPage });
