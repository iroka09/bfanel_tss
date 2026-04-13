
import { createServerFn, createMiddleware } from "@tanstack/react-start"
import other, { getCookie, setCookie } from '@tanstack/react-start/server'
import * as z from "zod"
//import { redirect } from "@tanstack/react-router"
// import { useSession } from '@tanstack/react-start/server'

console.log(other)

type SessionData = {
  userId?: string
  email?: string
  role?: string
}


/*
export function useAppSession() {
  return useSession<SessionData>({
    // Session configuration
    name: 'app-session',
    password: process.env.SESSION_SECRET || "dghbfyhhrenklyddrykvdegjkkhdxgjurwfjkjgthkktdgh", // At least 32 characters
    // Optional: customize cookie settings
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      httpOnly: true,
    },
  })
}
*/

const authMiddleware = createMiddleware({ type: "function" })
  .client(async ({ next, ...others }) => {
    // console.log("client before: ", others)
    let result = await next({ sendContext: { from: ".client sendContext" } })
    console.log("client after: ", result.context)
    return result
  })
  .server(async ({ next, ...others }) => {
    console.log('authMiddleware context before: ', others.context)
    const result = await next({
      sendContext: {
        from: "server sendContext"
      },
      context: {
        auth: "server context"
      }
    })
    console.log('authMiddleware context after: ', result.context)
    return result
  })

const loggerMiddleware = createMiddleware()
  .server(async ({ next, ...others }) => {
    return next()
    // return next({ sendContext: { value: ".server" } })
  })



export const getInfo = createServerFn({ method: "POST" })
  //.middleware([authMiddleware, loggerMiddleware])
  .inputValidator(z.object({
    msg: z.string("name must be a text"),
    age: z.coerce.number().max(5),
    student: z.boolean()
  }))
  .handler(async ({ data, request }) => {
    throw Error("error oooo")
    // const cookies = parseCookies()
    console.log("==handler begins==")
    console.log("data: ", data)
    if (data.msg === "loader") setCookie("msg", "loader o")
    else console.log("cookie: ", getCookie("msg"))
    return {
      val: Math.random(),
      ...data
    }
  })
