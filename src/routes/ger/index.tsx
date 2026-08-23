import { createFileRoute, redirect } from "@tanstack/react-router";

// Legacy path: permanently redirects to the canonical German landing page.
export const Route = createFileRoute("/ger/")({
  beforeLoad: () => {
    throw redirect({ to: "/de", statusCode: 301, replace: true });
  },
});
