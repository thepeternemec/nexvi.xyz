import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

// Zod schema mirroring the public.prompts table — every field except slug/title/body is optional
const PromptInput = z.object({
  slug: z.string().min(1).max(160).regex(/^[a-z0-9-]+$/, "slug must be lowercase letters, numbers, and dashes"),
  title: z.string().min(1).max(200),
  outcome: z.string().max(300).optional().nullable(),
  description: z.string().max(4000).optional().nullable(),
  category_slug: z.string().max(60).optional().nullable(),
  subcategory: z.string().max(80).optional().nullable(),
  audience: z.array(z.string().max(60)).max(20).optional(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  beginner: z.boolean().optional(),
  price: z.number().min(0).max(9999).optional(),
  is_premium: z.boolean().optional(),
  is_featured: z.boolean().optional(),
  published: z.boolean().optional(),
  tools: z.array(z.string().max(40)).max(20).optional(),
  tags: z.array(z.string().max(40)).max(30).optional(),
  language: z.string().max(10).optional(),
  estimated_time: z.string().max(40).optional().nullable(),
  creator_name: z.string().max(120).optional().nullable(),
  creator_handle: z.string().max(80).optional().nullable(),
  creator_avatar: z.string().max(500).optional().nullable(),
  cover: z.string().max(500).optional().nullable(),
  hero_image_url: z.string().max(1000).optional().nullable(),
  body: z.string().min(1).max(40000),
  variables: z.array(z.any()).max(50).optional(),
  instructions: z.array(z.string().max(500)).max(30).optional(),
  examples: z.array(z.any()).max(20).optional(),
  tips: z.array(z.string().max(500)).max(30).optional(),
  faqs: z.array(z.any()).max(20).optional(),
  related_slugs: z.array(z.string().max(160)).max(20).optional(),
  source: z.string().max(500).optional().nullable(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export type PromptInput = z.infer<typeof PromptInput>;

const ImportInput = z.object({
  prompts: z.array(PromptInput).min(1).max(500),
  upsert: z.boolean().optional(),
});

async function assertAdmin(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin role required");
}

export const importPrompts = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => ImportInput.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);

    const rows = data.prompts.map((p) => ({
      ...p,
      audience: p.audience ?? [],
      tools: p.tools ?? [],
      tags: p.tags ?? [],
      instructions: p.instructions ?? [],
      tips: p.tips ?? [],
      related_slugs: p.related_slugs ?? [],
      variables: p.variables ?? [],
      examples: p.examples ?? [],
      faqs: p.faqs ?? [],
      metadata: p.metadata ?? {},
    }));

    const query = supabaseAdmin.from("prompts");
    const { data: inserted, error } = data.upsert
      ? await query.upsert(rows, { onConflict: "slug" }).select("id, slug")
      : await query.insert(rows).select("id, slug");

    if (error) throw new Error(error.message);
    return { count: inserted?.length ?? 0, slugs: inserted?.map((r) => r.slug) ?? [] };
  });

// Claim admin role if no admin exists yet — used to bootstrap the first admin
export const claimAdminIfFirst = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { count, error: countErr } = await supabaseAdmin
      .from("user_roles")
      .select("*", { count: "exact", head: true })
      .eq("role", "admin");
    if (countErr) throw new Error(countErr.message);
    if ((count ?? 0) > 0) {
      // Already has an admin — only return whether current user is admin
      const { data } = await supabaseAdmin
        .from("user_roles")
        .select("role")
        .eq("user_id", context.userId)
        .eq("role", "admin")
        .maybeSingle();
      return { claimed: false, isAdmin: !!data };
    }
    const { error } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: context.userId, role: "admin" });
    if (error) throw new Error(error.message);
    return { claimed: true, isAdmin: true };
  });

export const getPromptStats = createServerFn({ method: "GET" }).handler(async () => {
  const [{ count: total }, { count: published }] = await Promise.all([
    supabaseAdmin.from("prompts").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("prompts").select("*", { count: "exact", head: true }).eq("published", true),
  ]);
  return { total: total ?? 0, published: published ?? 0 };
});
