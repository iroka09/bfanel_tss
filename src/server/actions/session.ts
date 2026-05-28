
import { redirect, isRedirect } from '@tanstack/react-router'
import z from "zod"
import { db } from "@/db";
import { putSessionToContext, type SessionData } from "@/server/middlewares/with_session_context";
import { users, type User } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createServerFn, createMiddleware } from '@tanstack/react-start'


export type SessionOneTapLoginDatata = {
  email: string,
  name: string,
  picture: string
}

export type AuthResult =
  | { success: false }
  | { success: true, session: SessionData }


export type SignInInput = {
  credentials?: {
    email: string;
    password: string
  },
  oneTapLogin?: SessionOneTapLoginDatata
}





const createServerFnWithGET = createServerFn({ method: 'GET' }).middleware([putSessionToContext])

const createServerFnWithPOST = createServerFn({ method: 'POST' }).middleware([putSessionToContext])



function emptyObjToNull(obj: SessionData): SessionData | null {
  return Object.keys(obj || {}).length > 0
    ? obj
    : null
}


// Get current user
export const getSession = createServerFnWithGET
  .handler(async ({ context }): Promise<SessionData | null> => {
    return emptyObjToNull(context.session?.data)
  })


// ====  GET USER ======
export const getUser = createServerFnWithPOST
  .inputValidator((data?: { email: string }) => data)
  .handler(async ({ data, context }): Promise<User> => {
    if (data) {
      // get another person's profile
      z.string().email().parse(data.email)
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, data.email))
      return user
    }
    else {
      // get user's profile
      const sessionData = context.session.data
      z.string().email().parse(sessionData.email)
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, sessionData.email))
      return user
    }
  })



// ====  LOGIN ======
export const loginFn = createServerFnWithPOST
  .inputValidator((data: SignInInput) => data)
  .handler(async ({ data: _data, context }): Promise<AuthResult> | never => {
    async function updateSessionAndReturnData(data) {
      const session = context.session
      const updatedSession = await session.update(data)
      return { success: true, session: updatedSession.data }
    }
    try {
      if (_data.credentials) {
        const data = z.object({
          email: z.string().email(),
          password: z.string()
        })
          .parse(_data.credentials)
        return await updateSessionAndReturnData(data)
      }
      else if (_data.oneTapLogin) {
        const data = z.object({
          userId: z.string(),
          name: z.string(),
          email: z.string().email(),
          picture: z.string(),
          isVerified: z.literal(true),
        }).strip() //(default), it strips unknown fields
          .parse(_data.oneTapLogin)
        // get user by email
        const [existingUser] = await db
          .select({
            userId: users.userId,
            name: users.name,
            email: users.email,
            picture: users.picture,
            isVerified: users.isVerified,
          })
          .from(users)
          .where(eq(users.email, data.email))
          .limit(1);
        // If found, return the existing user instead of inserting
        if (existingUser) {
          return await updateSessionAndReturnData(existingUser)
        }
        // Email is new — insert the user
        const [newUser] = await db
          .insert(users)
          .values({
            userId: data.sub,
            name: data.name,
            email: data.email,
            picture: data.picture,
            isVerified: true,
          })
          .returning();
        return await updateSessionAndReturnData(newUser)
      }
      else throw Error("data error")
    }
    catch (e) {
      console.log(e)
      throw Error(e)
    }
  })



// =====   LOGOUT ======
export const logoutFn = createServerFnWithPOST
  .inputValidator((data?: { to: string }) => data)
  .handler(async ({ data, context }) => {
    await context.session.clear()
    return { success: true }
  })


//protect a route
export const ensureSession = createServerFnWithPOST
  .inputValidator((data?: { redirect: `/${string}` }) => data)
  .handler(async ({ data, context }): Promise<void | never> => {
    try {
      const sessionData = emptyObjToNull(context.session.data)
      if (!sessionData) throw redirect({ to: "/login", search: { redirect: data.redirect || "/" } })
    }
    catch (err) {
      if (isRedirect(err)) throw err
      console.log(err)
      throw err
    }
  })