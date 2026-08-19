import { createFileRoute } from "@tanstack/react-router";
import { localeHead } from "@/lib/localized-meta";
import { AccountSettings } from "@/routes/account";

export const Route = createFileRoute("/it/account")({
  head: () => localeHead("it", "account"),
  component: AccountSettings });
