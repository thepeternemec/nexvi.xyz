import { createFileRoute } from "@tanstack/react-router";
import { localeHead } from "@/lib/localized-meta";
import { Login } from "@/routes/login";

export const Route = createFileRoute("/it/login")({
  head: () => localeHead("it", "login"),
  component: Login });
