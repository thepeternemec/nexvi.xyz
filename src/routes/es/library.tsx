import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/es/library")({
  beforeLoad: () => {
    throw redirect({ to: "/es/marketplace", search: {} as never });
  },
  component: () => null,
});
