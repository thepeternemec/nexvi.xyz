
CREATE TABLE public.translations_cache (
  hash text NOT NULL,
  locale text NOT NULL,
  source text NOT NULL,
  translated text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (hash, locale)
);
GRANT SELECT ON public.translations_cache TO anon, authenticated;
GRANT ALL ON public.translations_cache TO service_role;
ALTER TABLE public.translations_cache ENABLE ROW LEVEL SECURITY;
CREATE POLICY "translations_cache public read" ON public.translations_cache FOR SELECT TO anon, authenticated USING (true);
CREATE INDEX idx_translations_cache_locale ON public.translations_cache (locale);
