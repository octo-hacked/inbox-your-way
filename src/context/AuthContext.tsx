import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

// 1. Updated User type to match your API response
type User = {
  id: string;
  email: string;
  username: string;
  fullname: string;
  avatar?: string;
  coverImage?: string;
};

type AuthState = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
};

type AuthContextType = AuthState & {
  loading: boolean;
  signIn: (params: { email: string; password: string }) => Promise<void>;
  // Changed `name` to `fullname` to match your API
  signUp: (params: { email: string; password: string; fullname: string; username: string }) => Promise<void>;
  signOut: () => Promise<void>;
  // The refresh function is kept for future implementation
  // refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "unicast.auth.state.v1";

function loadFromStorage(): AuthState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { user: null, accessToken: null, refreshToken: null };
    const parsed = JSON.parse(raw);
    return {
      user: parsed.user ?? null,
      accessToken: parsed.accessToken ?? null,
      refreshToken: parsed.refreshToken ?? null,
    };
  } catch {
    return { user: null, accessToken: null, refreshToken: null };
  }
}

function saveToStorage(state: AuthState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const [state, setState] = useState<AuthState>(() => loadFromStorage());
  const [loading, setLoading] = useState(false);

  const persist = useCallback((next: AuthState) => {
    setState(next);
    saveToStorage(next);
  }, []);

  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      await axios.post(
        "http://localhost:3000/api/v1//users/logout",
        {},
        {
          withCredentials: true,
          headers: state.accessToken ? { Authorization: `Bearer ${state.accessToken}` } : undefined,
        }
      );
    } catch (error) {
      // Intentionally ignore API errors during logout; proceed with local sign-out
      console.error("Logout request failed:", error);
    } finally {
      persist({ user: null, accessToken: null, refreshToken: null });
      toast({ title: "Logged out", description: "You have been signed out." });
      setLoading(false);
    }
  }, [persist, state.accessToken, toast]);

  const signIn = useCallback(
    async ({ email, password }: { email: string; password: string }) => {
      setLoading(true);
      try {
        const res = await axios.post("http://localhost:3000/api/v1/users/login", { email, password }, { withCredentials: true } );

        if (res.data.success) {
          // 2. Destructure the response according to your API structure
          const { user, accessToken, refreshToken } = res.data.data;

          // Map API response to our User type
          const formattedUser: User = {
            id: user._id,
            email: user.email,
            username: user.username,
            fullname: user.fullname,
            avatar: user.avatar,
            coverImage: user.coverImage,
          };

          persist({ user: formattedUser, accessToken, refreshToken });
          toast({ title: "Login Successful", description: "Welcome back!" });
        }
      } catch (error: any) {
        console.error("Sign in failed:", error);
        toast({
          title: "Login Failed",
          description: error.response?.data?.message || "An unexpected error occurred.",
          variant: "destructive",
        });
        await signOut(); // Clear any partial state
      } finally {
        setLoading(false);
      }
    },
    [persist, signOut, toast]
  );

  const signUp = useCallback(
    async ({ email, password, fullname, username }: { email: string; password: string; fullname: string; username: string }) => {
      setLoading(true);
      try {
        const { generateAvatarFile } = await import("@/lib/avatar");
        const avatar = await generateAvatarFile(username || fullname);
        const form = new FormData();
        form.append("fullname", fullname);
        form.append("username", username);
        form.append("email", email);
        form.append("password", password);
        form.append("avatar", avatar);

        const res = await axios.post("http://localhost:3000/api/v1/users/register", form, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }, );

        if (res.data.success) {
          toast({ title: "Registration Successful", description: "Please log in to continue." });
          await signIn({ email, password });
        }
      } catch (error: any) {
        console.error("Sign up failed:", error);
        toast({
          title: "Registration Failed",
          description: error.response?.data?.message || "An unexpected error occurred.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [signIn, toast]
  );

  const value: AuthContextType = useMemo(
    () => ({
      ...state,
      loading,
      signIn,
      signUp,
      signOut,
    }),
    [state, loading, signIn, signUp, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
