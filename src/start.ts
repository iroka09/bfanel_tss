import {
  createStart,
  createMiddleware,
  createCsrfMiddleware,
} from '@tanstack/react-start'

const csrf = createCsrfMiddleware({
  filter: ({ request, pathname, handlerType, context, next }) => {
    //  console.log(pathname + '=>' + handlerType)
    return false// handlerType === 'serverFn'
    
  },
})

const putDatasToContext = createMiddleware().server(
  async ({ next, request, context }) => {
    const url = new URL(request.url)
   // console.log('>>', context)
    const headers = Object.fromEntries(request.headers.entries())
    return await next({
      context: { url, headers },
    })
  },
)

export const startInstance = createStart(() => ({
  requestMiddleware: [csrf, putDatasToContext], //serverFn also uses this too
}))
