/**
 * Runs the SEO check suite, records it, and emails an alert when something breaks.
 * Server-only (uses the service-role client and the email queue).
 */
import { runSeoChecks, buildAlertEmail, type SeoRunResult } from "@/lib/seo-monitor.server";

const ALERT_TO = process.env["SEO_ALERT_EMAIL"] ?? "info@applywise.eu";
const SENDER_DOMAIN = "notify.applywise.eu";

export interface RecordedRun extends SeoRunResult {
  id: string | null;
  alerted: boolean;
  triggerSource: string;
}

export async function runAndRecordSeoChecks(triggerSource: string): Promise<RecordedRun> {
  const run = await runSeoChecks(process.env["SEO_MONITOR_BASE_URL"] ?? "https://applywise.eu");
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  // Only alert when the state changed (fail after a healthy run) or on manual runs,
  // so a persistent failure doesn't send one email per cron tick.
  const { data: previous } = await supabaseAdmin
    .from("seo_check_runs")
    .select("status")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const previousStatus = (previous as { status?: string } | null)?.status;
  const shouldAlert = run.failed > 0 && previousStatus !== "fail";

  let alerted = false;
  if (shouldAlert) {
    try {
      const { subject, html, text } = buildAlertEmail(run);
      const messageId = crypto.randomUUID();
      const { error } = await supabaseAdmin.rpc("enqueue_email", {
        queue_name: "transactional_emails",
        payload: {
          message_id: messageId,
          idempotency_key: `seo-alert-${messageId}`,
          to: ALERT_TO,
          from: `ApplyWise Monitoring <alerts@${SENDER_DOMAIN}>`,
          sender_domain: SENDER_DOMAIN,
          subject,
          html,
          text,
          purpose: "transactional",
          label: "seo_monitor_alert",
          queued_at: new Date().toISOString(),
        },
      });
      if (error) console.error("Failed to queue SEO alert email", error);
      else alerted = true;
    } catch (error) {
      console.error("Failed to build/queue SEO alert email", error);
    }
  }

  const { data: inserted, error: insertError } = await supabaseAdmin
    .from("seo_check_runs")
    .insert({
      trigger_source: triggerSource,
      status: run.status,
      passed: run.passed,
      warned: run.warned,
      failed: run.failed,
      checks: run.checks as unknown as never,
      alerted,
    })
    .select("id")
    .maybeSingle();

  if (insertError) console.error("Failed to record SEO run", insertError);

  return {
    ...run,
    id: (inserted as { id?: string } | null)?.id ?? null,
    alerted,
    triggerSource,
  };
}

/** Post-deploy hook: runs at most once every 10 minutes across all isolates. */
export async function runDeploySeoCheck(): Promise<RecordedRun | null> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: recent } = await supabaseAdmin
    .from("seo_check_runs")
    .select("created_at")
    .gte("created_at", new Date(Date.now() - 10 * 60 * 1000).toISOString())
    .limit(1)
    .maybeSingle();

  if (recent) return null;
  return runAndRecordSeoChecks("deploy");
}
