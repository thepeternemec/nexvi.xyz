CREATE TABLE IF NOT EXISTS public.anon_ai_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fingerprint text NOT NULL,
  used integer NOT NULL DEFAULT 0,
  window_start timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (fingerprint)
);

GRANT ALL ON public.anon_ai_usage TO service_role;
ALTER TABLE public.anon_ai_usage ENABLE ROW LEVEL SECURITY;