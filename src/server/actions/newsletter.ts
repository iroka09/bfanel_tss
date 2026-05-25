
import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { db } from "@/db";
import { newsletter } from "@/db/schema";
import { eq } from "drizzle-orm";
import { sendEmailFn } from "@/lib/send_mail";
import { EmailTemplate } from '@/components/email-template';

// === submit email for newsletter ===


const zodSchema = z.object({
  email: z.string().email({ error: (issue) => issue.input ? issue.input + ' is a wrong email address.' : 'This field is required.' }).trim().lowercase()
})

interface SubmitEmailResponseType {
  success: boolean,
  result: string
}


const isDev = process.env.NODE_ENV === "development"

export const submitEmail = createServerFn({ method: 'POST' })
  .inputValidator(zodSchema)
  .handler(async ({ request, data }): Promise<SubmitEmailResponseType> => {
    try {
      async function sendMail(dbData, data) {
        const url = new URL(request.url)
        const host = isDev ? "http://localhost:3000" : url.origin
        const verifyUrl = `${host.replace(/\/+$/, "")}/api/verify_email?confirmation_token=${dbData.confirmationToken}`;
        let messageSent = true
        await sendEmailFn({
          data: {
            from: 'B-Fanel <no-reply@bfanel.info>',
            to: data.email,
            subject: "Email Confirmation",
            react: EmailTemplate({
              email: data.email,
              verifyUrl
            })
          }
        }).catch((e) => {
          messageSent = false
          console.log(e)
        })
        return messageSent
      }
      const [selectedEmail] = await db
        .select({
          email: newsletter.email,
          confirmationToken: newsletter.confirmationToken,
          isConfirmed: newsletter.isConfirmed
        })
        .from(newsletter)
        .where(eq(newsletter.email, data.email));
      console.log("selectedEmails: ", selectedEmail)
      if (selectedEmail) {
        //FOUND
        if (selectedEmail.isConfirmed)
          return { success: false, result: "Email already subscribed." }
        else {
          await sendMail(selectedEmail, data)
          return { success: false, result: "Email has been sent, you can go and verify it." }
        }
      }
      //NOT FOUND
      const [newSavedEmail] = await db
        .insert(newsletter)
        .values({ email: data.email })
        .returning();
      console.log("newSavedEmail: ", newSavedEmail)
      if (newSavedEmail) {
        //ADDED TO DB SUCCESSFULLY
        const sent = await sendMail(newSavedEmail, data)
        return {
          success: sent,
          result: sent
            ? `Email has been sent to ${data.email}, if you don't see it check SPAM folder.`
            : "It went successful but we couldn't send confirmation link to your email."
        }
      }
      return { success: false, result: 'Something went wrong.' }
    }
    catch (error) {
      console.error(error)
      return { success: false, result: ' Ooops! something went wrong.' }
    }
  })