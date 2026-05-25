
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { Resend } from 'resend'
import { EmailTemplate } from '@/components/email-template';
import z from "zod"




const isDev = process.env.NODE_ENV === "development"
const resend = new Resend(process.env.RESEND_API_KEY)


export const sendEmailFn = createServerFn()
  .inputValidator(
    z.object({ email: z.string().email() })
  )
  .handler(async ({ data: { email } }) => {
    const url = new URL(getRequest().url)
    const host = isDev ? "http://localhost:3000" : url.origin
    const verifyUrl = `${host}/api/verify_email?address=${encodeURIComponent(email)}`;
    const { data: result, error } = await resend.emails.send({
      from: 'B-Fanel <no-reply@resend.dev>',
      to: email,
      subject: "Testing Email",
      react: EmailTemplate({ email, verifyUrl }),
    })
    console.log(result)
    if (error) {
      console.log(error)
    }
    return { success: true, id: result?.id }
  })