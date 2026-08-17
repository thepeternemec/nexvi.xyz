import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/fr/marketplace")({
  beforeLoad: () => {
    throw redirect({ to: "/fr/prompts", search: {} as never });
  },
  component: () => null,
});
