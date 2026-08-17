import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/it/marketplace")({
  beforeLoad: ({ search }) => {
    throw redirect({ to: "/it/prompts", search: search as never });
  },
  component: () => null,
});

