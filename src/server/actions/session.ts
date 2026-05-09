import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import { useAppSession } from "@/server/server_only/use_session"
import * as z from "zod"




export type SessionPayload = {
  email: string,
  name: string,
  picture: string
}

export type AuthResult =
  | { success: false }
  | { success: true, session: SessionPayload }


export type SignInInput = {
  credentials?: {
    email: string;
    password: string
  },
  oneTapLogin?: SessionPayload
}


// Get current user
export const getSession = createServerFn({ method: 'GET' })
  .handler(async (): Promise<AuthResult | null> => {
    const session = await useAppSession()
    const data = session.data
    return Object.keys(data).length > 0 ? data : null
  })


// Login server function
export const loginFn = createServerFn({ method: 'POST' })
  .inputValidator((data: SignInInput) => data)
  .handler(async ({ data: _data }): Promise<AuthResult> | never => {
    const session = await useAppSession()
    if (_data.credentials) {
      const data = _data.credentials
      z.object({
        email: z.string().email(),
        password: z.string()
      }).parse(data)
      await session.update(data)
      return { success: true, session: await getSession() }
    }
    else if (_data.oneTapLogin) {
      const data = _data.oneTapLogin
      z.object({
        name: z.string(),
        email: z.string().email(),
        picture: z.string()
      }).parse(data)
      await session.update(data)
      return { success: true, session: await getSession() }
      // Redirect to protected area
      //throw redirect({ to: "/customer_care" })
    }
    else throw Error("data error")
  })



// Logout server function
export const logoutFn = createServerFn({ method: 'POST' })
  .inputValidator((data?: { to: string }) => data)
  .handler(async ({ data }): Promise<Omit<AuthResult, "session">> => {
    const session = await useAppSession()
    await session.clear()
    return { success: true }
  })
