import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const listBundles = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("bundles")
    .select("id, slug, title, description, cover, hero_image_url, category_slug, is_premium, sort_order")
    .eq("published", true)
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getBundleBySlug = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ slug: z.string() }).parse(input))
  .handler(async ({ data }) => {
    const { data: bundle, error } = await supabaseAdmin
      .from("bundles")
      .select("*")
      .eq("slug", data.slug)
      .eq("published", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!bundle) throw new Error("Bundle not found");
    return bundle;
  });

type BundlePromptRow = {
  prompt_id: string;
  sort_order: number;
};

export const getBundlePrompts = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ bundleSlug: z.string() }).parse(input))
  .handler(async ({ data }) => {
    // Get bundle to check premium status
    const { data: bundle, error: bErr } = await supabaseAdmin
      .from("bundles")
      .select("id, is_premium")
      .eq("slug", data.bundleSlug)
      .eq("published", true)
      .maybeSingle();
    if (bErr) throw new Error(bErr.message);
    if (!bundle) throw new Error("Bundle not found");

    // Get prompt IDs in order
    const { data: rows, error: bpErr } = await supabaseAdmin
      .from("bundle_prompts")
      .select("prompt_id, sort_order")
      .eq("bundle_id", bundle.id)
      .order("sort_order", { ascending: true });
    if (bpErr) throw new Error(bpErr.message);

    if (!rows || rows.length === 0) {
      return { bundle, prompts: [] as Record<string, unknown>[] };
    }

    const promptIds = (rows as BundlePromptRow[]).map((r) => r.prompt_id);
    const { data: prompts, error: pErr } = await supabaseAdmin
      .from("prompts")
      .select(
        "id, slug, title, outcome, description, body, category_slug, difficulty, beginner, price, is_premium, cover, tools, tags, rating, reviews_count, uses_count, creator_name, creator_handle, creator_avatar"
      )
      .in("id", promptIds)
      .eq("published", true);
    if (pErr) throw new Error(pErr.message);

    const promptMap = new Map(prompts?.map((p) => [p.id, p]));
    const orderedPrompts = (rows as BundlePromptRow[])
      .map((r) => promptMap.get(r.prompt_id))
      .filter(Boolean) as Record<string, unknown>[];

    return { bundle, prompts: orderedPrompts };
  });

export const getBundleWithAuth = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ slug: z.string() }).parse(input))
  .handler(async ({ data, context }) => {
    const [{ data: bundle }, { data: sub }] = await Promise.all([
      supabaseAdmin.from("bundles").select("*").eq("slug", data.slug).eq("published", true).maybeSingle(),
      supabaseAdmin
        .from("subscriptions")
        .select("plan, status, current_period_end")
        .eq("user_id", context.userId)
        .maybeSingle(),
    ]);
    if (!bundle) throw new Error("Bundle not found");
    const isPremium =
      sub &&
      (sub.status === "active" || sub.status === "trialing") &&
      (!sub.current_period_end || new Date(sub.current_period_end).getTime() > Date.now());

    // Get prompts
    const { data: rows } = await supabaseAdmin
      .from("bundle_prompts")
      .select("prompt_id, sort_order")
      .eq("bundle_id", bundle.id)
      .order("sort_order", { ascending: true });

    let orderedPrompts: Record<string, unknown>[] = [];
    if (rows && rows.length > 0) {
      const promptIds = (rows as BundlePromptRow[]).map((r) => r.prompt_id);
      const { data: prompts } = await supabaseAdmin
        .from("prompts")
        .select(
          "id, slug, title, outcome, description, body, category_slug, difficulty, beginner, price, is_premium, cover, tools, tags, rating, reviews_count, uses_count, creator_name, creator_handle, creator_avatar"
        )
        .in("id", promptIds)
        .eq("published", true);
      const promptMap = new Map(prompts?.map((p) => [p.id, p]));
      orderedPrompts = (rows as BundlePromptRow[])
        .map((r) => promptMap.get(r.prompt_id))
        .filter(Boolean) as Record<string, unknown>[];
    }

    return { bundle, prompts: orderedPrompts, isPremium: !!isPremium };
  });
