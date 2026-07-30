import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/it/bundles")({
  beforeLoad: () => {
    throw redirect({ to: "/it/marketplace", search: {} as never });
  },
  component: () => null,
});
