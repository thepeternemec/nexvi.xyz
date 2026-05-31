import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/landing-page";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Prompt Academia — AI prompts for real outcomes" },
      { name: "description", content: "Discover, save, and use AI prompts that help you get a job, study smarter, create content, grow a business, and more." },
      { property: "og:title", content: "Prompt Academia — AI prompts for real outcomes" },
      { property: "og:description", content: "AI prompts and toolkits for real-world outcomes." },
      { property: "og:url", content: "/" },
      { property: "og:locale", content: "en_US" },
      { property: "og:locale:alternate", content: "de_DE" },
    ],
    links: [
      { rel: "canonical", href: "/" },
      { rel: "alternate", hrefLang: "en", href: "/" },
      { rel: "alternate", hrefLang: "de", href: "/ger" },
      { rel: "alternate", hrefLang: "x-default", href: "/" },
    ],
  }),
  component: () => <LandingPage locale="en" />,
});
