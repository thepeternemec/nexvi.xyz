import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/fr/bundles")({
  beforeLoad: () => {
    throw redirect({ to: "/fr/marketplace" });
  },
  component: () => null,
});
