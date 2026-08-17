CREATE TABLE IF NOT EXISTS public.user_resumes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  file_name TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_resumes TO authenticated;
GRANT ALL ON public.user_resumes TO service_role;
ALTER TABLE public.user_resumes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage their own resume" ON public.user_resumes;
CREATE POLICY "Users manage their own resume" ON public.user_resumes FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);