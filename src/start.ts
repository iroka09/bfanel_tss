import { createStart, createMiddleware } from '@tanstack/react-start'



const putUrlToContext = createMiddleware().server(async ({ next, request, context }) => {
  const url = new URL(request.url)
  return await next({
    context: { url }
  })
})


export const startInstance = createStart(() => ({
  requestMiddleware: [putUrlToContext], //serverFn also uses this too
}))