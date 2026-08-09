CREATE TABLE public.seo_check_runs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trigger_source TEXT NOT NULL DEFAULT 'cron',
  status TEXT NOT NULL CHECK (status IN ('pass','warn','fail')),
  passed INTEGER NOT NULL DEFAULT 0,
  warned INTEGER NOT NULL DEFAULT 0,
  failed INTEGER NOT NULL DEFAULT 0,
  checks JSONB NOT NULL DEFAULT '[]'::jsonb,
  alerted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX seo_check_runs_created_at_idx ON public.seo_check_runs (created_at DESC);

GRANT SELECT ON public.seo_check_runs TO authenticated;
GRANT ALL ON public.seo_check_runs TO service_role;

ALTER TABLE public.seo_check_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Signed-in users can view SEO check runs"
  ON public.seo_check_runs FOR SELECT
  TO authenticated
  USING (true);