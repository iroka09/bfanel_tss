
import { createContext, useContext, useEffect, useState, useCallback, useLayoutEffect } from "react";
import type { ReactNode } from "react";
import { useRouter, redirect, useLocation } from "@tanstack/react-router";
import { loginFn, logoutFn, getSession } from "@/server/actions/session";
import type { SessionPayload, AuthResult, SignInInput } from "@/server/actions/session";





type SessionContextValue = {
  session: SessionPayload | null;
  isAuthenticated: boolean;
  signIn: (data: SignInInput, redirectTo?: string) => Promise<AuthResult>;
  signOut: (redirectTo?: string) => Promise<void>;
  blank: () => void
};

const SessionContext = createContext<SessionContextValue | null>(null);

type SessionInternalValue = {
  blank: () => void;
  unblank: () => void;
};

const SessionInternalContext = createContext<SessionInternalValue | null>(null);


type SessionProviderProps = {
  initialSession: SessionPayload | null;
  children: ReactNode;
};



export function SessionProvider({ initialSession, children }: SessionProviderProps) {
  const [session, setSession] = useState<SessionPayload | null>(initialSession);
  const [blanked, setBlanked] = useState(false);
  const router = useRouter();
  const pathname = useLocation({
    select: (location) => {
      return location.pathname
    }
  })

  const blank = useCallback(() => setBlanked(true), []);
  const unblank = useCallback(() => setBlanked(false), []);


  const signIn = useCallback(async (data: SignInInput, redirect = false): Promise<AuthResult> => {
    const result = await loginFn({ data });
    if (!result.success) {
      return { success: false };
    }
    setSession(result.session);
    if (redirect) await router.navigate({ to: pathname, replace: true });
    return { success: true };
  }, []);


  const signOut = useCallback(async (arg = { redirect: false }) => {
    const result = await logoutFn();
    // Clear client state before navigation
    if (result.success) {
      if (redirect) {
        router.navigate({ to: "/login", replace: true })
          .then(() => {
            setSession(null)
          })
      }
      else setSession(null)
    }
  }, []);

  useEffect(() => {
    console.log("sessionProvider=> ", session)
  }, [])

  return (
    <SessionInternalContext.Provider value={{ pathname, blank, unblank }}>
      <SessionContext.Provider value={{ session, isAuthenticated: session !== null, signIn, signOut }}>
        {blanked ? <div className="h-screen w-full"></div> : children}
      </SessionContext.Provider>
    </SessionInternalContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────

export function useSession(arg?: { redirect: boolean }) {
  const router = useRouter();
  const ctx = useContext(SessionContext);
  const internal = useContext(SessionInternalContext);
  if (!ctx || !internal) {
    throw new Error("useSession must be used within <SessionProvider>");
  }
  if (arg?.redirect && !ctx.isAuthenticated) {
    internal.blank()
  }
  useEffect(() => {
    // alert(internal.pathname)
  })
  useLayoutEffect(() => {
    if (arg?.redirect && !ctx.isAuthenticated) {
      router.navigate({
        to: "/login",
        replace: true,
        search: {
          redirect: arg.redirect ? internal.pathname : "/"
        }
      })
        .then(() => internal.unblank())
    }
  }, [])
  return ctx;
}