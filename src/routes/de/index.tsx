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
        { rel: "alternate", hrefLang: "en", href: "https://nexvi.xyz/" },
        { rel: "alternate", hrefLang: "de", href: "https://nexvi.xyz/de" },
        { rel: "alternate", hrefLang: "es", href: "https://nexvi.xyz/es" },
        { rel: "alternate", hrefLang: "it", href: "https://nexvi.xyz/it" },
        { rel: "alternate", hrefLang: "fr", href: "https://nexvi.xyz/fr" },
        { rel: "alternate", hrefLang: "x-default", href: "https://nexvi.xyz/" },
      ],
    }),
    component: () => <LandingPage locale={locale} />,
  };
}

export const Route = createFileRoute("/de/")(make("de", "https://nexvi.xyz/de", "de_DE"));
