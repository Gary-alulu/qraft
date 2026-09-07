"use client";

import { createContext, useContext, useCallback, useEffect, useMemo, useState } from "react";
import { getSupabaseBrowser, isSupabaseAuthConfigured } from "@/lib/supabase-browser";

const SessionContext = createContext(null);

export default function AuthProvider({ children }) {
  const [status, setStatus] = useState("loading");
  const [user, setUser] = useState(null);

  const refreshSession = useCallback(async (supabaseSession) => {
    // No Supabase session -> signed out.
    if (!supabaseSession?.user) {
      setStatus("unauthenticated");
      setUser(null);
      return;
    }

    // Fetch the app-side profile (Mongo user) to get the Mongo id/role/name.
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const data = await res.json();
      if (res.ok && data.user && data.user.id) {
        setStatus("authenticated");
        setUser(data.user);
        return;
      }
    } catch (e) {
      console.error("Failed to load session profile", e);
    }

    setStatus("unauthenticated");
    setUser(null);
  }, []);

  useEffect(() => {
    if (!isSupabaseAuthConfigured()) {
      setStatus("unauthenticated");
      return;
    }

    const supabase = getSupabaseBrowser();
    let cancelled = false;

    supabase.auth.getSession().then(({ data }) => {
      if (!cancelled) refreshSession(data.session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, supabaseSession) => {
      if (!cancelled) refreshSession(supabaseSession);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [refreshSession]);

  const signOut = useCallback(async () => {
    try {
      const supabase = getSupabaseBrowser();
      await supabase.auth.signOut();
    } catch (e) {
      console.error("Sign out failed", e);
    }
    setStatus("unauthenticated");
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      // next-auth-compatible shape
      data: user ? { user } : null,
      status,
      user,
      signOut,
    }),
    [user, status, signOut]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within <AuthProvider>");
  return ctx;
}