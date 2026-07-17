## Goal

`/`, `/de`, `/es`, `/it`, `/fr` — and every subpage under those prefixes (`/de/cv`, `/es/library`, `/it/pricing`, `/fr/ats`, etc.) — render fully in the selected language, including body copy on subpages plus dynamic content (prompt/bundle titles and descriptions) auto-translated via Lovable AI at runtime.

## Approach

### 1. Locale-aware routing (no route duplication)

Instead of creating 5 × ~15 duplicate route files, promote locale to a **pathless layout segment**:

```text
src/routes/
  __root.tsx                (unchanged)
  index.tsx                 → "/"     (locale = en)
  cv.tsx, ats.tsx, ...      → "/cv", "/ats" (locale = en)
  $locale/
    index.tsx               → "/de", "/es", "/it", "/fr"
    cv.tsx                  → "/de/cv", "/es/cv", ...
    ats.tsx
    cover-letter.tsx
    library.tsx
    bundles.tsx
    pricing.tsx
    marketplace.tsx
    prompt.$slug.tsx
    bundle.$slug.tsx
    creator.tsx / creators.tsx
    login.tsx / signup.tsx
    dashboard.tsx / assistant.tsx
```

Each `$locale/*.tsx` reads `params.locale`, validates it against `["de","es","it","fr"]` (else `notFound()`), and renders the **same page component** with a `locale` prop. Existing English routes stay as-is. This keeps route count manageable and avoids sync drift.

### 2. Translation dictionary

Extend `src/lib/i18n.ts` with a nested `pages` copy tree covering static strings on every page: headings, labels, buttons, form placeholders, empty states, toasts, table headers, pricing plan copy, auth forms, dashboard chrome, etc. All 5 locales.

Refactor each page component to accept `locale` and pull all user-visible text from `copy[locale].pages.<page>`.

### 3. Header, footer, meta

- `SiteShell` already accepts `locale`. Extend NAV labels + footer copy to i18n and translate.
- Every locale-prefixed route sets localized `<title>`, meta description, `og:*`, `canonical`, and full `hreflang` alternates.

### 4. Language switcher

Already strips prefix and swaps — keep as-is; it now switches deep-link paths correctly across all subpages.

### 5. Dynamic content — AI runtime translation

Add `src/lib/translate.functions.ts` — a `createServerFn` that:

- Takes `{ texts: string[], targetLocale: Locale }`.
- Short-circuits when `targetLocale === "en"`.
- Calls Lovable AI Gateway (`google/gemini-3-flash-preview`) with a strict JSON schema returning `{ translations: string[] }` in original order.
- Uses a keyed in-memory LRU cache (`sha1(text)+locale`) on the server to avoid re-translating the same string; optional Supabase-backed cache table `translations_cache` for persistence across deploys (keyed by `hash`, `locale`).

Client wrapper: `useTranslatedList(items, fields, locale)` — a React hook that batches unique strings, calls the server fn once, and returns items with translated fields. Loading state shows the English text so nothing looks broken.

Wire this into:
- `library.tsx` — prompt cards (title, description, tags)
- `bundles.tsx` and `bundle.$slug.tsx` — bundle titles/descriptions
- `marketplace.tsx` — listing titles/descriptions
- `prompt.$slug.tsx` — prompt title, description, body preview
- `creators.tsx` / `creator.tsx` — creator bios

### 6. Migration for translation cache

```sql
create table public.translations_cache (
  hash text not null,
  locale text not null,
  translated text not null,
  created_at timestamptz not null default now(),
  primary key (hash, locale)
);
grant select, insert on public.translations_cache to authenticated, anon;
grant all on public.translations_cache to service_role;
alter table public.translations_cache enable row level security;
create policy "public read" on public.translations_cache for select to anon, authenticated using (true);
create policy "server insert" on public.translations_cache for insert to authenticated with check (true);
```

Server fn uses admin client for writes.

## What stays English

- User-authored content the user creates in-app (their own CV drafts, cover letters, saved notes). Localizing these would corrupt their data.
- AI-generated CV/cover-letter output. The generator prompts will be told to output in the user's selected UI locale, but existing saved outputs are untouched.
- Legal/marketing brand names.

## Technical notes

- Prompt/Bundle mock data (`src/lib/mock-data.ts`) stays in English source of truth; translations resolved at render time.
- `detectLocaleFromPath` gains full path-prefix support for all sub-routes.
- `SiteShell` reads locale from route match (`useParams({ strict: false })`) if not passed, so pages don't need to plumb it explicitly.
- Route param validation uses `parseParams`/`stringifyParams` on the `$locale` layout to reject unknown locales.
- `hreflang` sets on every localized leaf; sitemap generation deferred.

## Scope estimate

~40 files: 20+ new locale-scoped route files, ~15 page component refactors to accept `locale`, i18n dictionary expansion (largest single edit), translation server fn + hook + migration.

## Out of scope

- URL slug translation (paths stay English: `/de/cover-letter`, not `/de/anschreiben`).
- Right-to-left languages.
- Currency/number/date locale formatting beyond what already works.
- Translating error messages from third-party libs.
