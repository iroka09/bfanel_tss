
import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { db } from "@/db";
import { newsletter } from "@/db/schema";
import { eq } from "drizzle-orm";


// === submit email for newsletter ===


const zodSchema = z.object({
  email: z.string().email({ error: (issue) => issue.input ? issue.input + ' is a wrong email address.' : 'This field is required.' }).trim().lowercase()
})

interface SubmitEmailResponseType {
  success: boolean,
  result: string
}

export const submitEmail = createServerFn({ method: 'POST' })
  .inputValidator((data: z.infer<typeof zodSchema>) => data)
  .handler(async ({ data: inputData }): Promise<SubmitEmailResponseType> => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const { success, data, ...res } = await zodSchema.safeParse(inputData)
      if (success === false) {
        return { success: false, result: res.error.issues[0].message }
      }
      const submittedEmails = await db
        .select({ email: newsletter.email })
        .from(newsletter)
        .where(eq(newsletter.email, data.email));
      if (submittedEmails.length > 0) {
        return { success: false, result: "Email already existed." }
      }
      const newSaved = await db
        .insert(newsletter)
        .values({
          email: data.email
        })
        .returning();
      if (newSaved.length > 0)
        return { success: true, result: 'You have subscribed successfully.' }
      else {
        console.log(newSaved)
        return { success: false, result: 'Something went wrong.' }
      }
    }
    catch (error) {
      console.error(error)
      return { success: false, result: ' Ooops! something went wrong.' }
    }
  })
//==========



