import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/it/bundles")({
  beforeLoad: () => {
    throw redirect({ to: "/it/prompts", search: {} as never });
  },
  component: () => null,
});
