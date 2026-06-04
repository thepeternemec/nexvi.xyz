import { createFileRoute, Link, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/library")({
  beforeLoad: () => {
    throw redirect({ to: "/marketplace" });
  },
  component: () => <Link to="/marketplace">Go to library</Link>,
});
