import { useEffect, useState, useCallback } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { getMySubscriptionAuthed, type SubscriptionSnapshot } from "@/lib/subscriptions.functions";

const ANON: SubscriptionSnapshot = {
  isAuthenticated: false,
  isPremium: false,
  plan: "free",
  status: "inactive",
  currentPeriodEnd: null,
  cancelAtPeriodEnd: false,
};

export function useSubscription() {
  const fetchSub = useServerFn(getMySubscriptionAuthed);
  const [snapshot, setSnapshot] = useState<SubscriptionSnapshot>(ANON);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        setSnapshot(ANON);
        return;
      }
      const s = await fetchSub();
      setSnapshot(s);
    } catch {
      setSnapshot(ANON);
    } finally {
      setLoading(false);
    }
  }, [fetchSub]);

  useEffect(() => {
    refresh();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      refresh();
    });
    return () => subscription.unsubscribe();
  }, [refresh]);

  return { ...snapshot, loading, refresh };
}
