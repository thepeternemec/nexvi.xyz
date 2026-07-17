import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "@/routes/dashboard";

export const Route = createFileRoute("/es/dashboard")({ component: Dashboard });
