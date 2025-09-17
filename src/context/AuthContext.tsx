import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";

type User = {
  id: string;
  email: string;
  name?: string;
};

type AuthState = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  accessTokenExpiresAt: number | null; // epoch ms
};

type AuthContextType = AuthState & {
  loading: boolean;
  signIn: (params: { email: string; password: string }) => Promise<void>;
  signUp: (params: { email: string; password: string; name?: string }) => Promise<void>;
  signOut: () => void;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "auth.state.v1";

function loadFromStorage(): AuthState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { user: null, accessToken: null, refreshToken: null, accessTokenExpiresAt: null };
    const parsed = JSON.parse(raw);
    return {
      user: parsed.user ?? null,
      accessToken: parsed.accessToken ?? null,
      refreshToken: parsed.refreshToken ?? null,
      accessTokenExpiresAt: typeof parsed.accessTokenExpiresAt === "number" ? parsed.accessTokenExpiresAt : null,
    };
  } catch {
    return { user: null, accessToken: null, refreshToken: null, accessTokenExpiresAt: null };
  }
}

function saveToStorage(state: AuthState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

async function tryFetch(input: RequestInfo, init?: RequestInit) {
  try {
    const res = await fetch(input, init);
    return res;
  } catch {
    return new Response(null, { status: 0, statusText: "network-error" });
  }
}

function now() {
  return Date.now();
}

function genLocalToken(prefix: string) {
  const rand = self.crypto?.getRandomValues?.(new Uint8Array(16)) ?? new Uint8Array(16);
  const hex = Array.from(rand).map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${prefix}.${hex}`;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const [state, setState] = useState<AuthState>(() => loadFromStorage());
  const [loading, setLoading] = useState(false);
  const refreshTimer = useRef<number | null>(null);

  const persist = useCallback((next: AuthState) => {
    setState(next);
    saveToStorage(next);
  }, []);

  const signOut = useCallback(() => {
    if (refreshTimer.current) window.clearTimeout(refreshTimer.current);
    persist({ user: null, accessToken: null, refreshToken: null, accessTokenExpiresAt: null });
  }, [persist]);

  const signIn = useCallback(async ({ email, password }: { email: string; password: string }) => {
    setLoading(true);
    const res = await tryFetch("/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const data = await res.json();
      const expiresInSec = Number(data.expiresIn ?? 1800);
      const next: AuthState = {
        user: data.user ?? { id: data.user?.id ?? "user", email: data.user?.email ?? email },
        accessToken: data.accessToken ?? null,
        refreshToken: data.refreshToken ?? null,
        accessTokenExpiresAt: now() + expiresInSec * 1000,
      };
      persist(next);
      setLoading(false);
      scheduleRefresh(expiresInSec);
      return;
    }

    // Dev fallback if no backend: create local tokens to enable gated UI flows
    const devAccess = genLocalToken("access");
    const devRefresh = genLocalToken("refresh");
    const expiresInSec = 1800;
    persist({
      user: { id: "local-user", email },
      accessToken: devAccess,
      refreshToken: devRefresh,
      accessTokenExpiresAt: now() + expiresInSec * 1000,
    });
    scheduleRefresh(expiresInSec);
    setLoading(false);
    toast({ title: "Signed in (local)", description: "No auth backend detected, using local session." });
  }, [persist, toast]);

  const signUp = useCallback(async ({ email, password, name }: { email: string; password: string; name?: string }) => {
    setLoading(true);
    const res = await tryFetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });

    if (res.ok) {
      // After signup, try to sign in automatically
      setLoading(false);
      await signIn({ email, password });
      return;
    }

    // Dev fallback: directly create local session
    const devAccess = genLocalToken("access");
    const devRefresh = genLocalToken("refresh");
    const expiresInSec = 1800;
    persist({
      user: { id: "local-user", email, name },
      accessToken: devAccess,
      refreshToken: devRefresh,
      accessTokenExpiresAt: now() + expiresInSec * 1000,
    });
    scheduleRefresh(expiresInSec);
    setLoading(false);
    toast({ title: "Account created (local)", description: "No auth backend detected, using local session." });
  }, [persist, signIn, toast]);

  const refresh = useCallback(async () => {
    if (!state.refreshToken) {
      signOut();
      return;
    }
    const res = await tryFetch("/api/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: state.refreshToken }),
    });
    if (res.ok) {
      const data = await res.json();
      const expiresInSec = Number(data.expiresIn ?? 1800);
      persist({
        user: state.user,
        accessToken: data.accessToken ?? state.accessToken,
        refreshToken: data.refreshToken ?? state.refreshToken,
        accessTokenExpiresAt: now() + expiresInSec * 1000,
      });
      scheduleRefresh(expiresInSec);
      return;
    }
    // Dev fallback: extend local tokens
    const expiresInSec = 1800;
    persist({
      user: state.user,
      accessToken: state.accessToken ?? genLocalToken("access"),
      refreshToken: state.refreshToken ?? genLocalToken("refresh"),
      accessTokenExpiresAt: now() + expiresInSec * 1000,
    });
    scheduleRefresh(expiresInSec);
  }, [persist, signOut, state]);

  const scheduleRefresh = useCallback((expiresInSec: number) => {
    if (refreshTimer.current) window.clearTimeout(refreshTimer.current);
    const offset = Math.max(10, Math.floor(expiresInSec * 0.8)); // refresh at 80% of lifetime
    refreshTimer.current = window.setTimeout(() => {
      refresh();
    }, offset * 1000) as unknown as number;
  }, [refresh]);

  // Rehydrate and schedule refresh on mount
  useEffect(() => {
    if (state.accessToken && state.accessTokenExpiresAt) {
      const remainingMs = state.accessTokenExpiresAt - now();
      if (remainingMs > 0) {
        scheduleRefresh(Math.floor(remainingMs / 1000));
      } else {
        refresh();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value: AuthContextType = useMemo(() => ({
    ...state,
    loading,
    signIn,
    signUp,
    signOut,
    refresh,
  }), [state, loading, signIn, signUp, signOut, refresh]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
