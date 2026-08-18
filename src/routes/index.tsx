import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/landing-page";
import { copy } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nexvi — AI CV Generator, Cover Letters & ATS Optimizer" },
      { name: "description", content: "Paste any job description and get an ATS-optimized CV, tailored cover letter, and match score with concrete fixes in 60 seconds. Free to try, no credit card." },
      { property: "og:title", content: "Nexvi — AI CV Generator, Cover Letters & ATS Optimizer" },
      { property: "og:description", content: "Paste any job description and get an ATS-optimized CV, tailored cover letter, and match score with concrete fixes in 60 seconds. Free to try, no credit card." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://nexvi.xyz/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Nexvi — AI CV Generator, Cover Letters & ATS Optimizer" },
      { name: "twitter:description", content: "Paste any job description and get an ATS-optimized CV, tailored cover letter, and match score with concrete fixes in 60 seconds. Free to try, no credit card." },
      { property: "og:locale", content: "en_US" },
      { property: "og:locale:alternate", content: "de_DE" },
      { property: "og:locale:alternate", content: "es_ES" },
      { property: "og:locale:alternate", content: "it_IT" },
      { property: "og:locale:alternate", content: "fr_FR" },
    ],
    links: [
      { rel: "canonical", href: "https://nexvi.xyz/" },
      { rel: "alternate", hrefLang: "en", href: "https://nexvi.xyz/" },
      { rel: "alternate", hrefLang: "de", href: "https://nexvi.xyz/de" },
      { rel: "alternate", hrefLang: "es", href: "https://nexvi.xyz/es" },
      { rel: "alternate", hrefLang: "it", href: "https://nexvi.xyz/it" },
      { rel: "alternate", hrefLang: "fr", href: "https://nexvi.xyz/fr" },
      { rel: "alternate", hrefLang: "x-default", href: "https://nexvi.xyz/" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Nexvi",
          url: "https://nexvi.xyz",
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
              name: "What is Nexvi?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Nexvi is an AI platform that aligns your CV and cover letter with a specific job description, scores the result against ATS filters and shows exactly what to fix before you apply.",
              },
            },
            {
              "@type": "Question",
              name: "How does the ATS match score work?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Paste your CV and the job description. Nexvi returns a match percentage broken down into keyword coverage, formatting checks, section coverage and length, plus specific rewrite recommendations.",
              },
            },
            {
              "@type": "Question",
              name: "Is Nexvi free?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. Free accounts get three generations on every tool each month, with no credit card required. Pro unlocks unlimited generations and the full prompt library.",
              },
            },
            {
              "@type": "Question",
              name: "Which AI models does Nexvi use?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Nexvi runs on frontier Claude and GPT models, so generated CVs and cover letters read naturally instead of like template text.",
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
