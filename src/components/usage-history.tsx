import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { History, Loader2, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { TOOL_META } from "@/lib/plan-limits";
import { getMyUsageHistory, type UsageEvent } from "@/lib/usage-history.functions";

function formatWhen(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function UsageHistory() {
  const fetchHistory = useServerFn(getMyUsageHistory);
  const [events, setEvents] = useState<UsageEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        setAuthed(false);
        setEvents([]);
        return;
      }
      setAuthed(true);
      setEvents(await fetchHistory());
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [fetchHistory]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="mt-12">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="font-display flex items-center gap-2 text-2xl tracking-tight">
            <History className="h-5 w-5" /> Usage history
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Every generation you've run, and how it was counted.
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={load} disabled={loading} className="rounded-full">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
        </Button>
      </div>

      <div className="mt-5 overflow-hidden rounded-3xl border border-border/70 bg-card">
        {loading ? (
          <div className="divide-y divide-border/60">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center justify-between gap-4 px-5 py-4">
                <div className="h-4 w-40 animate-pulse rounded bg-muted" />
                <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>
        ) : !authed ? (
          <div className="px-5 py-10 text-center text-sm text-muted-foreground">
            Sign in to see your generation history.
          </div>
        ) : events.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-muted-foreground">
            No generations yet — run a CV, cover letter, ATS score or Humanizer and it will show up here.
          </div>
        ) : (
          <ul className="divide-y divide-border/60">
            {events.map((e) => (
              <li
                key={e.id}
                className="flex flex-col gap-1 px-5 py-4 transition hover:bg-muted/40 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{TOOL_META[e.tool].label}</div>
                  <div className="text-xs text-muted-foreground tabular-nums">{formatWhen(e.createdAt)}</div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {e.plan === "premium" ? (
                    <span className="inline-flex items-center rounded-full border border-border bg-muted px-2.5 py-1 text-[11px] font-normal text-muted-foreground">
                      Premium — unlimited
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full border border-border px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                      Free — counted against allowance
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
