import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/landing-page";
import { copy } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: copy.en.metaTitle },
      { name: "description", content: copy.en.metaDesc },
      { property: "og:title", content: copy.en.metaTitle },
      { property: "og:description", content: copy.en.metaDesc },
      { property: "og:url", content: "https://applywise.eu/" },
      { property: "og:locale", content: "en_US" },
      { property: "og:locale:alternate", content: "de_DE" },
      { property: "og:locale:alternate", content: "es_ES" },
      { property: "og:locale:alternate", content: "it_IT" },
      { property: "og:locale:alternate", content: "fr_FR" },
    ],
    links: [
      { rel: "canonical", href: "https://applywise.eu/" },
      { rel: "alternate", hrefLang: "en", href: "https://applywise.eu/" },
      { rel: "alternate", hrefLang: "de", href: "https://applywise.eu/de" },
      { rel: "alternate", hrefLang: "es", href: "https://applywise.eu/es" },
      { rel: "alternate", hrefLang: "it", href: "https://applywise.eu/it" },
      { rel: "alternate", hrefLang: "fr", href: "https://applywise.eu/fr" },
      { rel: "alternate", hrefLang: "x-default", href: "https://applywise.eu/" },
    ],
  }),
  component: () => <LandingPage locale="en" />,
});
