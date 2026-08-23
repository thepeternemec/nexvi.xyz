import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/guides/how-to-write-a-resume")({
  beforeLoad: () => {
    throw redirect({ to: "/blog/how-to-write-a-resume", statusCode: 301, replace: true });
  },
});
