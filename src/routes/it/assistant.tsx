import { createFileRoute } from "@tanstack/react-router";
import { Assistant } from "@/routes/assistant";

export const Route = createFileRoute("/it/assistant")({ component: Assistant });
