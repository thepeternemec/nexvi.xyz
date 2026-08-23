import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/marketplace")({
  beforeLoad: () => {
    // Permanent (301) so Google consolidates the legacy URL into /prompts
    // instead of reporting it as "Page with redirect".
    throw redirect({ to: "/prompts", search: {} as never, statusCode: 301, replace: true });
  },
});
