import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/fr/library")({
  beforeLoad: () => {
    throw redirect({ to: "/fr/prompts", search: {} as never });
  },
  component: () => null,
});
