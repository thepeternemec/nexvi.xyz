import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/landing-page";
import { copy } from "@/lib/i18n";

export const Route = createFileRoute("/it/")({
  head: () => ({
    meta: [
      { title: copy.it.metaTitle },
      { name: "description", content: copy.it.metaDesc },
      { property: "og:title", content: copy.it.metaTitle },
      { property: "og:description", content: copy.it.metaDesc },
      { property: "og:url", content: "/it" },
      { property: "og:locale", content: "it_IT" },
    ],
    links: [
      { rel: "canonical", href: "/it" },
      { rel: "alternate", hrefLang: "en", href: "/" },
      { rel: "alternate", hrefLang: "de", href: "/de" },
      { rel: "alternate", hrefLang: "es", href: "/es" },
      { rel: "alternate", hrefLang: "it", href: "/it" },
      { rel: "alternate", hrefLang: "fr", href: "/fr" },
      { rel: "alternate", hrefLang: "x-default", href: "/" },
    ],
  }),
  component: () => <LandingPage locale="it" />,
});
