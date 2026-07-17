import { createFileRoute } from "@tanstack/react-router";
import { Signup } from "@/routes/signup";

export const Route = createFileRoute("/it/signup")({ component: Signup });
