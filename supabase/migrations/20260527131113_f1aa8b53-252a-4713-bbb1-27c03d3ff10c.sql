
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Categories
CREATE TABLE public.categories (
  slug text PRIMARY KEY,
  name text NOT NULL,
  emoji text,
  description text,
  gradient text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are public" ON public.categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage categories" ON public.categories FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Prompts (deep schema for non-coding, general public prompts)
CREATE TABLE public.prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  outcome text,
  description text,
  category_slug text REFERENCES public.categories(slug) ON DELETE SET NULL,
  subcategory text,
  audience text[] NOT NULL DEFAULT '{}',
  difficulty text NOT NULL DEFAULT 'beginner',
  beginner boolean NOT NULL DEFAULT true,
  price numeric(10,2) NOT NULL DEFAULT 0,
  is_premium boolean NOT NULL DEFAULT false,
  is_featured boolean NOT NULL DEFAULT false,
  published boolean NOT NULL DEFAULT true,
  rating numeric(3,2) NOT NULL DEFAULT 0,
  reviews_count int NOT NULL DEFAULT 0,
  uses_count int NOT NULL DEFAULT 0,
  saves_count int NOT NULL DEFAULT 0,
  tools text[] NOT NULL DEFAULT '{}',
  tags text[] NOT NULL DEFAULT '{}',
  language text NOT NULL DEFAULT 'en',
  estimated_time text,
  creator_name text,
  creator_handle text,
  creator_avatar text,
  cover text,
  hero_image_url text,
  body text NOT NULL,
  variables jsonb NOT NULL DEFAULT '[]'::jsonb,
  instructions text[] NOT NULL DEFAULT '{}',
  examples jsonb NOT NULL DEFAULT '[]'::jsonb,
  tips text[] NOT NULL DEFAULT '{}',
  faqs jsonb NOT NULL DEFAULT '[]'::jsonb,
  related_slugs text[] NOT NULL DEFAULT '{}',
  source text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.prompts TO anon, authenticated;
GRANT ALL ON public.prompts TO service_role;

CREATE INDEX prompts_category_idx ON public.prompts(category_slug);
CREATE INDEX prompts_published_idx ON public.prompts(published);
CREATE INDEX prompts_tags_idx ON public.prompts USING gin(tags);
CREATE INDEX prompts_audience_idx ON public.prompts USING gin(audience);
CREATE INDEX prompts_search_idx ON public.prompts USING gin (to_tsvector('english', coalesce(title,'') || ' ' || coalesce(outcome,'') || ' ' || coalesce(description,'')));

ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published prompts public" ON public.prompts FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "Admins read all prompts" ON public.prompts FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage prompts" ON public.prompts FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;
CREATE TRIGGER prompts_updated_at BEFORE UPDATE ON public.prompts
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Saves
CREATE TABLE public.saved_prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt_id uuid NOT NULL REFERENCES public.prompts(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, prompt_id)
);
GRANT SELECT, INSERT, DELETE ON public.saved_prompts TO authenticated;
GRANT ALL ON public.saved_prompts TO service_role;
ALTER TABLE public.saved_prompts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own saves" ON public.saved_prompts FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own saves" ON public.saved_prompts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own saves" ON public.saved_prompts FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Seed categories
INSERT INTO public.categories (slug, name, emoji, description, gradient, sort_order) VALUES
  ('career', 'Get a Job', '💼', 'Resumes, cover letters, interview prep', 'from-violet-500/20 to-fuchsia-500/20', 1),
  ('productivity', 'Productivity', '⚡', 'Plan smarter, focus deeper, ship faster', 'from-amber-400/20 to-orange-500/20', 2),
  ('content', 'Create Content', '🎬', 'Hooks, scripts, captions, thumbnails', 'from-rose-400/20 to-pink-500/20', 3),
  ('study', 'Study & Learn', '📚', 'Summaries, flashcards, study plans', 'from-sky-400/20 to-indigo-500/20', 4),
  ('marketing', 'Marketing', '📈', 'Campaigns, ads, brand messaging', 'from-emerald-400/20 to-teal-500/20', 5),
  ('startup', 'Start a Business', '🚀', 'Ideation, validation, pitch decks', 'from-purple-500/20 to-indigo-500/20', 6),
  ('fitness', 'Fitness', '🏋️', 'Workout plans, nutrition, habits', 'from-lime-400/20 to-emerald-500/20', 7),
  ('travel', 'Travel', '✈️', 'Itineraries, packing, hidden gems', 'from-cyan-400/20 to-sky-500/20', 8),
  ('email', 'Write Emails', '✉️', 'Outreach, replies, negotiations', 'from-yellow-400/20 to-amber-500/20', 9),
  ('slides', 'Presentations', '🎨', 'Decks, outlines, speaker notes', 'from-fuchsia-500/20 to-rose-500/20', 10),
  ('social', 'Social Media', '📱', 'Posts, growth, engagement', 'from-pink-400/20 to-rose-500/20', 11),
  ('skills', 'Learn a Skill', '🧠', 'Roadmaps, practice, mastery', 'from-indigo-400/20 to-violet-500/20', 12);
