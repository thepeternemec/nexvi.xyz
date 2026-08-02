import { createFileRoute } from "@tanstack/react-router";
import { SubscriptionPage } from "@/routes/subscription";

export const Route = createFileRoute("/it/subscription")({ component: SubscriptionPage });
