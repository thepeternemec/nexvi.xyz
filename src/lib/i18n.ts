export type Locale = "en" | "de" | "es" | "it" | "fr";

export const locales: Locale[] = ["en", "de", "es", "it", "fr"];

export const localePathPrefix: Record<Locale, string> = {
  en: "",
  de: "/de",
  es: "/es",
  it: "/it",
  fr: "/fr",
};

export const localeLabel: Record<Locale, string> = {
  en: "English",
  de: "Deutsch",
  es: "Español",
  it: "Italiano",
  fr: "Français",
};

export const localeFlag: Record<Locale, string> = {
  en: "🇬🇧",
  de: "🇩🇪",
  es: "🇪🇸",
  it: "🇮🇹",
  fr: "🇫🇷",
};

export const localeHtmlLang: Record<Locale, string> = {
  en: "en",
  de: "de",
  es: "es",
  it: "it",
  fr: "fr",
};

export function detectLocaleFromPath(pathname: string): Locale {
  const seg = pathname.split("/")[1];
  if (seg === "de" || seg === "ger") return "de";
  if (seg === "es") return "es";
  if (seg === "it") return "it";
  if (seg === "fr") return "fr";
  return "en";
}

export function alternateHref(locale: Locale, path = "/") {
  const prefix = localePathPrefix[locale];
  if (path === "/") return prefix || "/";
  return `${prefix}${path}`;
}

type Copy = {
  badge: string;
  heroTitleA: string;
  heroTitleEm: string;
  heroTitleB: string;
  heroSub: string;
  ctaFind: string;
  ctaGenerate: string;
  ctaAts: string;
  free: string;
  noCard: string;
  topModels: string;
  toolsKicker: string;
  toolsTitle: string;
  tools: { title: string; desc: string; badge?: string }[];
  open: string;
  librarySpotBadge: string;
  librarySpotTitle: string;
  librarySpotSub: string;
  librarySpotBullets: string[];
  browseLibrary: string;
  seeBundles: string;
  howKicker: string;
  howTitle: string;
  howSub: string;
  howSteps: [string, string][];
  atsScore: string;
  atsExcellent: string;
  socialTitle: string;
  socialSub: string;
  stats: [string, string][];
  ctaBigTitle: string;
  ctaBigSub: string;
  metaTitle: string;
  metaDesc: string;
};

