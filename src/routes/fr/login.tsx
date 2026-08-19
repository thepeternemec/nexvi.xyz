import { createFileRoute } from "@tanstack/react-router";
import { localeHead } from "@/lib/localized-meta";
import { Login } from "@/routes/login";

export const Route = createFileRoute("/fr/login")({
  head: () => localeHead("fr", "login"),
  component: Login });
