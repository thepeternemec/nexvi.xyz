import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export type AuthUser = {
  id: string;
  email?: string;
  name?: string;
};

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setUser(data.session ? normalizeUser(data.session.user) : null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session ? normalizeUser(session.user) : null);
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading, isAuthenticated: !!user };
}

function normalizeUser(user: User): AuthUser {
  return {
    id: user.id,
    email: user.email ?? undefined,
    name: user.user_metadata?.name ?? user.email?.split("@")[0] ?? undefined,
  };
}
