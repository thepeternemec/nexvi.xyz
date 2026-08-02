import { createFileRoute } from "@tanstack/react-router";
import { SubscriptionPage } from "@/routes/subscription";

export const Route = createFileRoute("/es/subscription")({ component: SubscriptionPage });
