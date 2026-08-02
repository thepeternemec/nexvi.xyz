import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "@/routes/about";

export const Route = createFileRoute("/fr/about")({ component: AboutPage });
