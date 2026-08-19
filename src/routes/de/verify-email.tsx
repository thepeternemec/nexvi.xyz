import { createFileRoute } from "@tanstack/react-router";
import { localeHead } from "@/lib/localized-meta";
import { VerifyEmailPage } from "@/routes/verify-email";

export const Route = createFileRoute("/de/verify-email")({
  head: () => localeHead("de", "verify-email"),
  component: VerifyEmailPage });
