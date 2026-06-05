import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/landing-page";

export const Route = createFileRoute("/ger/")({
  head: () => ({
    meta: [
      { title: "getHeired — KI-CVs, Anschreiben Prompt Academia — KI-Prompts für echte Ergebnisse ATS-Optimierung" },
      { name: "description", content: "Füge eine Stellenbeschreibung ein. Erhalte einen ATS-optimierten Lebenslauf, ein passgenaues Anschreiben und einen Match-Score — in 60 Sekunden." },
      { property: "og:title", content: "getHeired — KI-CVs, Anschreiben Prompt Academia — KI-Prompts für echte Ergebnisse ATS-Optimierung" },
      { property: "og:description", content: "KI-Lebensläufe, Anschreiben und ATS-Scoring, abgestimmt auf jede Stellenanzeige." },
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
  component: LandingPage,
});
