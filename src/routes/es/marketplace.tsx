import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/es/marketplace")({
  beforeLoad: () => {
    throw redirect({ to: "/es/prompts", search: {} as never });
  },
  component: () => null,
});
