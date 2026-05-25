
import { createServerFn } from '@tanstack/react-start'
import { redirect, isRedirect } from '@tanstack/react-router'
import { putSessionToContext, type SessionData } from "@/server/middlewares"
import z from "zod"
import { db } from "@/db";
import { users, type User } from "@/db/schema";
import { eq } from "drizzle-orm";



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



function emptyObjToNull(obj: SessionData): SessionData | null {
  return Object.keys(obj).length > 0
    ? obj
    : null
}


// Get current user
export const getSession = createServerFn({ method: 'GET' })
  .middleware([putSessionToContext])
  .handler(async ({ context }): Promise<SessionData | null> => {
    //  console.log("middleware: ", context)
    return emptyObjToNull(context.session.data)
  })


// ====  GET USER ======
export const getUser = createServerFn({ method: 'POST' })
  .inputValidator((data?: { email: string }) => data)
  .middleware([putSessionToContext])
  .handler(async ({ data, context }): Promise<User> => {
    if (data) {
      // get another person's profile
      z.string().email().parse(data.email)
      const user = await db
        .select({
          userId: users.userId,
          name: users.name,
          username: users.username,
          picture: users.picture,
          bio: users.bio,
          location: users.location,
          website: users.website,
          twitterHandle: users.twitterHandle,
          githubHandle: users.githubHandle,
          linkedinHandle: users.linkedinHandle,
          followersCount: users.followersCount,
          followingCount: users.followingCount,
          isVerified: users.isVerified,
          createdAt: users.createdAt,
        })
        .from(users)
        .where(eq(users.email, data.email))
      return user[0]
    }
    else {
      // get user's profile
      const sessionData = context.session.data
      z.string().email().parse(sessionData.email)
      const user = await db.select().from(users).where(eq(users.email, sessionData.email))
      return user[0]
    }
  })



// ====  LOGIN ======
export const loginFn = createServerFn({ method: 'POST' })
  .inputValidator((data: SignInInput) => data)
  .middleware([putSessionToContext])
  .handler(async ({ data: _data, context }): Promise<AuthResult> | never => {
    //console.log("test users: ", Object.keys(users))
    // console.log("test email: ", users.email)
    const session = context.session
    async function putToSessionAndReturnData(data) {
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
        return await putToSessionAndReturnData(data)
      }
      else if (_data.oneTapLogin) {
        const data = z.object({
          name: z.string(),
          email: z.string().email(),
          picture: z.string()
        })
          .strip() // but this is the default, it strips unknown fields from user
          .parse(_data.oneTapLogin)
        // get user by email
        const existingUser = await db
          .select()
          .from(users)
          .where(eq(users.email, data.email))
          .limit(1);
        // console.log("existingUser: ", existingUser)
        // If found, return the existing user instead of inserting
        if (existingUser.length > 0) {
          return await putToSessionAndReturnData(data)
        }
        // Email is new — insert the user
        const newUser = await db
          .insert(users)
          .values({
            name: data.name,
            email: data.email,
            picture: data.picture,
          })
          .returning();
        //console.log("newUser: ", newUser)
        return await putToSessionAndReturnData(data)
        // Redirect to protected area
        //throw redirect({ to: "/customer_care" })
      }
      else throw Error("data error")
    }
    catch (e) {
      console.log(e)
      throw Error(e)
    }
  })



// =====   LOGOUT ======
export const logoutFn = createServerFn({ method: 'POST' })
  .inputValidator((data?: { to: string }) => data)
  .middleware([putSessionToContext])
  .handler(async ({ data, context }) => {
    await context.session.clear()
    return { success: true }
  })


//protect a route
export const ensureSession = createServerFn({ method: 'POST' })
  .inputValidator((data?: { redirect: `/${string}` }) => data)
  .middleware([putSessionToContext])
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

