import { createFileRoute } from "@tanstack/react-router";
import { StatusPage } from "@/routes/status";

export const Route = createFileRoute("/fr/status")({ component: StatusPage });
