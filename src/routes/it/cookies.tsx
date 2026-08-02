import { createFileRoute } from "@tanstack/react-router";
import { CookiesPage } from "@/routes/cookies";

export const Route = createFileRoute("/it/cookies")({ component: CookiesPage });
