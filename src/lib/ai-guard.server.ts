// Server-side enforcement of AI generation quotas.
// The UI gating in usage-gate.tsx is cosmetic: these checks are what actually
// prevent anyone from calling the AI server functions directly in a loop.
import { createHash } from "crypto";
import { createClient } from "@supabase/supabase-js";
import { getRequest, getRequestIP } from "@tanstack/react-start/server";
import type { Database } from "@/integrations/supabase/types";
import { FREE_LIMITS, type ToolKey } from "@/lib/plan-limits";

// Visitors without an account get a single free preview generation, tracked
// server-side per fingerprint within this window.
const ANON_LIMIT = 1;
const ANON_WINDOW_MS = 24 * 60 * 60 * 1000;

export class QuotaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "QuotaError";
  }
}

function bearerToken(): string | null {
  const request = getRequest();
  const header = request?.headers?.get("authorization");
  if (!header || !header.startsWith("Bearer ")) return null;
  const token = header.slice("Bearer ".length).trim();
  return token.length > 0 ? token : null;
}

function anonFingerprint(): string {
  const request = getRequest();
  const ip =
    getRequestIP({ xForwardedFor: true }) ??
    request?.headers?.get("cf-connecting-ip") ??
    request?.headers?.get("x-real-ip") ??
    "unknown";
  const ua = request?.headers?.get("user-agent") ?? "";
  const salt = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "applywise";
  return createHash("sha256").update(`${salt}:${ip}:${ua}`).digest("hex");
}

async function consumeAnonCredit() {
  const fingerprint = anonFingerprint();
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const { data: row } = await supabaseAdmin
    .from("anon_ai_usage")
    .select("id, used, window_start")
    .eq("fingerprint", fingerprint)
    .maybeSingle();

  const now = Date.now();

  if (!row) {
    const { error } = await supabaseAdmin
      .from("anon_ai_usage")
      .insert({ fingerprint, used: 1 });
    // A concurrent insert means this fingerprint already burned its preview.
    if (error) throw new QuotaError("Free preview already used. Create a free account to continue.");
    return;
  }

  const expired = now - new Date(row.window_start).getTime() > ANON_WINDOW_MS;

  if (!expired && row.used >= ANON_LIMIT) {
    throw new QuotaError("Free preview already used. Create a free account to continue.");
  }

  await supabaseAdmin
    .from("anon_ai_usage")
    .update({
      used: expired ? 1 : row.used + 1,
      window_start: expired ? new Date(now).toISOString() : row.window_start,
      updated_at: new Date(now).toISOString(),
    })
    .eq("id", row.id);
}

async function consumeUserCredit(token: string, tool: ToolKey) {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    throw new Error("Backend is not configured.");
  }

  const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });

  const { data: claims, error: claimsError } = await supabase.auth.getClaims(token);
  if (claimsError || !claims?.claims?.sub) {
    throw new QuotaError("Your session expired. Please sign in again.");
  }

  const { data, error } = await supabase.rpc("consume_tool_credit", {
    _tool: tool,
    _limit: FREE_LIMITS[tool],
  });
  if (error) throw new QuotaError("Could not verify your remaining credits.");

  const result = (data ?? {}) as Record<string, unknown>;
  if (result["allowed"] !== true) {
    throw new QuotaError("You've reached your free limit. Upgrade to Premium for unlimited generations.");
  }
}

/**
 * Must be awaited at the start of every AI generation handler. Consumes one
 * credit for the caller (signed-in user or anonymous fingerprint) and throws a
 * QuotaError when the caller is out of quota.
 */
export async function consumeAiCredit(tool: ToolKey) {
  const token = bearerToken();
  if (token) return consumeUserCredit(token, tool);
  return consumeAnonCredit();
}

/**
 * Guard for conversational Q&A (no per-tool quota): signed-in users chat
 * freely, anonymous visitors still burn the shared free-preview credit.
 */
export async function guardChatAi() {
  const token = bearerToken();
  if (token) return;
  return consumeAnonCredit();
}
