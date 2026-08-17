import { createFileRoute, Link, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/library")({
  beforeLoad: () => {
    throw redirect({ to: "/prompts" });
  },
  component: () => <Link to="/prompts">Go to library</Link>,
});
