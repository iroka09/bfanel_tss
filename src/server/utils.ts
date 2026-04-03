
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

const authMiddleware = createMiddleware({type:"function"})
  .client(async ({ next, ...others }) => {
    // console.log("client before: ", others)
    let result = await next({ sendContext: { from: ".client sendContext" } })
    // alert(others.sendData.env)
    console.log("client after: ", result)
    return result
  })
  .server(async ({ next, ...others }) => {
    console.log('middleware data: ', new URL(others.request.headers.get("referer")).pathname)
    console.log('authMiddleware context: ', others.context)
    console.log('authMiddleware sendContext: ', others.sendContext)
    return next({
      sendContext: {
        from: "server sendContext"
      },
      context: {
        auth: "server context"
      }
    })
    // return next({ sendContext: { value: ".server" } })
  })

const loggerMiddleware = createMiddleware()
  .server(async ({ next, ...others }) => {
    console.log('loggerMiddleware context: ', others.context)
    console.log('loggerMiddleware sendContext: ', others.sendContext)
    return next()
    // return next({ sendContext: { value: ".server" } })
  })



export const getInfo = createServerFn({ type: "function", method: "POST" })
  // .middleware([authMiddleware, loggerMiddleware])
  .inputValidator(async data => {
    return data
  })
  .handler(async (arg) => {
    try {
      const schema = z.object({
        msg: z.string("name must be a text"),
        age: z.number()
      })
      let res = await schema.safeParse(arg.data)
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
