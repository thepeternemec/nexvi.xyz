import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/it/bundles")({
  beforeLoad: () => {
    // Permanent (301) so Google consolidates the legacy URL into /it/prompts
    // instead of reporting it as "Page with redirect".
    throw redirect({ to: "/it/prompts", search: {} as never, statusCode: 301, replace: true });
  },
});
