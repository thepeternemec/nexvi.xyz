/**
 * Google Tag Manager dataLayer helpers.
 *
 * These functions push structured events to `window.dataLayer` so that
 * GTM Custom HTML tags and GA4 event tags can fire without inline JS in
 * the container. All events are safe to call before GTM loads — they are
 * queued on `window.dataLayer`.
 */

export type GTMEventName =
  | "page_view"
  | "user_identified"
  | "sign_up"
  | "login"
  | "logout"
  | "generate_cv"
  | "generate_cover_letter"
  | "score_ats"
  | "humanize_text"
  | "prompt_view"
  | "prompt_copy"
  | "prompt_share"
  | "prompt_save"
  | "prompt_unsave"
  | "upgrade_prompt_shown"
  | "upgrade_cta_click"
  | "checkout_initiated"
  | "checkout_completed"
  | "cookie_consent"
  | "search"
  | "select_content";

export type GTMUserData = {
  user_id?: string;
  user_email?: string;
  user_plan?: "free" | "premium";
  user_status?: string;
  language?: string;
};

type DataLayerArgs = [command: "event", eventName: GTMEventName, eventParams?: Record<string, unknown>];

function getDataLayer(): unknown[] {
  if (typeof window === "undefined") return [];
  window.dataLayer = window.dataLayer || [];
  return window.dataLayer;
}

function push(args: DataLayerArgs) {
  const dl = getDataLayer();
  const [, eventName, eventParams] = args;
  // GTM triggers match on the `event` key of an object push.
  dl.push({ event: eventName, ...(eventParams ?? {}) });
  // Also keep the gtag-style tuple for any direct gtag consumers.
  dl.push(args);
}

/** Push any structured event to the dataLayer. */
export function gtmEvent(
  eventName: GTMEventName,
  params?: Record<string, unknown>,
) {
  push(["event", eventName, params ?? {}]);
}

/** Push user properties once on auth state changes. */
export function gtmSetUser(user: GTMUserData) {
  push(["event", "user_identified", user]);
}

/** Clear user properties on logout. */
export function gtmClearUser() {
  push(["event", "user_identified", {}]);
}

/** Page view event — used instead of the automatic GA4 page_view. */
export function gtmPageView(path: string, title?: string, locale?: string) {
  gtmEvent("page_view", { page_path: path, page_title: title, language: locale });
}

/** Track a content generation event. */
export function gtmGeneration(
  tool: "cv" | "cover_letter" | "ats" | "humanizer",
  options: { plan?: string; locale?: string; error?: string } = {},
) {
  const map: Record<typeof tool, GTMEventName> = {
    cv: "generate_cv",
    cover_letter: "generate_cover_letter",
    ats: "score_ats",
    humanizer: "humanize_text",
  };
  gtmEvent(map[tool], { tool, ...options });
}

/** Track prompt library interactions. */
export function gtmPromptAction(
  action: "view" | "copy" | "share" | "save" | "unsave",
  prompt: { id: string; slug: string; title: string; premium?: boolean; category?: string },
  options: { plan?: string; locale?: string; method?: string } = {},
) {
  const map: Record<typeof action, GTMEventName> = {
    view: "prompt_view",
    copy: "prompt_copy",
    share: "prompt_share",
    save: "prompt_save",
    unsave: "prompt_unsave",
  };
  gtmEvent(map[action], {
    prompt_id: prompt.id,
    prompt_slug: prompt.slug,
    prompt_title: prompt.title,
    prompt_premium: prompt.premium ?? false,
    prompt_category: prompt.category,
    ...options,
  });
}

/** Track premium upsell impressions and CTA clicks. */
export function gtmUpgrade(
  action: "shown" | "cta_click",
  context: { source: string; prompt_title?: string; prompt_slug?: string; plan?: string; locale?: string },
) {
  gtmEvent(action === "shown" ? "upgrade_prompt_shown" : "upgrade_cta_click", context);
}

/** Track subscription/checkout events. */
export function gtmCheckout(
  action: "initiated" | "completed",
  details: { plan?: string; trial?: boolean; value?: number; currency?: string; locale?: string },
) {
  gtmEvent(action === "initiated" ? "checkout_initiated" : "checkout_completed", details);
}

/** Track cookie consent choices. */
export function gtmConsent(choice: {
  essential: boolean;
  functional: boolean;
  analytics: boolean;
  version: number;
}) {
  gtmEvent("cookie_consent", {
    consent_essential: choice.essential,
    consent_functional: choice.functional,
    consent_analytics: choice.analytics,
    consent_version: choice.version,
  });
}

/** Track search queries. */
export function gtmSearch(query: string, locale?: string) {
  gtmEvent("search", { search_term: query, language: locale });
}

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}
