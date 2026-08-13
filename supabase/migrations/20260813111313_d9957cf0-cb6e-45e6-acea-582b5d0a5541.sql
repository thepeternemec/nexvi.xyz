DROP POLICY IF EXISTS "Signed-in users can view SEO check runs" ON public.seo_check_runs;

CREATE POLICY "Admins can view SEO check runs"
ON public.seo_check_runs
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));