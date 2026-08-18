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
      { property: "og:url", content: "https://nexvi.xyz/es" },
      { property: "og:locale", content: "es_ES" },
    ],
    links: [
      { rel: "canonical", href: "https://nexvi.xyz/es" },
      { rel: "alternate", hrefLang: "en", href: "https://nexvi.xyz/" },
      { rel: "alternate", hrefLang: "de", href: "https://nexvi.xyz/de" },
      { rel: "alternate", hrefLang: "es", href: "https://nexvi.xyz/es" },
      { rel: "alternate", hrefLang: "it", href: "https://nexvi.xyz/it" },
      { rel: "alternate", hrefLang: "fr", href: "https://nexvi.xyz/fr" },
      { rel: "alternate", hrefLang: "x-default", href: "https://nexvi.xyz/" },
    ],
  }),
  component: () => <LandingPage locale="es" />,
});
