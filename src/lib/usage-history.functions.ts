import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { ToolKey } from "@/lib/plan-limits";

export type UsageEvent = {
  id: string;
  tool: ToolKey;
  plan: "free" | "premium";
  countedAgainstFree: boolean;
  createdAt: string;
};

const TOOLS: ToolKey[] = ["cv", "coverLetter", "ats", "humanizer"];

export const getMyUsageHistory = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<UsageEvent[]> => {
    const { data, error } = await context.supabase
      .from("usage_events")
      .select("id, tool, plan, counted_against_free, created_at")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) return [];
    return (data ?? [])
      .filter((r) => TOOLS.includes(r.tool as ToolKey))
      .map((r) => ({
        id: r.id,
        tool: r.tool as ToolKey,
        plan: r.plan === "premium" ? "premium" : "free",
        countedAgainstFree: r.counted_against_free === true,
        createdAt: r.created_at,
      }));
  });
