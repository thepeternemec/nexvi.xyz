import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/it/marketplace")({
  beforeLoad: () => {
    throw redirect({ to: "/it/prompts", search: {} as never });
  },
  component: () => null,
});
