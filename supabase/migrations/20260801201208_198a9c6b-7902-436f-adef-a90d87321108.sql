CREATE TABLE public.tool_usage (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  plan text NOT NULL DEFAULT 'free',
  anonymous_generation_used boolean NOT NULL DEFAULT false,
  cv_used integer NOT NULL DEFAULT 0 CHECK (cv_used >= 0),
  cover_letter_used integer NOT NULL DEFAULT 0 CHECK (cover_letter_used >= 0),
  ats_used integer NOT NULL DEFAULT 0 CHECK (ats_used >= 0),
  humanizer_used integer NOT NULL DEFAULT 0 CHECK (humanizer_used >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.tool_usage TO authenticated;
GRANT ALL ON public.tool_usage TO service_role;

ALTER TABLE public.tool_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own usage" ON public.tool_usage
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users insert own usage" ON public.tool_usage
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER tool_usage_touch_updated_at
  BEFORE UPDATE ON public.tool_usage
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE OR REPLACE FUNCTION public.get_tool_usage()
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  premium boolean;
  r public.tool_usage;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  premium := public.has_active_subscription(uid);
  SELECT * INTO r FROM public.tool_usage WHERE user_id = uid;
  RETURN jsonb_build_object(
    'plan', CASE WHEN premium THEN 'premium' ELSE 'free' END,
    'cv', COALESCE(r.cv_used, 0),
    'coverLetter', COALESCE(r.cover_letter_used, 0),
    'ats', COALESCE(r.ats_used, 0),
    'humanizer', COALESCE(r.humanizer_used, 0)
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.consume_tool_credit(_tool text, _limit integer)
RETURNS jsonb
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  premium boolean;
  used integer;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  IF _tool NOT IN ('cv', 'coverLetter', 'ats', 'humanizer') THEN
    RAISE EXCEPTION 'Unknown tool';
  END IF;

  premium := public.has_active_subscription(uid);
  IF premium THEN
    RETURN jsonb_build_object('allowed', true, 'plan', 'premium', 'used', 0, 'limit', -1);
  END IF;

  INSERT INTO public.tool_usage (user_id) VALUES (uid)
  ON CONFLICT (user_id) DO NOTHING;

  UPDATE public.tool_usage SET
    cv_used = cv_used + CASE WHEN _tool = 'cv' THEN 1 ELSE 0 END,
    cover_letter_used = cover_letter_used + CASE WHEN _tool = 'coverLetter' THEN 1 ELSE 0 END,
    ats_used = ats_used + CASE WHEN _tool = 'ats' THEN 1 ELSE 0 END,
    humanizer_used = humanizer_used + CASE WHEN _tool = 'humanizer' THEN 1 ELSE 0 END
  WHERE user_id = uid
    AND CASE _tool
      WHEN 'cv' THEN cv_used
      WHEN 'coverLetter' THEN cover_letter_used
      WHEN 'ats' THEN ats_used
      ELSE humanizer_used
    END < _limit
  RETURNING CASE _tool
      WHEN 'cv' THEN cv_used
      WHEN 'coverLetter' THEN cover_letter_used
      WHEN 'ats' THEN ats_used
      ELSE humanizer_used
    END INTO used;

  IF used IS NULL THEN
    RETURN jsonb_build_object('allowed', false, 'plan', 'free', 'used', _limit, 'limit', _limit);
  END IF;

  RETURN jsonb_build_object('allowed', true, 'plan', 'free', 'used', used, 'limit', _limit);
END;
$$;

REVOKE ALL ON FUNCTION public.get_tool_usage() FROM public;
REVOKE ALL ON FUNCTION public.consume_tool_credit(text, integer) FROM public;
GRANT EXECUTE ON FUNCTION public.get_tool_usage() TO authenticated;
GRANT EXECUTE ON FUNCTION public.consume_tool_credit(text, integer) TO authenticated;