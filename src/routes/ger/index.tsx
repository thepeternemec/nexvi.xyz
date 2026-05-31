import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/landing-page";

export const Route = createFileRoute("/ger/")({
  head: () => ({
    meta: [
      { title: "Prompt Academia — KI-Prompts für echte Ergebnisse" },
      { name: "description", content: "Entdecke, speichere und nutze KI-Prompts, die dir helfen, einen Job zu finden, smarter zu lernen, Content zu erstellen, ein Business aufzubauen und mehr." },
      { property: "og:title", content: "Prompt Academia — KI-Prompts für echte Ergebnisse" },
      { property: "og:description", content: "KI-Prompts und Toolkits für echte Ergebnisse im Alltag." },
      { property: "og:url", content: "/ger" },
      { property: "og:locale", content: "de_DE" },
      { property: "og:locale:alternate", content: "en_US" },
    ],
    links: [
      { rel: "canonical", href: "/ger" },
      { rel: "alternate", hrefLang: "en", href: "/" },
      { rel: "alternate", hrefLang: "de", href: "/ger" },
      { rel: "alternate", hrefLang: "x-default", href: "/" },
    ],
  }),
  component: () => <LandingPage locale="de" />,
});
