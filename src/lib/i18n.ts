export type Locale = "en" | "de";

export const locales: Locale[] = ["en", "de"];

export const localePathPrefix: Record<Locale, string> = {
  en: "",
  de: "/ger",
};

export function alternateHref(locale: Locale, path = "/") {
  const prefix = localePathPrefix[locale];
  if (path === "/") return prefix || "/";
  return `${prefix}${path}`;
}

export const t = {
  en: {
    htmlLang: "en",
    badge: "12,000+ prompts curated for real life",
    heroTitle: "AI prompts that help you",
    heroTitleEm: "actually",
    heroTitleEnd: "get things done.",
    heroSub:
      "Discover, save, and use beautifully crafted prompts and toolkits — for jobs, study, content, business, and everything in between.",
    searchPlaceholder: "What do you want AI to help you with?",
    search: "Search",
    tryLabel: "Try:",
    tryItems: ["land a job", "study for finals", "write cold emails", "plan a trip", "grow on Instagram"],
    stats: [
      ["52k+", "Active learners"],
      ["4.9★", "Average rating"],
      ["12k+", "Prompts & toolkits"],
    ],
    browseKicker: "Browse by outcome",
    browseTitle: "What do you want to do?",
    viewAll: "View all →",
    trendingKicker: "Trending this week",
    trendingTitle: "Loved by humans like you",
    exploreMarket: "Explore marketplace →",
    assistantBadge: "Meet your AI guide",
    assistantTitle: "Not sure where to start?",
    assistantSub:
      "Tell us what you're trying to achieve. We'll handpick the right prompts and packs — in seconds.",
    assistantCta: "Try the AI Assistant",
    you: "You",
    youMsg: "I want to switch careers into UX design this year.",
    aiReply:
      "Here's a 3-step plan: a learning roadmap, a portfolio-building prompt pack, and a job-search toolkit. Want me to set it up?",
    creatorsKicker: "Featured creators",
    creatorsTitle: "Real people. Real expertise.",
    testimonialTitle: "A friendlier way to use AI.",
    pricingKicker: "Pricing",
    pricingTitle: "Simple, friendly pricing.",
    pricingSub: "Start free. Upgrade when you're ready for the whole library.",
    faqTitle: "Friendly answers.",
    ctaTitle: "Your AI side-kick starts here.",
    ctaSub: "Join 50,000+ humans using getHeired to learn, create, and get hired.",
    createAccount: "Create free account",
    exploreMarketBtn: "Explore marketplace",
    nav: { marketplace: "Marketplace", bundles: "Bundles", assistant: "AI Assistant", creators: "Creators", pricing: "Pricing" },
    signIn: "Sign in",
    getStarted: "Get started",
  },
  de: {
    htmlLang: "de",
    badge: "Über 12.000 Prompts für den echten Alltag",
    heroTitle: "KI-Prompts, mit denen du",
    heroTitleEm: "wirklich",
    heroTitleEnd: "etwas erreichst.",
    heroSub:
      "Entdecke, speichere und nutze sorgfältig gestaltete Prompts und Toolkits — für Job, Studium, Content, Business und alles dazwischen.",
    searchPlaceholder: "Wobei soll dir KI helfen?",
    search: "Suchen",
    tryLabel: "Probiere:",
    tryItems: ["einen Job finden", "fürs Examen lernen", "Kalt-E-Mails schreiben", "eine Reise planen", "auf Instagram wachsen"],
    stats: [
      ["52k+", "Aktive Lernende"],
      ["4,9★", "Durchschnittliche Bewertung"],
      ["12k+", "Prompts & Toolkits"],
    ],
    browseKicker: "Nach Ergebnis stöbern",
    browseTitle: "Was möchtest du erreichen?",
    viewAll: "Alle ansehen →",
    trendingKicker: "Diese Woche im Trend",
    trendingTitle: "Geliebt von Menschen wie dir",
    exploreMarket: "Marktplatz entdecken →",
    assistantBadge: "Dein KI-Begleiter",
    assistantTitle: "Du weißt nicht, wo du anfangen sollst?",
    assistantSub:
      "Sag uns, was du erreichen willst. Wir wählen die passenden Prompts und Pakete — in Sekunden.",
    assistantCta: "KI-Assistent ausprobieren",
    you: "Du",
    youMsg: "Ich möchte dieses Jahr in UX-Design wechseln.",
    aiReply:
      "Hier ist ein 3-Schritte-Plan: ein Lern-Fahrplan, ein Portfolio-Prompt-Paket und ein Jobsuche-Toolkit. Soll ich es einrichten?",
    creatorsKicker: "Empfohlene Creator",
    creatorsTitle: "Echte Menschen. Echte Expertise.",
    testimonialTitle: "Ein freundlicherer Weg, KI zu nutzen.",
    pricingKicker: "Preise",
    pricingTitle: "Einfache, faire Preise.",
    pricingSub: "Starte kostenlos. Upgrade, wenn du die ganze Bibliothek willst.",
    faqTitle: "Freundliche Antworten.",
    ctaTitle: "Dein KI-Sidekick startet hier.",
    ctaSub: "Schließe dich 50.000+ Menschen an, die mit getHeired lernen, erschaffen und Jobs finden.",
    createAccount: "Kostenloses Konto erstellen",
    exploreMarketBtn: "Marktplatz entdecken",
    nav: { marketplace: "Marktplatz", bundles: "Pakete", assistant: "KI-Assistent", creators: "Creator", pricing: "Preise" },
    signIn: "Anmelden",
    getStarted: "Loslegen",
  },
} as const;
