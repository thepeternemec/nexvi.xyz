import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

export const Route = createFileRoute("/ctest2")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const ct = new URL(request.url).searchParams.get("ct") ?? "application/xml";
        return new Response("<a/>", { headers: { "content-type": ct } });
      },
    },
  },
});
