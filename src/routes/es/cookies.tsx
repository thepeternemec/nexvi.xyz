import { createFileRoute } from "@tanstack/react-router";
import { CookiesPage } from "@/routes/cookies";

export const Route = createFileRoute("/es/cookies")({ component: CookiesPage });
