import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/de/marketplace")({
  beforeLoad: () => {
    // Permanent (301) so Google consolidates the legacy URL into /de/prompts
    // instead of reporting it as "Page with redirect".
    throw redirect({ to: "/de/prompts", statusCode: 301, replace: true });
  },
});
