import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { getMyUsage, consumeToolCredit, type UsageSnapshot } from "@/lib/usage.functions";
import { FREE_LIMITS, TOOL_KEYS, type ToolKey } from "@/lib/plan-limits";

const ANON_KEY = "applywise:anon-generation-used";

type State = {
  loading: boolean;
  isAuthenticated: boolean;
  snapshot: UsageSnapshot;
  anonUsed: boolean;
};

const initial: State = {
  loading: true,
  isAuthenticated: false,
  snapshot: { plan: "free", used: { cv: 0, coverLetter: 0, ats: 0, humanizer: 0 } },
  anonUsed: false,
};

let state: State = initial;
const listeners = new Set<() => void>();

function set(next: Partial<State>) {
  state = { ...state, ...next };
  listeners.forEach((l) => l());
}

export function readAnonUsed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(ANON_KEY) === "1";
  } catch {
    return false;
  }
}

export function markAnonUsed() {
  try {
    window.localStorage.setItem(ANON_KEY, "1");
  } catch {
    /* ignore */
  }
  set({ anonUsed: true });
}

export function useUsage() {
  const fetchUsage = useServerFn(getMyUsage);
  const consumeFn = useServerFn(consumeToolCredit);
  const [, force] = useState(0);

  useEffect(() => {
    const l = () => force((n) => n + 1);
    listeners.add(l);
    return () => listeners.delete(l);
  }, []);

  const refresh = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      set({ loading: false, isAuthenticated: false, anonUsed: readAnonUsed() });
      return;
    }
    set({ loading: true, isAuthenticated: true });
    try {
      const snapshot = await fetchUsage();
      set({ loading: false, isAuthenticated: true, snapshot });
    } catch {
      set({ loading: false, isAuthenticated: true });
    }
  }, [fetchUsage]);

  useEffect(() => {
    refresh();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      refresh();
    });
    return () => subscription.unsubscribe();
  }, [refresh]);

  const isPremium = state.snapshot.plan === "premium";

  const remaining = useCallback(
    (tool: ToolKey) => {
      if (isPremium) return Infinity;
      return Math.max(0, FREE_LIMITS[tool] - state.snapshot.used[tool]);
    },
    [isPremium],
  );

  const consume = useCallback(
    async (tool: ToolKey) => {
      const res = await consumeFn({ data: { tool } });
      await refresh();
      return res;
    },
    [consumeFn, refresh],
  );

  return {
    loading: state.loading,
    isAuthenticated: state.isAuthenticated,
    plan: state.snapshot.plan,
    isPremium,
    used: state.snapshot.used,
    limits: FREE_LIMITS,
    tools: TOOL_KEYS,
    anonUsed: state.anonUsed,
    remaining,
    consume,
    refresh,
    markAnonUsed,
  };
}
