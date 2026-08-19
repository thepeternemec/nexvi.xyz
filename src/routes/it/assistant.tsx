import { createFileRoute } from "@tanstack/react-router";
import { localeHead } from "@/lib/localized-meta";
import { Assistant } from "@/routes/assistant";

export const Route = createFileRoute("/it/assistant")({
  head: () => localeHead("it", "assistant"),
  component: Assistant });
