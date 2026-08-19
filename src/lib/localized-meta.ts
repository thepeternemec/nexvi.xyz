import type { Locale } from "@/lib/i18n";

export type LocalizedLocale = Exclude<Locale, "en">;

type Entry = { title: string; description: string };

const SITE = "https://nexvi.xyz";

/** URL segment for each localized page key (empty string = locale home). */
export const localizedPaths: Record<string, string> = {
  about: "/about",
  account: "/account",
  assistant: "/assistant",
  ats: "/ats",
  cookies: "/cookies",
  "cover-letter": "/cover-letter",
  creator: "/creator",
  creators: "/creators",
  cv: "/cv",
  dashboard: "/dashboard",
  humanizer: "/humanizer",
  login: "/login",
  pricing: "/pricing",
  prompts: "/prompts",
  "reset-password": "/reset-password",
  signup: "/signup",
  sitemap: "/sitemap",
  status: "/status",
  subscription: "/subscription",
  terms: "/terms",
  "verify-email": "/verify-email",
};

export const ogLocales: Record<LocalizedLocale, string> = {
  de: "de_DE",
  es: "es_ES",
  fr: "fr_FR",
  it: "it_IT",
};

export const localizedMeta: Record<string, Record<LocalizedLocale, Entry>> = {
  about: {
    de: { title: "Über Nexvi — die KI-Schicht für Bewerbungen", description: "Nexvi ist kein Lebenslauf-Baukasten: Wir schreiben, bewerten und vermenschlichen deine Bewerbung passend zur Stellenanzeige." },
    es: { title: "Sobre Nexvi — la capa de IA para tus candidaturas", description: "Nexvi no es un creador de CV: reescribe, puntúa y humaniza tu candidatura según cada oferta de empleo." },
    fr: { title: "À propos de Nexvi — la couche IA de vos candidatures", description: "Nexvi n'est pas un générateur de CV : il réécrit, évalue et humanise votre candidature selon chaque offre." },
    it: { title: "Chi è Nexvi — il livello AI delle tue candidature", description: "Nexvi non è un generatore di CV: riscrive, valuta e umanizza la tua candidatura in base all'annuncio." },
  },
  account: {
    de: { title: "Kontoeinstellungen — Nexvi", description: "Verwalte dein Nexvi-Profil, deine E-Mail-Adresse, dein Passwort und deine Datenschutzeinstellungen." },
    es: { title: "Ajustes de cuenta — Nexvi", description: "Gestiona tu perfil de Nexvi, tu correo, tu contraseña y tus preferencias de privacidad." },
    fr: { title: "Paramètres du compte — Nexvi", description: "Gérez votre profil Nexvi, votre e-mail, votre mot de passe et vos préférences de confidentialité." },
    it: { title: "Impostazioni account — Nexvi", description: "Gestisci il tuo profilo Nexvi, l'email, la password e le preferenze sulla privacy." },
  },
  assistant: {
    de: { title: "KI-Assistent für Bewerbungen — Nexvi", description: "Stelle Fragen zu deiner Bewerbung und lass Nexvi Lebenslauf, Anschreiben und ATS-Score in einem Chat verbessern." },
    es: { title: "Asistente de IA para candidaturas — Nexvi", description: "Pregunta sobre tu candidatura y deja que Nexvi mejore CV, carta y puntuación ATS en un solo chat." },
    fr: { title: "Assistant IA de candidature — Nexvi", description: "Posez vos questions et laissez Nexvi améliorer CV, lettre et score ATS dans une seule conversation." },
    it: { title: "Assistente AI per candidature — Nexvi", description: "Fai domande sulla tua candidatura e lascia che Nexvi migliori CV, lettera e punteggio ATS in una chat." },
  },
  ats: {
    de: { title: "ATS-Optimierer: Lebenslauf-Check gegen die Stellenanzeige — Nexvi", description: "Prüfe deinen Lebenslauf gegen jede Stellenanzeige: Match-Prozent, Formatprüfung und Keyword-Abdeckung mit konkreten Korrekturen." },
    es: { title: "Optimizador ATS: analiza tu CV frente a la oferta — Nexvi", description: "Compara tu CV con cualquier oferta: porcentaje de coincidencia, revisión de formato y cobertura de palabras clave." },
    fr: { title: "Optimiseur ATS : analysez votre CV face à l'offre — Nexvi", description: "Comparez votre CV à toute offre : score de correspondance, contrôle de mise en forme et couverture des mots-clés." },
    it: { title: "Ottimizzatore ATS: analizza il CV rispetto all'annuncio — Nexvi", description: "Confronta il CV con qualsiasi annuncio: percentuale di match, controllo del formato e copertura delle parole chiave." },
  },
  cookies: {
    de: { title: "Cookie-Richtlinie — Nexvi", description: "Welche Cookies Nexvi verwendet, warum wir sie brauchen und wie du deine Einwilligung jederzeit ändern kannst." },
    es: { title: "Política de cookies — Nexvi", description: "Qué cookies usa Nexvi, para qué las necesitamos y cómo cambiar tu consentimiento en cualquier momento." },
    fr: { title: "Politique de cookies — Nexvi", description: "Quels cookies Nexvi utilise, pourquoi ils sont nécessaires et comment modifier votre consentement." },
    it: { title: "Informativa sui cookie — Nexvi", description: "Quali cookie usa Nexvi, perché servono e come modificare il consenso in qualsiasi momento." },
  },
  "cover-letter": {
    de: { title: "Anschreiben-Generator für jede Stellenanzeige — Nexvi", description: "Erstelle ein maßgeschneidertes Anschreiben aus deinem Lebenslauf und der Stellenanzeige — in deiner Stimme, ohne Floskeln." },
    es: { title: "Generador de cartas de presentación a medida — Nexvi", description: "Crea una carta adaptada a partir de tu CV y la oferta: con tu voz y sin frases hechas." },
    fr: { title: "Générateur de lettres de motivation sur mesure — Nexvi", description: "Créez une lettre adaptée à partir de votre CV et de l'offre : votre ton, sans phrases toutes faites." },
    it: { title: "Generatore di lettere di presentazione su misura — Nexvi", description: "Crea una lettera personalizzata dal tuo CV e dall'annuncio: con la tua voce, senza frasi fatte." },
  },
  creator: {
    de: { title: "Prompt-Autor — Nexvi", description: "Alle Bewerbungs-Prompts dieses Autors: Lebenslauf, Anschreiben, ATS und Jobsuche." },
    es: { title: "Autor de prompts — Nexvi", description: "Todos los prompts de este autor para CV, cartas, ATS y búsqueda de empleo." },
    fr: { title: "Auteur de prompts — Nexvi", description: "Tous les prompts de cet auteur pour CV, lettres, ATS et recherche d'emploi." },
    it: { title: "Autore di prompt — Nexvi", description: "Tutti i prompt di questo autore per CV, lettere, ATS e ricerca di lavoro." },
  },
  creators: {
    de: { title: "Prompt-Autoren der Nexvi-Bibliothek", description: "Entdecke die Autoren hinter den Bewerbungs-Prompts von Nexvi und ihre besten Vorlagen." },
    es: { title: "Autores de la biblioteca de prompts de Nexvi", description: "Descubre a los autores detrás de los prompts de candidatura de Nexvi y sus mejores plantillas." },
    fr: { title: "Auteurs de la bibliothèque de prompts Nexvi", description: "Découvrez les auteurs des prompts de candidature Nexvi et leurs meilleurs modèles." },
    it: { title: "Autori della libreria di prompt Nexvi", description: "Scopri gli autori dei prompt di candidatura Nexvi e i loro modelli migliori." },
  },
  cv: {
    de: { title: "KI-Lebenslauf für eine konkrete Stelle — Nexvi", description: "Füge die Stellenanzeige ein und erhalte einen ATS-tauglichen Lebenslauf, der deine echte Erfahrung passend formuliert." },
    es: { title: "CV con IA para una oferta concreta — Nexvi", description: "Pega la oferta y obtén un CV compatible con ATS que reformula tu experiencia real para ese puesto." },
    fr: { title: "CV par IA pour une offre précise — Nexvi", description: "Collez l'offre et obtenez un CV compatible ATS qui reformule votre expérience réelle pour ce poste." },
    it: { title: "CV con AI per un annuncio specifico — Nexvi", description: "Incolla l'annuncio e ottieni un CV compatibile con gli ATS che riscrive la tua esperienza reale." },
  },
  dashboard: {
    de: { title: "Dein Bewerbungs-Dashboard — Nexvi", description: "Verfolge Nutzung, gespeicherte Dokumente und deinen Plan an einem Ort." },
    es: { title: "Tu panel de candidaturas — Nexvi", description: "Controla tu uso, tus documentos guardados y tu plan en un solo lugar." },
    fr: { title: "Votre tableau de bord candidatures — Nexvi", description: "Suivez votre usage, vos documents enregistrés et votre offre au même endroit." },
    it: { title: "La tua dashboard candidature — Nexvi", description: "Monitora utilizzo, documenti salvati e piano in un unico posto." },
  },
  humanizer: {
    de: { title: "Humanizer: KI-Texte natürlich klingen lassen — Nexvi", description: "Nimm KI-Formulierungen aus deiner Bewerbung heraus: klarer Ton, echte Details, keine Textbausteine." },
    es: { title: "Humanizer: que tu texto de IA suene a ti — Nexvi", description: "Quita el tono de IA de tu candidatura: lenguaje claro, detalles reales y cero plantillas." },
    fr: { title: "Humanizer : un texte IA qui vous ressemble — Nexvi", description: "Retirez le ton IA de votre candidature : style clair, détails concrets, zéro formule toute faite." },
    it: { title: "Humanizer: testi AI che suonano davvero tuoi — Nexvi", description: "Togli il tono AI dalla candidatura: linguaggio chiaro, dettagli reali, nessun testo standard." },
  },
  login: {
    de: { title: "Anmelden bei Nexvi", description: "Melde dich an, um deinen Lebenslauf, deine Anschreiben und deine ATS-Analysen weiter zu nutzen." },
    es: { title: "Iniciar sesión en Nexvi", description: "Accede para continuar con tu CV, tus cartas y tus análisis ATS." },
    fr: { title: "Se connecter à Nexvi", description: "Connectez-vous pour retrouver votre CV, vos lettres et vos analyses ATS." },
    it: { title: "Accedi a Nexvi", description: "Accedi per continuare con CV, lettere e analisi ATS." },
  },
  pricing: {
    de: { title: "Preise: kostenlos starten, Premium für 7 $/Monat — Nexvi", description: "Vergleiche den kostenlosen Plan mit Nexvi Premium: unbegrenzte Generierungen, ATS-Analysen und Humanizer." },
    es: { title: "Precios: empieza gratis, Premium por 7 $/mes — Nexvi", description: "Compara el plan gratuito con Nexvi Premium: generaciones ilimitadas, análisis ATS y Humanizer." },
    fr: { title: "Tarifs : gratuit au départ, Premium à 7 $/mois — Nexvi", description: "Comparez l'offre gratuite et Nexvi Premium : générations illimitées, analyses ATS et Humanizer." },
    it: { title: "Prezzi: inizia gratis, Premium a 7 $/mese — Nexvi", description: "Confronta il piano gratuito con Nexvi Premium: generazioni illimitate, analisi ATS e Humanizer." },
  },
  prompts: {
    de: { title: "Prompt-Bibliothek für die Jobsuche — Nexvi", description: "Kostenlose, erprobte Prompts für Lebenslauf, Anschreiben, ATS-Optimierung und Jobsuche — direkt in ChatGPT oder Claude nutzbar." },
    es: { title: "Biblioteca de prompts para buscar empleo — Nexvi", description: "Prompts gratuitos y probados para CV, cartas, optimización ATS y búsqueda de empleo, listos para ChatGPT o Claude." },
    fr: { title: "Bibliothèque de prompts pour la recherche d'emploi — Nexvi", description: "Des prompts gratuits et testés pour CV, lettres, optimisation ATS et recherche d'emploi, prêts pour ChatGPT ou Claude." },
    it: { title: "Libreria di prompt per la ricerca di lavoro — Nexvi", description: "Prompt gratuiti e collaudati per CV, lettere, ottimizzazione ATS e ricerca di lavoro, pronti per ChatGPT o Claude." },
  },
  "reset-password": {
    de: { title: "Passwort zurücksetzen — Nexvi", description: "Setze dein Nexvi-Passwort per E-Mail-Link zurück und melde dich wieder an." },
    es: { title: "Restablecer contraseña — Nexvi", description: "Restablece tu contraseña de Nexvi con un enlace por correo y vuelve a entrar." },
    fr: { title: "Réinitialiser le mot de passe — Nexvi", description: "Réinitialisez votre mot de passe Nexvi via un lien e-mail et reconnectez-vous." },
    it: { title: "Reimposta la password — Nexvi", description: "Reimposta la password Nexvi con un link via email e accedi di nuovo." },
  },
  signup: {
    de: { title: "Kostenloses Nexvi-Konto erstellen", description: "Erstelle ein kostenloses Konto und passe Lebenslauf und Anschreiben an jede Stellenanzeige an — ohne Kreditkarte." },
    es: { title: "Crea tu cuenta gratuita de Nexvi", description: "Crea una cuenta gratis y adapta CV y cartas a cada oferta, sin tarjeta de crédito." },
    fr: { title: "Créer un compte Nexvi gratuit", description: "Créez un compte gratuit et adaptez CV et lettres à chaque offre, sans carte bancaire." },
    it: { title: "Crea il tuo account Nexvi gratuito", description: "Crea un account gratuito e adatta CV e lettere a ogni annuncio, senza carta di credito." },
  },
  sitemap: {
    de: { title: "Seitenübersicht — Nexvi", description: "Alle Seiten von Nexvi auf Deutsch: Tools, Prompt-Bibliothek, Preise und rechtliche Hinweise." },
    es: { title: "Mapa del sitio — Nexvi", description: "Todas las páginas de Nexvi en español: herramientas, prompts, precios e información legal." },
    fr: { title: "Plan du site — Nexvi", description: "Toutes les pages de Nexvi en français : outils, prompts, tarifs et mentions légales." },
    it: { title: "Mappa del sito — Nexvi", description: "Tutte le pagine di Nexvi in italiano: strumenti, prompt, prezzi e note legali." },
  },
  status: {
    de: { title: "Systemstatus — Nexvi", description: "Aktuelle Verfügbarkeit der Nexvi-Dienste: Generierung, ATS-Analyse, Konten und Zahlungen." },
    es: { title: "Estado del sistema — Nexvi", description: "Disponibilidad actual de los servicios de Nexvi: generación, análisis ATS, cuentas y pagos." },
    fr: { title: "État des services — Nexvi", description: "Disponibilité actuelle des services Nexvi : génération, analyse ATS, comptes et paiements." },
    it: { title: "Stato del sistema — Nexvi", description: "Disponibilità attuale dei servizi Nexvi: generazione, analisi ATS, account e pagamenti." },
  },
  subscription: {
    de: { title: "Abo verwalten — Nexvi", description: "Sieh deinen Plan, deine Rechnungen und deinen Abrechnungszeitraum und verwalte dein Premium-Abo." },
    es: { title: "Gestionar suscripción — Nexvi", description: "Consulta tu plan, tus facturas y tu periodo de facturación, y gestiona tu suscripción Premium." },
    fr: { title: "Gérer l'abonnement — Nexvi", description: "Consultez votre offre, vos factures et votre période de facturation, et gérez votre abonnement Premium." },
    it: { title: "Gestisci l'abbonamento — Nexvi", description: "Consulta piano, fatture e periodo di fatturazione e gestisci l'abbonamento Premium." },
  },
  terms: {
    de: { title: "Nutzungsbedingungen — Nexvi", description: "Die Bedingungen für die Nutzung von Nexvi, inklusive Abrechnung, Inhalte und Verantwortlichkeiten." },
    es: { title: "Términos de servicio — Nexvi", description: "Condiciones de uso de Nexvi, incluidas facturación, contenidos y responsabilidades." },
    fr: { title: "Conditions d'utilisation — Nexvi", description: "Les conditions d'utilisation de Nexvi : facturation, contenus et responsabilités." },
    it: { title: "Termini di servizio — Nexvi", description: "Le condizioni d'uso di Nexvi: fatturazione, contenuti e responsabilità." },
  },
  "verify-email": {
    de: { title: "E-Mail-Adresse bestätigen — Nexvi", description: "Bestätige deine E-Mail-Adresse, um dein Nexvi-Konto zu aktivieren." },
    es: { title: "Verificar tu correo — Nexvi", description: "Verifica tu dirección de correo para activar tu cuenta de Nexvi." },
    fr: { title: "Vérifier votre e-mail — Nexvi", description: "Vérifiez votre adresse e-mail pour activer votre compte Nexvi." },
    it: { title: "Verifica la tua email — Nexvi", description: "Verifica il tuo indirizzo email per attivare l'account Nexvi." },
  },
};

