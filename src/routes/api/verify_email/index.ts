import { createFileRoute } from '@tanstack/react-router'
import { db } from "@/db"
import { newsletter } from "@/db/schema"
import { eq } from "drizzle-orm"



export const Route = createFileRoute('/api/verify_email/')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url)
        const confirmationToken = url.searchParams.get('confirmation_token')
        if (!confirmationToken) {
          return new Response("Missing confirmation token", { status: 400 })
        }
        //CHECK IF ALREADY CONFIRMED
        const [selectedEmail] = await db
          .select({
            isConfirmed: newsletter.isConfirmed
          })
          .from(newsletter)
          .where(eq(newsletter.confirmationToken, confirmationToken));
        if (selectedEmail.isConfirmed) {
          return new Response("Already confirmed", { status: 404 })
        }
        //NOT CONFIRMED YET
        const [updated] = await db
          .update(newsletter)
          .set({ isConfirmed: true })
          .where(eq(newsletter.confirmationToken, confirmationToken))
          .returning()
        if (!updated) {
          return new Response("Invalid or expired token", { status: 404 })
        }
        if (updated.isConfirmed) {
          return Response.redirect(`${url.origin}/`, 302)
        }
        return new Response("Something went wrong", { status: 500 })
      }
    }
  }
})