import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { CheckResult, CheckStatus } from "@/lib/seo-monitor.server";

export interface SeoRunRow {
  id: string;
  created_at: string;
  trigger_source: string;
  status: CheckStatus;
  passed: number;
  warned: number;
  failed: number;
  checks: CheckResult[];
}

/** Latest monitoring runs, newest first. Signed-in users only. */
export const listSeoRuns = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("seo_check_runs")
      .select("id, created_at, trigger_source, status, passed, warned, failed, checks")
      .order("created_at", { ascending: false })
      .limit(20);
    if (error) throw new Error(error.message);
    return (data ?? []) as unknown as SeoRunRow[];
  });

/** Run the full check suite immediately and persist the result. */
export const triggerSeoRun = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
    const { runAndRecordSeoChecks } = await import("@/lib/seo-monitor-runner.server");
    return runAndRecordSeoChecks("manual");
  });
