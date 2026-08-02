import { createFileRoute } from "@tanstack/react-router";
import { CookiesPage } from "@/routes/cookies";

export const Route = createFileRoute("/de/cookies")({ component: CookiesPage });
