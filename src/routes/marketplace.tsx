import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/marketplace")({
  beforeLoad: () => {
    throw redirect({ to: "/prompts", search: {} as never });
  },
  component: () => null,
});
