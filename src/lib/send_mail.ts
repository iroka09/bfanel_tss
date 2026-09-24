
import { createServerOnlyFn } from '@tanstack/react-start'
import nodemailer from 'nodemailer'
import z from "zod"


export const dataSchema = z.object({
  from: z.string(),
  to: z.string().email(),
  subject: z.string(),
  html: z.string().optional(),
  react: z.any().optional()
}).superRefine((data, ctx) => {
  if (!data.html && !data.react) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Either html or react must be provided',
      path: ['html'],
    })
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Either html or react must be provided',
      path: ['react'],
    })
  }
})


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD, // App Password, not your real password
  },
})


export const sendEmailFn = createServerOnlyFn(async ({ data }: { data: z.infer<typeof dataSchema> }) => {
  await dataSchema.parse(data)
  let html = data.html
  // if react component is passed, render it to HTML string
  if (!html) {
    const { renderToStaticMarkup } = await import('react-dom/server')
    html = renderToStaticMarkup(data.react)
  }
  const info = await transporter.sendMail({
    from: data.from,
    to: data.to,
    subject: data.subject,
    html,
  })
 // console.log(info.messageId)
  return { success: true, id: info.messageId }
})




/*
// This is prefered for production, although the upper one can be used too

import { createServerOnlyFn } from '@tanstack/react-start'
import { Resend } from 'resend'
import z from "zod"


export const dataSchema = z.object({
  from: z.string(),
  to: z.string().email(),
  subject: z.string(),
  html: z.string().optional(),
  react: z.any().optional()
}).superRefine((data, ctx) => {
  if (!data.html && !data.react) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Either html or react must be provided',
      path: ['html'],
    })
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Either html or react must be provided',
      path: ['react'],
    })
  }
})


const resend = new Resend(process.env.RESEND_API_KEY)


export const sendEmailFn = createServerOnlyFn(async ({ data }: { data: z.infer<typeof dataSchema> }) => {
  await dataSchema.parse(data)
  const { data: result, error } = await resend.emails.send({
    from: data.from,
    to: data.to,
    subject: data.subject,
    ...(data.html)
      ? { html: data.html }
      : { react: data.react }
  })
  console.log(result)
  if (error) throw error
  return { success: true, id: result?.id }
})*/