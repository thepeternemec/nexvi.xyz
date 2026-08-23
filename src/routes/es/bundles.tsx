import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/es/bundles")({
  beforeLoad: () => {
    // Permanent (301) so Google consolidates the legacy URL into /es/prompts
    // instead of reporting it as "Page with redirect".
    throw redirect({ to: "/es/prompts", search: {} as never, statusCode: 301, replace: true });
  },
});
