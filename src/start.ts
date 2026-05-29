import { createStart, createMiddleware } from '@tanstack/react-start'



const putDatasToContext = createMiddleware().server(async ({ next, request, context }) => {
  const url = new URL(request.url)
  console.log(url)
  const headers = Object.fromEntries(request.headers.entries())
  return await next({
    context: { url, headers }
  })
})


export const startInstance = createStart(() => ({
  requestMiddleware: [putDatasToContext], //serverFn also uses this too
}))