/** Localized "AI Prompt" suffix for prompt detail pages. */
export const promptTitleSuffix: Record<LocalizedLocale, string> = {
  de: "KI-Prompt für die Bewerbung",
  es: "prompt de IA para tu candidatura",
  fr: "prompt IA pour votre candidature",
  it: "prompt AI per la candidatura",
};

export function localeHead(locale: LocalizedLocale, page: string) {
  const entry = localizedMeta[page]?.[locale];
  const path = localizedPaths[page] ?? "";
  const url = `${SITE}/${locale}${path}`;
  if (!entry) return { meta: [{ property: "og:url", content: url }] };
  return {
    meta: [
      { title: entry.title },
      { name: "description", content: entry.description },
      { property: "og:title", content: entry.title },
      { property: "og:description", content: entry.description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { property: "og:locale", content: ogLocales[locale] },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: entry.title },
      { name: "twitter:description", content: entry.description },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}

export function promptHead(locale: LocalizedLocale, slug: string, prompt?: { title: string; description: string }) {
  const url = `${SITE}/${locale}/prompt/${slug}`;
  if (!prompt) return { meta: [{ property: "og:url", content: url }] };
  const title = `${prompt.title} — ${promptTitleSuffix[locale]} | Nexvi`;
  return {
    meta: [
      { title },
      { name: "description", content: prompt.description },
      { property: "og:title", content: title },
      { property: "og:description", content: prompt.description },
      { property: "og:type", content: "article" },
      { property: "og:url", content: url },
      { property: "og:locale", content: ogLocales[locale] },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: prompt.description },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}
