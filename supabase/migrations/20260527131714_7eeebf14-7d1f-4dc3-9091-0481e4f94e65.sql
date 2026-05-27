
-- Subscriptions
CREATE TABLE public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  plan text NOT NULL DEFAULT 'free',
  status text NOT NULL DEFAULT 'inactive',
  current_period_end timestamptz,
  cancel_at_period_end boolean NOT NULL DEFAULT false,
  provider text,
  provider_customer_id text,
  provider_subscription_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.subscriptions TO authenticated;
GRANT ALL ON public.subscriptions TO service_role;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own subscription" ON public.subscriptions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE TRIGGER subscriptions_updated_at BEFORE UPDATE ON public.subscriptions
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Bundles
CREATE TABLE public.bundles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  cover text,
  hero_image_url text,
  category_slug text REFERENCES public.categories(slug) ON DELETE SET NULL,
  is_premium boolean NOT NULL DEFAULT true,
  published boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.bundles TO anon, authenticated;
GRANT ALL ON public.bundles TO service_role;
ALTER TABLE public.bundles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Bundles public read" ON public.bundles FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "Admins manage bundles" ON public.bundles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER bundles_updated_at BEFORE UPDATE ON public.bundles
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.bundle_prompts (
  bundle_id uuid NOT NULL REFERENCES public.bundles(id) ON DELETE CASCADE,
  prompt_id uuid NOT NULL REFERENCES public.prompts(id) ON DELETE CASCADE,
  sort_order int NOT NULL DEFAULT 0,
  PRIMARY KEY (bundle_id, prompt_id)
);
GRANT SELECT ON public.bundle_prompts TO anon, authenticated;
GRANT ALL ON public.bundle_prompts TO service_role;
ALTER TABLE public.bundle_prompts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Bundle prompts public read" ON public.bundle_prompts FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage bundle prompts" ON public.bundle_prompts FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Premium access helper
CREATE OR REPLACE FUNCTION public.has_active_subscription(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.subscriptions
    WHERE user_id = _user_id
      AND status IN ('active', 'trialing')
      AND (current_period_end IS NULL OR current_period_end > now())
  )
$$;
REVOKE EXECUTE ON FUNCTION public.has_active_subscription(uuid) FROM PUBLIC, anon, authenticated;
