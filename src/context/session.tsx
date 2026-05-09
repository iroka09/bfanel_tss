

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { useRouter } from "@tanstack/react-router";
import { loginFn, logoutFn, getSession } from "@/server/actions/session";
import type { SessionPayload, AuthResult, SignInInput } from "@/server/actions/session";

// ─── Types ────────────────────────────────────────────────────────




type SessionContextValue = {
  session: SessionPayload | null;
  isAuthenticated: boolean;
  signIn: (data: SignInInput, redirectTo?: string) => Promise<AuthResult>;
  signOut: (redirectTo?: string) => Promise<void>;
};

// ─── Context ──────────────────────────────────────────────────────

const SessionContext = createContext<SessionContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────

type SessionProviderProps = {
  // Comes from __root's beforeLoad/loader — already resolved on server,
  // so there's zero loading state on mount
  initialSession: SessionPayload | null;
  children: ReactNode;
};



export function SessionProvider({ initialSession, children }: SessionProviderProps) {
  const [session, setSession] = useState<SessionPayload | null>(initialSession);
  const router = useRouter();

  const signIn = useCallback(async (data: SignInInput, redirectTo?: string): Promise<AuthResult> => {
    const result = await loginFn({ data });
    if (!result.success) {
      return { success: false };
    }
    // Update client state immediately — no extra round trip needed
    setSession(result.session);
    if (redirectTo) await router.navigate({ to: redirectTo, replace: true });
    return { success: true };
  }, [router]);


  const signOut = useCallback(async (redirectTo?: string) => {
    const result = await logoutFn();
    // Clear client state before navigation
    if (result.success) {
      setSession(null);
      if (redirectTo) await router.navigate({ to: redirectTo, replace: true });
    }
  }, [router]);

  useEffect(() => {
    console.log("sessionProvider=> ", session)
    alert(JSON.stringify(session))
  }, [])

  return (
    <SessionContext.Provider value={{ session, isAuthenticated: session !== null, signIn, signOut }}>
      {children}
    </SessionContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error("useSession must be used within <SessionProvider>");
  }
  return ctx;
}