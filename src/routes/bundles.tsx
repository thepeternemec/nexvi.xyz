import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/bundles")({
  beforeLoad: () => {
    throw redirect({ to: "/prompts", search: {} as never });
  },
  component: () => null,
});
