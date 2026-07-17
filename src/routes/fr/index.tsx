import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/landing-page";
import { copy } from "@/lib/i18n";

export const Route = createFileRoute("/fr/")({
  head: () => ({
    meta: [
      { title: copy.fr.metaTitle },
      { name: "description", content: copy.fr.metaDesc },
      { property: "og:title", content: copy.fr.metaTitle },
      { property: "og:description", content: copy.fr.metaDesc },
      { property: "og:url", content: "/fr" },
      { property: "og:locale", content: "fr_FR" },
    ],
    links: [
      { rel: "canonical", href: "/fr" },
      { rel: "alternate", hrefLang: "en", href: "/" },
      { rel: "alternate", hrefLang: "de", href: "/de" },
      { rel: "alternate", hrefLang: "es", href: "/es" },
      { rel: "alternate", hrefLang: "it", href: "/it" },
      { rel: "alternate", hrefLang: "fr", href: "/fr" },
      { rel: "alternate", hrefLang: "x-default", href: "/" },
    ],
  }),
  component: () => <LandingPage locale="fr" />,
});