export const copy: Record<Locale, Copy> = {
  en: {
    badge: "AI-powered • ATS-optimized • Tailored to every role",
    heroTitleA: "Get hired with CVs that",
    heroTitleEm: "actually",
    heroTitleB: "beat the bots.",
    heroSub: "Paste any job description. We generate a tailored CV and cover letter, score it against the ATS, and tell you exactly what to fix.",
    ctaFind: "Find a job prompt",
    ctaGenerate: "Generate my CV",
    ctaAts: "Check ATS score",
    free: "Free to try",
    noCard: "No credit card",
    topModels: "Built on top AI models",
    toolsKicker: "Four tools. One outcome.",
    toolsTitle: "Everything you need to land the job.",
    tools: [
      { title: "Find a Job Prompt Library", desc: "A curated library of battle-tested prompts for every stage of the hunt — CV, cover letter, interview, recruiter outreach, negotiation.", badge: "Featured" },
      { title: "CV Generator", desc: "A tailored, ATS-friendly CV in seconds — keyword-optimized for the job description you paste in." },
      { title: "Cover Letter Generator", desc: "Personalized cover letters that connect your real experience to what the company actually wants." },
      { title: "ATS Optimizer", desc: "Score your CV against any job. Get matched keywords, gaps, and rewrite tips in plain English." },
      { title: "Humanizer", desc: "Strip AI tells from your CV or cover letter. Sound natural and human — with a side-by-side diff of every change." },
    ],
    open: "Open",
    librarySpotBadge: "Find a Job Prompt Library",
    librarySpotTitle: "The prompt library built for job hunters.",
    librarySpotSub: "Stop guessing what to ask AI. Browse hundreds of curated prompts for CVs, cover letters, recruiter outreach, interview prep, salary negotiation and more — written by career coaches and ex-recruiters.",
    librarySpotBullets: [
      "Filter by job stage, role, and experience level",
      "Free and premium prompts — copy, paste, get results",
      "Tested with ChatGPT, Claude, and Gemini",
    ],
    browseLibrary: "Browse the library",
    seeBundles: "See bundles",
    howKicker: "How it works",
    howTitle: "From job description to interview-ready in 60 seconds.",
    howSub: "No more rewriting your CV for every application. Paste the job description, paste your background, and we do the tailoring — keyword by keyword.",
    howSteps: [
      ["Paste the job description", "Any role, any industry. We extract the keywords that matter."],
      ["Add your background", "Past roles, skills, education, or your existing CV — however you have it."],
      ["Get tailored, ATS-ready docs", "A CV, a cover letter, and an ATS score with concrete fixes."],
    ],
    atsScore: "ATS Match Score",
    atsExcellent: "/ 100 — Excellent match",
    socialTitle: "Built for the modern job hunt.",
    socialSub: "Most CVs get filtered before a human sees them. We fix that.",
    stats: [
      ["75%", "of CVs are rejected by ATS before a recruiter sees them."],
      ["3×", "more interviews when your CV is tailored per role."],
      ["60s", "to generate a fully tailored CV and cover letter."],
    ],
    ctaBigTitle: "Your next job is one prompt away.",
    ctaBigSub: "Free to use. No sign-up required. Browse the library, run a tool, get results.",
    metaTitle: "ApplyWise — AI CVs, Cover Letters & ATS Optimization",
    metaDesc: "Paste a job description. Get an ATS-optimized CV, tailored cover letter, and a match score with concrete fixes — in 60 seconds.",
  },
  de: {
    badge: "KI-gestützt • ATS-optimiert • Auf jede Rolle zugeschnitten",
    heroTitleA: "Werde eingestellt mit Lebensläufen, die",
    heroTitleEm: "wirklich",
    heroTitleB: "die Bots schlagen.",
    heroSub: "Füge eine beliebige Stellenbeschreibung ein. Wir erstellen einen maßgeschneiderten Lebenslauf und ein Anschreiben, bewerten es gegen das ATS und sagen dir genau, was zu verbessern ist.",
    ctaFind: "Job-Prompt finden",
    ctaGenerate: "Meinen CV erstellen",
    ctaAts: "ATS-Score prüfen",
    free: "Kostenlos testen",
    noCard: "Keine Kreditkarte",
    topModels: "Mit Top-KI-Modellen gebaut",
    toolsKicker: "Vier Tools. Ein Ergebnis.",
    toolsTitle: "Alles, was du brauchst, um den Job zu bekommen.",
    tools: [
      { title: "Job-Prompt-Bibliothek", desc: "Eine kuratierte Bibliothek erprobter Prompts für jede Phase der Jobsuche — Lebenslauf, Anschreiben, Interview, Recruiter-Outreach, Gehaltsverhandlung.", badge: "Empfohlen" },
      { title: "CV-Generator", desc: "Ein maßgeschneiderter, ATS-freundlicher Lebenslauf in Sekunden — optimiert auf die Stellenbeschreibung, die du einfügst." },
      { title: "Anschreiben-Generator", desc: "Persönliche Anschreiben, die deine echte Erfahrung mit dem verbinden, was das Unternehmen wirklich sucht." },
      { title: "ATS-Optimierer", desc: "Bewerte deinen Lebenslauf gegen jeden Job. Erhalte passende Keywords, Lücken und Umformulierungs-Tipps." },
    ],
    open: "Öffnen",
    librarySpotBadge: "Job-Prompt-Bibliothek",
    librarySpotTitle: "Die Prompt-Bibliothek für Jobsuchende.",
    librarySpotSub: "Kein Rätselraten mehr, was du die KI fragen sollst. Durchstöbere hunderte kuratierte Prompts für Lebensläufe, Anschreiben, Recruiter-Outreach, Interviewvorbereitung, Gehaltsverhandlung und mehr — geschrieben von Karrierecoaches und Ex-Recruitern.",
    librarySpotBullets: [
      "Filtern nach Jobphase, Rolle und Erfahrungsstufe",
      "Kostenlose und Premium-Prompts — kopieren, einfügen, Ergebnisse erhalten",
      "Getestet mit ChatGPT, Claude und Gemini",
    ],
    browseLibrary: "Bibliothek durchstöbern",
    seeBundles: "Pakete ansehen",
    howKicker: "So funktioniert es",
    howTitle: "Von der Stellenbeschreibung zum Interview in 60 Sekunden.",
    howSub: "Nie wieder für jede Bewerbung den Lebenslauf umschreiben. Stellenbeschreibung einfügen, Hintergrund einfügen, und wir passen alles an — Keyword für Keyword.",
    howSteps: [
      ["Stellenbeschreibung einfügen", "Jede Rolle, jede Branche. Wir extrahieren die relevanten Keywords."],
      ["Hintergrund hinzufügen", "Frühere Rollen, Skills, Ausbildung oder dein bestehender CV — wie du ihn hast."],
      ["Maßgeschneiderte, ATS-fertige Dokumente", "Ein CV, ein Anschreiben und ein ATS-Score mit konkreten Verbesserungen."],
    ],
    atsScore: "ATS-Match-Score",
    atsExcellent: "/ 100 — Ausgezeichnetes Match",
    socialTitle: "Für die moderne Jobsuche gebaut.",
    socialSub: "Die meisten Lebensläufe werden gefiltert, bevor ein Mensch sie sieht. Wir ändern das.",
    stats: [
      ["75 %", "der CVs werden vom ATS abgelehnt, bevor ein Recruiter sie sieht."],
      ["3×", "mehr Interviews, wenn dein CV auf die Rolle zugeschnitten ist."],
      ["60 Sek.", "um einen kompletten CV und ein Anschreiben zu erstellen."],
    ],
    ctaBigTitle: "Dein nächster Job ist nur einen Prompt entfernt.",
    ctaBigSub: "Kostenlos. Keine Anmeldung nötig. Bibliothek durchstöbern, Tool starten, Ergebnisse bekommen.",
    metaTitle: "ApplyWise — KI-Lebensläufe, Anschreiben & ATS-Optimierung",
    metaDesc: "Füge eine Stellenbeschreibung ein. Erhalte einen ATS-optimierten Lebenslauf, ein passgenaues Anschreiben und einen Match-Score in 60 Sekunden.",
  },
  es: {
    badge: "Con IA • Optimizado para ATS • Adaptado a cada puesto",
    heroTitleA: "Consigue empleo con CVs que",
    heroTitleEm: "realmente",
    heroTitleB: "superan a los bots.",
    heroSub: "Pega cualquier descripción de puesto. Generamos un CV y una carta de presentación a medida, los puntuamos contra el ATS y te decimos exactamente qué mejorar.",
    ctaFind: "Buscar un prompt",
    ctaGenerate: "Generar mi CV",
    ctaAts: "Comprobar ATS",
    free: "Gratis para probar",
    noCard: "Sin tarjeta",
    topModels: "Con los mejores modelos de IA",
    toolsKicker: "Cuatro herramientas. Un resultado.",
    toolsTitle: "Todo lo que necesitas para conseguir el empleo.",
    tools: [
      { title: "Biblioteca de Prompts", desc: "Una biblioteca curada de prompts probados para cada etapa de la búsqueda: CV, carta, entrevista, contacto con reclutadores, negociación.", badge: "Destacado" },
      { title: "Generador de CV", desc: "Un CV a medida y compatible con ATS en segundos, optimizado con las palabras clave de la oferta que pegues." },
      { title: "Generador de Carta", desc: "Cartas de presentación personalizadas que conectan tu experiencia real con lo que la empresa realmente busca." },
      { title: "Optimizador ATS", desc: "Puntúa tu CV frente a cualquier oferta. Palabras clave, huecos y consejos de reescritura en lenguaje claro." },
    ],
    open: "Abrir",
    librarySpotBadge: "Biblioteca de Prompts",
    librarySpotTitle: "La biblioteca de prompts hecha para quienes buscan empleo.",
    librarySpotSub: "Deja de adivinar qué pedirle a la IA. Explora cientos de prompts curados para CVs, cartas, contacto con reclutadores, preparación de entrevistas, negociación salarial y más — escritos por coaches y ex-reclutadores.",
    librarySpotBullets: [
      "Filtra por etapa, puesto y nivel de experiencia",
      "Prompts gratis y premium: copia, pega, obtén resultados",
      "Probados con ChatGPT, Claude y Gemini",
    ],
    browseLibrary: "Explorar la biblioteca",
    seeBundles: "Ver packs",
    howKicker: "Cómo funciona",
    howTitle: "De la oferta al listo-para-entrevista en 60 segundos.",
    howSub: "Se acabó reescribir tu CV para cada solicitud. Pega la oferta, pega tu experiencia y adaptamos todo — palabra clave a palabra clave.",
    howSteps: [
      ["Pega la descripción del puesto", "Cualquier rol, cualquier sector. Extraemos las palabras clave importantes."],
      ["Añade tu experiencia", "Puestos anteriores, habilidades, formación o tu CV actual — como lo tengas."],
      ["Obtén documentos listos para ATS", "Un CV, una carta y una puntuación ATS con mejoras concretas."],
    ],
    atsScore: "Puntuación ATS",
    atsExcellent: "/ 100 — Coincidencia excelente",
    socialTitle: "Hecho para la búsqueda de empleo moderna.",
    socialSub: "La mayoría de los CVs se filtran antes de que un humano los vea. Lo solucionamos.",
    stats: [
      ["75 %", "de los CVs son rechazados por el ATS antes de llegar al reclutador."],
      ["3×", "más entrevistas cuando el CV está adaptado al puesto."],
      ["60 s", "para generar un CV y una carta totalmente a medida."],
    ],
    ctaBigTitle: "Tu próximo empleo está a un prompt de distancia.",
    ctaBigSub: "Gratis. Sin registro. Explora la biblioteca, usa una herramienta, obtén resultados.",
    metaTitle: "ApplyWise — CVs con IA, cartas y optimización ATS",
    metaDesc: "Pega una descripción de puesto. Obtén un CV optimizado para ATS, una carta a medida y una puntuación con mejoras concretas — en 60 segundos.",
  },
  it: {
    badge: "AI • Ottimizzato ATS • Su misura per ogni ruolo",
    heroTitleA: "Vieni assunto con CV che",
    heroTitleEm: "davvero",
    heroTitleB: "battono i bot.",
    heroSub: "Incolla qualsiasi descrizione di lavoro. Generiamo un CV e una lettera di presentazione su misura, li valutiamo contro l'ATS e ti diciamo esattamente cosa migliorare.",
    ctaFind: "Trova un prompt",
    ctaGenerate: "Genera il mio CV",
    ctaAts: "Verifica ATS",
    free: "Prova gratuita",
    noCard: "Nessuna carta",
    topModels: "Con i migliori modelli AI",
    toolsKicker: "Quattro strumenti. Un risultato.",
    toolsTitle: "Tutto ciò che ti serve per ottenere il lavoro.",
    tools: [
      { title: "Libreria di Prompt", desc: "Una libreria curata di prompt collaudati per ogni fase della ricerca — CV, lettera, colloquio, contatto recruiter, negoziazione.", badge: "In evidenza" },
      { title: "Generatore di CV", desc: "Un CV su misura e ATS-friendly in pochi secondi, ottimizzato con le parole chiave dell'annuncio che incolli." },
      { title: "Generatore di Lettera", desc: "Lettere personalizzate che collegano la tua esperienza reale a ciò che l'azienda cerca davvero." },
      { title: "Ottimizzatore ATS", desc: "Valuta il tuo CV contro qualsiasi annuncio. Parole chiave, lacune e suggerimenti in linguaggio semplice." },
    ],
    open: "Apri",
    librarySpotBadge: "Libreria di Prompt",
    librarySpotTitle: "La libreria di prompt pensata per chi cerca lavoro.",
    librarySpotSub: "Basta indovinare cosa chiedere all'AI. Sfoglia centinaia di prompt curati per CV, lettere, contatto recruiter, preparazione colloqui, negoziazione salariale e altro — scritti da career coach ed ex-recruiter.",
    librarySpotBullets: [
      "Filtra per fase, ruolo e livello di esperienza",
      "Prompt gratuiti e premium — copia, incolla, ottieni risultati",
      "Testati con ChatGPT, Claude e Gemini",
    ],
    browseLibrary: "Sfoglia la libreria",
    seeBundles: "Vedi i pacchetti",
    howKicker: "Come funziona",
    howTitle: "Dalla descrizione del lavoro al colloquio in 60 secondi.",
    howSub: "Basta riscrivere il CV per ogni candidatura. Incolla l'annuncio, incolla il tuo background, e adattiamo tutto — parola chiave dopo parola chiave.",
    howSteps: [
      ["Incolla la descrizione del lavoro", "Qualsiasi ruolo, qualsiasi settore. Estraiamo le parole chiave che contano."],
      ["Aggiungi il tuo background", "Ruoli passati, competenze, formazione o il tuo CV attuale — come ce l'hai."],
      ["Ottieni documenti pronti per ATS", "Un CV, una lettera e un punteggio ATS con miglioramenti concreti."],
    ],
    atsScore: "Punteggio ATS",
    atsExcellent: "/ 100 — Corrispondenza eccellente",
    socialTitle: "Costruito per la ricerca di lavoro moderna.",
    socialSub: "La maggior parte dei CV viene filtrata prima che un umano li veda. Lo risolviamo.",
    stats: [
      ["75%", "dei CV viene rifiutato dall'ATS prima di arrivare al recruiter."],
      ["3×", "colloqui in più quando il CV è su misura per il ruolo."],
      ["60 s", "per generare un CV e una lettera completamente su misura."],
    ],
    ctaBigTitle: "Il tuo prossimo lavoro è a un prompt di distanza.",
    ctaBigSub: "Gratis. Nessuna registrazione. Sfoglia la libreria, usa uno strumento, ottieni risultati.",
    metaTitle: "ApplyWise — CV AI, lettere e ottimizzazione ATS",
    metaDesc: "Incolla una descrizione di lavoro. Ottieni un CV ottimizzato ATS, una lettera su misura e un punteggio con miglioramenti concreti — in 60 secondi.",
  },
  fr: {
    badge: "IA • Optimisé ATS • Sur mesure pour chaque poste",
    heroTitleA: "Décrochez un emploi avec des CV qui",
    heroTitleEm: "vraiment",
    heroTitleB: "battent les robots.",
    heroSub: "Collez n'importe quelle description de poste. Nous générons un CV et une lettre de motivation sur mesure, les notons face à l'ATS et vous disons exactement quoi corriger.",
    ctaFind: "Trouver un prompt",
    ctaGenerate: "Générer mon CV",
    ctaAts: "Vérifier l'ATS",
    free: "Essai gratuit",
    noCard: "Sans carte bancaire",
    topModels: "Construit sur les meilleurs modèles IA",
    toolsKicker: "Quatre outils. Un résultat.",
    toolsTitle: "Tout ce qu'il faut pour décrocher le poste.",
    tools: [
      { title: "Bibliothèque de Prompts", desc: "Une bibliothèque de prompts éprouvés pour chaque étape de la recherche — CV, lettre, entretien, contact recruteur, négociation.", badge: "À la une" },
      { title: "Générateur de CV", desc: "Un CV sur mesure et compatible ATS en quelques secondes, optimisé sur les mots-clés de l'offre collée." },
      { title: "Générateur de Lettre", desc: "Des lettres personnalisées qui relient votre expérience réelle à ce que l'entreprise recherche vraiment." },
      { title: "Optimiseur ATS", desc: "Notez votre CV face à n'importe quelle offre. Mots-clés, écarts et conseils de réécriture en langage clair." },
    ],
    open: "Ouvrir",
    librarySpotBadge: "Bibliothèque de Prompts",
    librarySpotTitle: "La bibliothèque de prompts pour les chercheurs d'emploi.",
    librarySpotSub: "Arrêtez de deviner ce qu'il faut demander à l'IA. Parcourez des centaines de prompts pour CV, lettres, contact recruteur, préparation d'entretiens, négociation salariale et plus — écrits par des coachs carrière et ex-recruteurs.",
    librarySpotBullets: [
      "Filtrer par étape, poste et niveau d'expérience",
      "Prompts gratuits et premium — copiez, collez, obtenez des résultats",
      "Testés avec ChatGPT, Claude et Gemini",
    ],
    browseLibrary: "Parcourir la bibliothèque",
    seeBundles: "Voir les packs",
    howKicker: "Comment ça marche",
    howTitle: "De l'offre d'emploi à l'entretien en 60 secondes.",
    howSub: "Fini la réécriture du CV pour chaque candidature. Collez l'offre, collez votre parcours, et nous adaptons tout — mot-clé par mot-clé.",
    howSteps: [
      ["Collez l'offre d'emploi", "Tout poste, tout secteur. Nous extrayons les mots-clés importants."],
      ["Ajoutez votre parcours", "Postes précédents, compétences, formation ou votre CV actuel — tel quel."],
      ["Obtenez des documents prêts pour l'ATS", "Un CV, une lettre et un score ATS avec des améliorations concrètes."],
    ],
    atsScore: "Score de correspondance ATS",
    atsExcellent: "/ 100 — Excellente correspondance",
    socialTitle: "Conçu pour la recherche d'emploi moderne.",
    socialSub: "La plupart des CV sont filtrés avant qu'un humain ne les voie. On règle ça.",
    stats: [
      ["75 %", "des CV sont rejetés par l'ATS avant d'arriver au recruteur."],
      ["3×", "plus d'entretiens quand le CV est adapté au poste."],
      ["60 s", "pour générer un CV et une lettre entièrement sur mesure."],
    ],
    ctaBigTitle: "Votre prochain emploi n'est qu'à un prompt.",
    ctaBigSub: "Gratuit. Sans inscription. Parcourez la bibliothèque, utilisez un outil, obtenez des résultats.",
    metaTitle: "ApplyWise — CV IA, lettres et optimisation ATS",
    metaDesc: "Collez une description de poste. Obtenez un CV optimisé ATS, une lettre sur mesure et un score avec des correctifs concrets — en 60 secondes.",
  },
};
