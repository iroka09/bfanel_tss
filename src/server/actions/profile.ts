
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { getUser } from '@/server/actions/session'



const updateProfileSchema = z.object({
  username: z.string().max(50).nullable().optional(),
  bio: z.string().max(500).nullable().optional(),
  phone: z.string().max(20).nullable().optional(),
  location: z.string().max(100).nullable().optional(),
  website: z.string().nullable().optional(),
  gender: z.enum(["male", "female", "other"]).nullable().optional(),
  dateOfBirth: z.string().nullable().optional(),
  twitterHandle: z.string().max(50).nullable().optional(),
  githubHandle: z.string().max(50).nullable().optional(),
  linkedinHandle: z.string().max(50).nullable().optional(),
})


export const updateProfile = createServerFn({ method: 'POST' })
  .inputValidator(updateProfileInputType)
  .handler(async ({ data }) => {
    const user = await getUser()
    if (!user) throw new Error('Unauthorized')
    try {
      await db
        .update(users)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(users.userId, user.userId))
      return { success: true }
    }
    catch (err: unknown) {
      const msg = err instanceof Error ? err.message : ''
      if (msg.toLowerCase().includes('unique') || msg.toLowerCase().includes('duplicate')) {
        throw new Error('That username is already taken. Please choose another.')
      }
      throw new Error('Failed to update profile. Please try again.')
    }
  })