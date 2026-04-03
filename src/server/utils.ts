
import { createServerFn, createMiddleware } from "@tanstack/react-start"
import * as z from "zod"
//import { redirect } from "@tanstack/react-router"
// import { useSession } from '@tanstack/react-start/server'



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



export const getInfo = createServerFn({ type: "function", method: "POST" })
  .middleware([authMiddleware, loggerMiddleware])
  .inputValidator(async data => {
    return data
  })
  .handler(async (arg) => {
    console.log("==handler begins==")
    try {
      await fetch("http://localhost:3000/api/user/7070", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-json-data": JSON.stringify({
            occupation: "engineering",
            gender: "male"
          })
        },
        body: JSON.stringify({
          occupation: "engineering",
          gender: "male"
        })
      }).catch(() => console.log("FETCH DIDNT WORK"))
      console.log("==handler fetch ends==")
      const schema = z.object({
        msg: z.string("name must be a text"),
        age: z.coerce.number().optional()
      })
      let res = schema.parse(arg.data)
      console.log(res)
      return {
        res,
        from: "server",
        val: Math.random()
      }
    }
    catch (e) {
      console.log(e)
      return "Something went wrong"
    }
  })
