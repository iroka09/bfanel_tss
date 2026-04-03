import { createStart, createMiddleware } from '@tanstack/react-start'

const logger1 = createMiddleware().server(async ({ next, context }) => {
  console.log("Global request 1 " + Date().toLocaleString())
  let xx = await next({
    context: { student: "irokaooooo" }
  })
  return xx
})

const logger2 = createMiddleware().server(async ({ next, datass, request }) => {
  //  console.log("Data: ", datass.name)
  // console.log("req: ", request)
  return next()
})

export const startInstance = createStart(() => ({
  functionMiddleware: [logger1, logger2]
  // requestMiddleware: [logger1, logger2]
}))