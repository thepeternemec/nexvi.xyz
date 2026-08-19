import { createFileRoute } from "@tanstack/react-router";
import { localeHead } from "@/lib/localized-meta";
import { Signup } from "@/routes/signup";

export const Route = createFileRoute("/it/signup")({
  head: () => localeHead("it", "signup"),
  component: Signup });
