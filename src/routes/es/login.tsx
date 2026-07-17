import { createFileRoute } from "@tanstack/react-router";
import { Login } from "@/routes/login";

export const Route = createFileRoute("/es/login")({ component: Login });
