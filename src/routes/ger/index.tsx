import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/landing-page";
import { copy } from "@/lib/i18n";

// Legacy path kept for backwards compatibility; canonical is /de.
export const Route = createFileRoute("/ger/")({
  head: () => ({
    meta: [
      { title: copy.de.metaTitle },
      { name: "description", content: copy.de.metaDesc },
      { property: "og:locale", content: "de_DE" },
    ],
    links: [{ rel: "canonical", href: "/de" }],
  }),
  component: () => <LandingPage locale="de" />,
});
