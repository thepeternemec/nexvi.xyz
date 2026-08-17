import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/marketplace")({
  beforeLoad: ({ search }) => {
    throw redirect({ to: "/prompts", search: search as never });
  },
  component: () => null,
});

