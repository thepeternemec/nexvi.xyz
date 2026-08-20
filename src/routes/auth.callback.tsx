import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth/callback")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Signing you in — Nexvi" },
      { name: "description", content: "Completing your Nexvi sign-in." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AuthCallback,
});

function readTokens(): { access_token: string; refresh_token: string } | null {
  const sources = [
    new URLSearchParams(window.location.hash.replace(/^#/, "")),
    new URLSearchParams(window.location.search),
  ];
  for (const params of sources) {
    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");
    if (access_token && refresh_token) return { access_token, refresh_token };
  }
  return null;
}

function safeNext(): string {
  try {
    const stored = sessionStorage.getItem("nexvi:next");
    if (stored && stored.startsWith("/") && !stored.startsWith("//")) return stored;
  } catch {
    /* ignore */
  }
  return "/dashboard";
}

function AuthCallback() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const next = safeNext();
      try {
        sessionStorage.removeItem("nexvi:next");
      } catch {
        /* ignore */
      }

      const params = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const oauthError =
        params.get("error_description") ??
        params.get("error") ??
        hashParams.get("error_description") ??
        hashParams.get("error");

      if (oauthError) {
        if (!cancelled) setError(oauthError);
        return;
      }

      const tokens = readTokens();
      if (tokens) {
        const { error: setErr } = await supabase.auth.setSession(tokens);
        if (setErr) {
          if (!cancelled) setError(setErr.message);
          return;
        }
        window.location.replace(next);
        return;
      }

      // No tokens in the URL — maybe the SDK already stored a session.
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        window.location.replace(next);
        return;
      }
      window.location.replace("/login");
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-sm text-center">
        {error ? (
          <>
            <h1 className="text-xl font-semibold text-foreground">Sign-in failed</h1>
            <p className="mt-2 text-sm text-muted-foreground">{error}</p>
            <a
              href="/login"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              Back to sign in
            </a>
          </>
        ) : (
          <>
            <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-muted border-t-primary" />
            <p className="mt-4 text-sm text-muted-foreground">Signing you in…</p>
          </>
        )}
      </div>
    </div>
  );
}
