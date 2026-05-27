import { createFileRoute } from '@tanstack/react-router'
import { db } from "@/db"
import { newsletter } from "@/db/schema"
import { eq } from "drizzle-orm"



export const Route = createFileRoute('/api/verify_email')({
  server: {
    handlers: {
      GET: async ({ context: { url } }) => {  // { context, request, params, pathname, next }
        const confirmationToken = url.searchParams.get('confirmation_token')
        if (!confirmationToken) {
          return new Response("Missing confirmation token", { status: 400 })
        }
        //CHECK IF ALREADY CONFIRMED from db
        const [selectedEmail] = await db
          .select({
            isConfirmed: newsletter.isConfirmed
          })
          .from(newsletter)
          .where(eq(newsletter.confirmationToken, confirmationToken));
        //CONFIRMED, return success
        if (selectedEmail.isConfirmed) {
          return new Response(
            getHTML("Already Confirmed"),
            {
              status: 404,
              headers: {
                "Content-Type": "text/html",
              },
            }
          );
        }
        //NOT CONFIRMED YET, then confirm it
        const [updated] = await db
          .update(newsletter)
          .set({ isConfirmed: true })
          .where(eq(newsletter.confirmationToken, confirmationToken))
          .returning()
        if (!updated) {
          return new Response("Invalid or expired token", { status: 404 })
        }
        return Response.redirect(`${url.origin}/`, 302)
      }
    }
  }
})


function getHTML(heroText, buttonHref = "/", buttonTitle = "Go to Homepage") {
  return (`
    <!DOCTYPE html>
    <html lang="en">
      <body style="font-family: sans-serif; display: flex; flex-direction: column; align-items: center; padding-top: 50px;">
        <h2 style="color: #333; font-size: 30px">${heroText}</h2>
        <a href="${buttonHref}" style="margin-top: 1rem; padding: 0.6rem 1.4rem; background-color: #f97316; color: white; text-decoration: none; border-radius: 6px;">
        ${buttonTitle}
        </a>
      </body>
    </html> `)
}