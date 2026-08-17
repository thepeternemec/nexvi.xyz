import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/es/marketplace")({
  beforeLoad: ({ search }) => {
    throw redirect({ to: "/es/prompts", search: search as never });
  },
  component: () => null,
});

