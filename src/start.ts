import { createStart, createMiddleware } from '@tanstack/react-start'

const funcLogger = createMiddleware().server(async ({ next, data, context }) => {
 // console.log('from funcLogger middleware: ', data)
  let xx = await next({
    context: { type2: "functionMiddleware" }
  })
  return xx
})

const reqLogger = createMiddleware().server(async ({ next, data, request }) => {
  let xx = await next({
    context: { type: "requestMiddleware" }
  })
  // console.log("reqLogger data: ", data)
  return xx
})

export const startInstance = createStart(() => ({
  functionMiddleware: [funcLogger],
  requestMiddleware: [reqLogger]
}))