
import { createContext, useContext, useState, useCallback, useLayoutEffect } from "react";
import type { ReactNode } from "react";
import { useRouter, redirect, useLocation } from "@tanstack/react-router";
import { loginFn, logoutFn, getSession } from "@/server/actions/session";
import type { SessionPayload, AuthResult, SignInInput } from "@/server/actions/session";



type SessionContextValue = {
  session: SessionPayload | null;
  isAuthenticated: boolean;
};


const SessionContext = createContext<SessionContextValue | null>(null);


type SessionProviderProps = {
  initialSession: SessionPayload | null;
  children: ReactNode;
};


export let signIn = (data: SignInInput, redirect = false): Promise<AuthResult> | null => null;
export let signOut = (arg: { redirect: false }): Promise<void> => null;
let blank = () => null
let unblank = () => null


export function SessionProvider({ initialSession, children }: SessionProviderProps) {
  const [session, setSession] = useState<SessionPayload | null>(initialSession);
  const [blanked, setBlanked] = useState(false);
  const router = useRouter();
  const pathname = useLocation({ select: loc => loc.pathname })
  const _signIn = useCallback(async (data: SignInInput, redirect = false): Promise<AuthResult> => {
    try {
      const result = await loginFn({ data });
      if (!result.success) {
        return { success: false };
      }
      setSession(result.session);
      if (redirect) await router.navigate({ to: pathname, replace: true });
      return { success: true };
    } catch (e) {
      console.error(e)
      return { success: false };
    }
  }, []);
  const _signOut = useCallback(async (): Promise<boolean> => {
    try {
      const result = await logoutFn();
      if (result.success) {
        if (redirect)
          router.navigate({ to: "/login", replace: true })
            .then(() => {
              setSession(null)
            })
        else setSession(null)
        return true
      }
      return false
    } catch (e) {
      console.error(e)
      return false
    }
  }, []);
  const refresh = useCallback(async (): Promise<boolean> => {
    try {
      const session = await getSession();
      setSession(session)
      return true
    } catch (e) {
      console.error(e)
      return false
    }
  }, []);
  useLayoutEffect(() => {
    signIn = _signIn;
    signOut = _signOut;
    blank = () => setBlanked(true)
    unblank = () => setBlanked(false)
  }, [])
  return (
    <SessionContext.Provider value={{ session, isAuthenticated: session !== null, refresh }}>
      {blanked ? <div className="h-screen w-full"></div> : children}
    </SessionContext.Provider>
  );
}


export function useAppSession(arg = { redirect: false }) {
  const router = useRouter();
  const pathname = useLocation({ select: loc => loc.pathname })
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useAppSession must be used within <SessionProvider>");
  if (arg?.redirect && !ctx.isAuthenticated) blank();
  useLayoutEffect(() => {
    if (arg?.redirect && !ctx.isAuthenticated)
      router.navigate({
        to: "/login",
        replace: true,
        search: {
          redirect: arg.redirect ? pathname : "/"
        }
      })
        .then(() => unblank())
  }, [])
  return ctx;
}