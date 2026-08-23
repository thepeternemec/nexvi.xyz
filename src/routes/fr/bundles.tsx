import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/fr/bundles")({
  beforeLoad: () => {
    // Permanent (301) so Google consolidates the legacy URL into /fr/prompts
    // instead of reporting it as "Page with redirect".
    throw redirect({ to: "/fr/prompts", search: {} as never, statusCode: 301, replace: true });
  },
});
