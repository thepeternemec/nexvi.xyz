import { createFileRoute } from "@tanstack/react-router";
import { StatusPage } from "@/routes/status";

export const Route = createFileRoute("/de/status")({ component: StatusPage });
