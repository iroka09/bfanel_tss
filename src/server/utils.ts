
import { createServerFn, createMiddleware } from "@tanstack/react-start"
// import { useSession } from '@tanstack/react-start/server'
import * as yup from "yup"



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

let n = 0

const authMiddleware = createMiddleware()
  .client(async ({ next, ...others }) => {
    console.log("client before: ", others)
    //let result = await next({ context: { name: "client" } })
    let result = await next({ sendContext: { value: ".client" } })
    // alert(others.sendData.env)
    console.log("client after: ", others)
    return result
  })
  .server(async ({ next, ...others }) => {
    console.log('.server: ', others.context)
    return next({ sendContext: { value: ".server" } })
  })



export const getInfo = createServerFn({ type: "function", method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(async (data) => {
    const schema = yup.object({
      name: yup.string("name must be a text"),
      age: yup.number("age must be number").required()
    })
    try {
      let res = await schema.validate(data, { strict: true, abortEarly: false })
      return res
    }
    catch (e) {
      //console.log(e instanceof yup.ValidationError)
      console.log(JSON.stringify(e, null, 2))
      data.error = e.errors.join(" || ")
      return { error: data.error, inputValidator: "inputValidator" }
    }
  })
  .handler(async (x) => {
    console.log("handler: ", x.data)
    return {
      ...x.data,
      from: "server"
    }
  })
