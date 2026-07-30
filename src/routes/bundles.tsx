import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/bundles")({
  beforeLoad: () => {
    throw redirect({ to: "/marketplace", search: {} as never });
  },
  component: () => null,
});
