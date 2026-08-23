import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/fr/library")({
  beforeLoad: () => {
    // Permanent (301) so Google consolidates the legacy URL into /fr/prompts
    // instead of reporting it as "Page with redirect".
    throw redirect({ to: "/fr/prompts", statusCode: 301, replace: true });
  },
});
