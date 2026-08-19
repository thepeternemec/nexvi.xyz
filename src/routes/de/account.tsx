import { createFileRoute } from "@tanstack/react-router";
import { localeHead } from "@/lib/localized-meta";
import { AccountSettings } from "@/routes/account";

export const Route = createFileRoute("/de/account")({
  head: () => localeHead("de", "account"),
  component: AccountSettings });
