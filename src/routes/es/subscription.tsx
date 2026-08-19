import { createFileRoute } from "@tanstack/react-router";
import { localeHead } from "@/lib/localized-meta";
import { SubscriptionPage } from "@/routes/subscription";

export const Route = createFileRoute("/es/subscription")({
  head: () => localeHead("es", "subscription"),
  component: SubscriptionPage });
