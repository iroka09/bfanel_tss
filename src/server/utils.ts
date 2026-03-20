
import { createServerFn, createMiddleware } from "@tanstack/react-start"



const authMiddleware = createMiddleware()
  .server(async ({ request, next }) => {
    console.log('Running on server')
    return next()
  })
  .client(async ({ next }) => {
    alert('Running on client')
    return next()
  })



export const getInfo = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(async (data) => {
    console.log(data)
    return data
  })
  .handler(async ({ data }) => {
    //  console.log("server ooooo")
    return {
      ...data,
      from: "server"
    }
  })
