import { createFileRoute } from "@tanstack/react-router";
import { localeHead } from "@/lib/localized-meta";
import { SubscriptionPage } from "@/routes/subscription";

export const Route = createFileRoute("/fr/subscription")({
  head: () => localeHead("fr", "subscription"),
  component: SubscriptionPage });
