import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/landing-page";
import { copy } from "@/lib/i18n";

export const Route = createFileRoute("/es/")({
  head: () => ({
    meta: [
      { title: copy.es.metaTitle },
      { name: "description", content: copy.es.metaDesc },
      { property: "og:title", content: copy.es.metaTitle },
      { property: "og:description", content: copy.es.metaDesc },
      { property: "og:url", content: "/es" },
      { property: "og:locale", content: "es_ES" },
    ],
    links: [
      { rel: "canonical", href: "/es" },
      { rel: "alternate", hrefLang: "en", href: "/" },
      { rel: "alternate", hrefLang: "de", href: "/de" },
      { rel: "alternate", hrefLang: "es", href: "/es" },
      { rel: "alternate", hrefLang: "it", href: "/it" },
      { rel: "alternate", hrefLang: "fr", href: "/fr" },
      { rel: "alternate", hrefLang: "x-default", href: "/" },
    ],
  }),
  component: () => <LandingPage locale="es" />,
});
