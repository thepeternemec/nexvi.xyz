import { createFileRoute } from "@tanstack/react-router";
import { localeHead } from "@/lib/localized-meta";
import { AccountSettings } from "@/routes/account";

export const Route = createFileRoute("/fr/account")({
  head: () => localeHead("fr", "account"),
  component: AccountSettings });
