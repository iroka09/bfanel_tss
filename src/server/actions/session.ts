
import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import { useAppSession } from "@/server/server_only/use_session"
import z from "zod"
import { db } from "@/db";
import { users, type User } from "@/db/schema";
import { eq } from "drizzle-orm";



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


// ====  GET USER ======
export const getUser = createServerFn({ method: 'POST' })
  .inputValidator((data?: { email: string }) => data)
  .handler(async (arg): Promise<User> => {
    if (arg.data) {
      // get another person's profile
      z.string().email().parse(arg.data.email)
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
        .where(eq(users.email, arg.data.email))
      return user[0]
    }
    else {
      // get user's profile
      const session = await getSession()
      z.string().email().parse(session.email)
      const user = await db.select().from(users).where(eq(users.email, session.email))
      return user[0]
    }
  })



// ====  LOGIN ======
export const loginFn = createServerFn({ method: 'POST' })
  .inputValidator((data: SignInInput) => data)
  .handler(async ({ data: _data }): Promise<AuthResult> | never => {
    //console.log("test users: ", Object.keys(users))
    // console.log("test email: ", users.email)
    const session = await useAppSession()
    const getResult = async (data) => {
      const updatedSession = await session.update(data)
      return { success: true, session: updatedSession.data }
    }
    try {
      if (_data.credentials) {
        const data = z.object({
          email: z.string().email(),
          password: z.string()
        }).parse(_data.credentials)
        return await getResult(data)
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
          return await getResult(data)
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
        return await getResult(data)
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
  .handler(async ({ data }): Promise<Omit<AuthResult, "session">> => {
    const session = await useAppSession()
    await session.clear()
    return { success: true }
  })


//protect a route
export const ensureAuth = createServerFn({ method: 'POST' })
  .inputValidator((data?: { redirect: `/${string}` }) => data)
  .handler(async ({ data }): Promise<void | never> => {
    const session = await getSession()
    if (!session) throw redirect({ to: "/login", search: { redirect: data.redirect || "/" } })
  })
