
import { createServerFn } from "@tanstack/react-start";
import * as z from "zod";


// === submit email for newsletter ===
interface SubmitEmailResponseType {
  success: boolean,
  result: string
}

const zodSchema = z.object({
  email: z.string().email({
    error: (issue) => {
      return issue.input ? issue.input + ' is a wrong email address.' : 'This field is required.'
    }
  }).trim().lowercase()
})

const submittedEmails: string[] = []
export const submitEmail = createServerFn({ method: 'POST' })
  .inputValidator((data: z.infer<typeof zodSchema>) => data)
  .handler(async ({ data: _data }): Promise<SubmitEmailResponseType> => {
    console.log(_data)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const { success, data, ...res } = await zodSchema.safeParse(_data)
      console.log(res)
      if (success === false) {
        return { success: false, result: res.error.issues[0].message }
      }
      if (submittedEmails.includes(data.email)) {
        return { success: false, result: "Email already existed." }
      }
      submittedEmails.push(data.email)
      return { success: true, result: 'You have subscribed successfully.' }
    }
    catch (error) {
      console.error(error)
      return { success: false, result: ' Ooops! something went wrong.' }
    }
  })
//==========



