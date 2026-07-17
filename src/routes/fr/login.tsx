import { createFileRoute } from "@tanstack/react-router";
import { Login } from "@/routes/login";

export const Route = createFileRoute("/fr/login")({ component: Login });
