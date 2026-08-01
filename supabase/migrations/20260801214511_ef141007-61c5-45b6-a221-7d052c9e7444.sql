CREATE TABLE public.usage_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tool text NOT NULL,
  plan text NOT NULL DEFAULT 'free',
  counted_against_free boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.usage_events TO authenticated;
GRANT ALL ON public.usage_events TO service_role;

ALTER TABLE public.usage_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own usage events"
ON public.usage_events FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE INDEX usage_events_user_created_idx ON public.usage_events (user_id, created_at DESC);

CREATE OR REPLACE FUNCTION public.consume_tool_credit(_tool text, _limit integer)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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

  INSERT INTO public.tool_usage (user_id) VALUES (uid)
  ON CONFLICT (user_id) DO NOTHING;

  UPDATE public.tool_usage SET
    plan = CASE WHEN premium THEN 'premium' ELSE 'free' END,
    cv_used = cv_used + CASE WHEN _tool = 'cv' THEN 1 ELSE 0 END,
    cover_letter_used = cover_letter_used + CASE WHEN _tool = 'coverLetter' THEN 1 ELSE 0 END,
    ats_used = ats_used + CASE WHEN _tool = 'ats' THEN 1 ELSE 0 END,
    humanizer_used = humanizer_used + CASE WHEN _tool = 'humanizer' THEN 1 ELSE 0 END,
    updated_at = now()
  WHERE user_id = uid
    AND (premium OR CASE _tool
      WHEN 'cv' THEN cv_used
      WHEN 'coverLetter' THEN cover_letter_used
      WHEN 'ats' THEN ats_used
      ELSE humanizer_used
    END < _limit)
  RETURNING CASE _tool
      WHEN 'cv' THEN cv_used
      WHEN 'coverLetter' THEN cover_letter_used
      WHEN 'ats' THEN ats_used
      ELSE humanizer_used
    END INTO used;

  IF used IS NOT NULL THEN
    INSERT INTO public.usage_events (user_id, tool, plan, counted_against_free)
    VALUES (uid, _tool, CASE WHEN premium THEN 'premium' ELSE 'free' END, NOT premium);
  END IF;

  IF premium THEN
    RETURN jsonb_build_object('allowed', true, 'plan', 'premium', 'used', COALESCE(used, 0), 'limit', -1);
  END IF;

  IF used IS NULL THEN
    RETURN jsonb_build_object('allowed', false, 'plan', 'free', 'used', _limit, 'limit', _limit);
  END IF;

  RETURN jsonb_build_object('allowed', true, 'plan', 'free', 'used', used, 'limit', _limit);
END;
$function$;