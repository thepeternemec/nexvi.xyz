import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/fr/marketplace")({
  beforeLoad: ({ search }) => {
    throw redirect({ to: "/fr/prompts", search: search as never });
  },
  component: () => null,
});

