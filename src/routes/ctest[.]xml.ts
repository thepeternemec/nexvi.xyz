import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

export const Route = createFileRoute("/ctest.xml")({
  server: {
    handlers: {
      GET: async () => {
        const h = new Headers();
        h.set("content-type", "application/xml; charset=utf-8");
        h.set("x-probe", "1");
        return new Response("<a/>", { headers: h });
      },
    },
  },
});
