import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { sendTransactionalEmail } from "@/lib/email/send";

/**
 * Sends the branded welcome email once, the first time a new account has an
 * authenticated session. Guarded by profiles.welcome_email_sent_at so it can
 * never fire twice, plus an idempotency key on the send itself.
 */
export function useWelcomeEmail() {
  const running = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function maybeSend() {
      if (running.current) return;
      running.current = true;
      try {
        const { data } = await supabase.auth.getSession();
        const user = data.session?.user;
        if (!user?.email || cancelled) return;

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("welcome_email_sent_at, full_name, created_at")
          .eq("id", user.id)
          .maybeSingle();

        if (error || !profile || profile.welcome_email_sent_at || cancelled) return;

        // Only genuinely new accounts get a welcome email — never long-time users.
        const createdAt = profile.created_at ? Date.parse(profile.created_at) : NaN;
        const isNewAccount =
          Number.isFinite(createdAt) && Date.now() - createdAt < 24 * 60 * 60 * 1000;
        if (!isNewAccount) {
          await supabase
            .from("profiles")
            .update({ welcome_email_sent_at: new Date().toISOString() })
            .eq("id", user.id)
            .is("welcome_email_sent_at", null);
          return;
        }

        // Claim the slot first so concurrent tabs cannot both send.
        const { data: claimed, error: claimError } = await supabase
          .from("profiles")
          .update({ welcome_email_sent_at: new Date().toISOString() })
          .eq("id", user.id)
          .is("welcome_email_sent_at", null)
          .select("id");

        if (claimError || !claimed || claimed.length === 0) return;

        const name =
          profile.full_name ??
          (user.user_metadata?.name as string | undefined) ??
          undefined;

        const result = await sendTransactionalEmail({
          templateName: "welcome",
          recipientEmail: user.email,
          idempotencyKey: `welcome-${user.id}`,
          templateData: name ? { name } : {},
        });

        if (!result.success && result.reason !== "email_suppressed") {
          // Release the claim so a later session can retry.
          await supabase
            .from("profiles")
            .update({ welcome_email_sent_at: null })
            .eq("id", user.id);
        }
      } catch {
        // Never surface welcome-email problems to the user.
      } finally {
        running.current = false;
      }
    }

    maybeSend();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") maybeSend();
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);
}
