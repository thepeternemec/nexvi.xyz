import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/de/marketplace")({
  beforeLoad: ({ search }) => {
    throw redirect({ to: "/de/prompts", search: search as never });
  },
  component: () => null,
});

