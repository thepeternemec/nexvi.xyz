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
      { property: "og:url", content: "https://applywise.eu/it" },
      { property: "og:locale", content: "it_IT" },
    ],
    links: [
      { rel: "canonical", href: "https://applywise.eu/it" },
      { rel: "alternate", hrefLang: "en", href: "https://applywise.eu/" },
      { rel: "alternate", hrefLang: "de", href: "https://applywise.eu/de" },
      { rel: "alternate", hrefLang: "es", href: "https://applywise.eu/es" },
      { rel: "alternate", hrefLang: "it", href: "https://applywise.eu/it" },
      { rel: "alternate", hrefLang: "fr", href: "https://applywise.eu/fr" },
      { rel: "alternate", hrefLang: "x-default", href: "https://applywise.eu/" },
    ],
  }),
  component: () => <LandingPage locale="it" />,
});
