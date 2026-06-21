import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';

type Role = 'admin' | 'hospital' | 'donor' | null;

interface AuthState {
  session: Session | null;
  role: Role;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

/** Where the last-known role is cached so the admin shell opens offline. */
const roleKey = (userId: string) => `bcp_role_${userId}`;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Restore the role from localStorage synchronously. getSession() works
   * offline (the session is persisted locally), so a returning admin can open
   * the dashboard without a network round-trip.
   */
  function applyCachedRole(s: Session | null) {
    if (!s) {
      setRole(null);
      return;
    }
    const cached = localStorage.getItem(roleKey(s.user.id)) as Role | null;
    if (cached) setRole(cached);
  }

  /**
   * Refresh the role from the DB in the background. Never blocks loading and
   * never throws — when offline the request fails and we keep the cached role.
   */
  async function refreshRole(s: Session | null) {
    if (!s) return;
    try {
      const { data, error } = await supabase.from('profiles').select('role').eq('id', s.user.id).single();
      if (error || !data?.role) return; // offline / not found → keep cached role
      const next = data.role as Role;
      setRole(next);
      if (next) localStorage.setItem(roleKey(s.user.id), next);
    } catch {
      /* offline: keep whatever applyCachedRole restored */
    }
  }

  useEffect(() => {
    // getSession() reads the persisted session from localStorage — resolves
    // instantly even with no connection.
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      applyCachedRole(data.session); // sync, offline-safe
      setLoading(false); // don't wait on the network role lookup
      void refreshRole(data.session); // background revalidate
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      applyCachedRole(s);
      if (!s) {
        // signed out: clear any cached roles so the next admin re-verifies.
        Object.keys(localStorage)
          .filter((k) => k.startsWith('bcp_role_'))
          .forEach((k) => localStorage.removeItem(k));
      }
      void refreshRole(s);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <AuthContext.Provider value={{ session, role, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
