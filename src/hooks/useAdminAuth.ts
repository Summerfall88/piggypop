import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

interface AdminAuthState {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
}

export const useAdminAuth = () => {
  const [state, setState] = useState<AdminAuthState>({
    user: null,
    isAdmin: false,
    isLoading: true,
  });

  const checkAdminRole = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();
      return !error && data !== null;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    // 1. Check existing session first
    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!mounted) return;

      if (session?.user) {
        const isAdmin = await checkAdminRole(session.user.id);
        if (mounted) {
          setState({ user: session.user, isAdmin, isLoading: false });
        }
      } else {
        setState({ user: null, isAdmin: false, isLoading: false });
      }
    };

    initSession();

    // 2. Listen for future auth changes only (not INITIAL_SESSION)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'INITIAL_SESSION') return; // handled by getSession above

        if (!mounted) return;

        if (session?.user) {
          // Defer DB call to let auth token propagate
          setTimeout(async () => {
            if (!mounted) return;
            const isAdmin = await checkAdminRole(session.user.id);
            if (mounted) {
              setState({ user: session.user, isAdmin, isLoading: false });
            }
          }, 0);
        } else {
          setState({ user: null, isAdmin: false, isLoading: false });
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [checkAdminRole]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return {
    ...state,
    signIn,
    signOut,
  };
};
