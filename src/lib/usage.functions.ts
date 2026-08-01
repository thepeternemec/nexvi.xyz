import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { FREE_LIMITS, type ToolKey } from "@/lib/plan-limits";

export type UsageSnapshot = {
  plan: "free" | "premium";
  used: Record<ToolKey, number>;
};

const EMPTY: UsageSnapshot = {
  plan: "free",
  used: { cv: 0, coverLetter: 0, ats: 0, humanizer: 0 },
};

function normalize(raw: unknown): UsageSnapshot {
  const r = (raw ?? {}) as Record<string, unknown>;
  const num = (v: unknown) => (typeof v === "number" && v > 0 ? Math.floor(v) : 0);
  return {
    plan: r["plan"] === "premium" ? "premium" : "free",
    used: {
      cv: num(r["cv"]),
      coverLetter: num(r["coverLetter"]),
      ats: num(r["ats"]),
      humanizer: num(r["humanizer"]),
    },
  };
}

export const getMyUsage = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<UsageSnapshot> => {
    try {
      const { data, error } = await context.supabase.rpc("get_tool_usage");
      if (error) throw new Error(error.message);
      return normalize(data);
    } catch {
      return EMPTY;
    }
  });

export type ConsumeResult = {
  allowed: boolean;
  plan: "free" | "premium";
  used: number;
  limit: number;
};

export const consumeToolCredit = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { tool: ToolKey }) => {
    if (!["cv", "coverLetter", "ats", "humanizer"].includes(d?.tool)) {
      throw new Error("Unknown tool");
    }
    return d;
  })
  .handler(async ({ data, context }): Promise<ConsumeResult> => {
    const limit = FREE_LIMITS[data.tool];
    const { data: res, error } = await context.supabase.rpc("consume_tool_credit", {
      _tool: data.tool,
      _limit: limit,
    });
    if (error) throw new Error(error.message);
    const r = (res ?? {}) as Record<string, unknown>;
    return {
      allowed: r["allowed"] === true,
      plan: r["plan"] === "premium" ? "premium" : "free",
      used: typeof r["used"] === "number" ? r["used"] : limit,
      limit: typeof r["limit"] === "number" ? r["limit"] : limit,
    };
  });
