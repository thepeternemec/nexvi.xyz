import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/landing-page";
import { copy, type Locale } from "@/lib/i18n";

function make(locale: Locale, path: string, ogLocale: string) {
  return {
    head: () => ({
      meta: [
        { title: copy[locale].metaTitle },
        { name: "description", content: copy[locale].metaDesc },
        { property: "og:title", content: copy[locale].metaTitle },
        { property: "og:description", content: copy[locale].metaDesc },
        { property: "og:url", content: path },
        { property: "og:locale", content: ogLocale },
      ],
      links: [
        { rel: "canonical", href: path },
        { rel: "alternate", hrefLang: "en", href: "/" },
        { rel: "alternate", hrefLang: "de", href: "/de" },
        { rel: "alternate", hrefLang: "es", href: "/es" },
        { rel: "alternate", hrefLang: "it", href: "/it" },
        { rel: "alternate", hrefLang: "fr", href: "/fr" },
        { rel: "alternate", hrefLang: "x-default", href: "/" },
      ],
    }),
    component: () => <LandingPage locale={locale} />,
  };
}

export const Route = createFileRoute("/de/")(make("de", "/de", "de_DE"));
