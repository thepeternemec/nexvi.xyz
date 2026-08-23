import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/bundles")({
  beforeLoad: () => {
    // Permanent (301) so Google consolidates the legacy URL into /prompts
    // instead of reporting it as "Page with redirect".
    throw redirect({ to: "/prompts", statusCode: 301, replace: true });
  },
});
