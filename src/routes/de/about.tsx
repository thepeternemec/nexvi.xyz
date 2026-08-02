import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "@/routes/about";

export const Route = createFileRoute("/de/about")({ component: AboutPage });
