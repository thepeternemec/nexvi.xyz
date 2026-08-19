import { supabase } from "@/integrations/supabase/client";

export type SendTransactionalEmailInput = {
  templateName: string;
  recipientEmail: string;
  idempotencyKey: string;
  templateData?: Record<string, unknown>;
};

/**
 * Sends a registered app email through the queue.
 * Requires a signed-in user — the send route validates the Supabase JWT.
 */
export async function sendTransactionalEmail(
  input: SendTransactionalEmailInput
): Promise<{ success: boolean; reason?: string }> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) return { success: false, reason: "not_authenticated" };

  const res = await fetch("/lovable/email/transactional/send", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    return { success: false, reason: `http_${res.status}` };
  }
  return (await res.json()) as { success: boolean; reason?: string };
}
