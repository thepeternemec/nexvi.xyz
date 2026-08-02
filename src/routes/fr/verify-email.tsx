import { createFileRoute } from "@tanstack/react-router";
import { VerifyEmailPage } from "@/routes/verify-email";

export const Route = createFileRoute("/fr/verify-email")({ component: VerifyEmailPage });
