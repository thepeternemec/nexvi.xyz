import { createFileRoute } from "@tanstack/react-router";
import { localeHead } from "@/lib/localized-meta";
import { Signup } from "@/routes/signup";

export const Route = createFileRoute("/de/signup")({
  head: () => localeHead("de", "signup"),
  component: Signup });
