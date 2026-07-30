import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/de/bundles")({
  beforeLoad: () => {
    throw redirect({ to: "/de/marketplace" });
  },
  component: () => null,
});
