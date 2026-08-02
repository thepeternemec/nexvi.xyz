import { createFileRoute } from "@tanstack/react-router";
import { HumanizerPage } from "@/routes/humanizer";

export const Route = createFileRoute("/de/humanizer")({ component: HumanizerPage });
