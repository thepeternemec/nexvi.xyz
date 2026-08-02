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
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "ApplyWise",
          url: "https://applywise.eu",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          description:
            "AI tools that tailor your CV and cover letter to a specific job description, score it against ATS filters and humanize AI-written text.",
          featureList: [
            "AI CV generator tailored to a job description",
            "Cover letter writer",
            "ATS match score with keyword, formatting and length breakdown",
            "AI text humanizer",
            "Job-search prompt library",
          ],
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "What is ApplyWise?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "ApplyWise is an AI platform that aligns your CV and cover letter with a specific job description, scores the result against ATS filters and shows exactly what to fix before you apply.",
              },
            },
            {
              "@type": "Question",
              name: "How does the ATS match score work?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Paste your CV and the job description. ApplyWise returns a match percentage broken down into keyword coverage, formatting checks, section coverage and length, plus specific rewrite recommendations.",
              },
            },
            {
              "@type": "Question",
              name: "Is ApplyWise free?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. Free accounts get three generations on every tool each month, with no credit card required. Pro unlocks unlimited generations and the full prompt library.",
              },
            },
            {
              "@type": "Question",
              name: "Which AI models does ApplyWise use?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "ApplyWise runs on frontier Claude and GPT models, so generated CVs and cover letters read naturally instead of like template text.",
              },
            },
            {
              "@type": "Question",
              name: "Which languages are supported?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "English, German, Spanish, Italian and French, both in the interface and in generated documents.",
              },
            },
          ],
        }),
      },
    ],
  }),
  component: () => <LandingPage locale="en" />,
});
