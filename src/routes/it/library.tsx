import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/it/library")({
  beforeLoad: () => {
    throw redirect({ to: "/it/marketplace", search: {} });
  },
  component: () => null,
});
