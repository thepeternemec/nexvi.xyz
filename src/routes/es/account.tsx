import { createFileRoute } from "@tanstack/react-router";
import { localeHead } from "@/lib/localized-meta";
import { AccountSettings } from "@/routes/account";

export const Route = createFileRoute("/es/account")({
  head: () => localeHead("es", "account"),
  component: AccountSettings });
