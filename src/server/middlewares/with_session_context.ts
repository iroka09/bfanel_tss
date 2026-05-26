
import { createMiddleware } from '@tanstack/react-start'
import { useSession } from '@tanstack/react-start/server'


export type SessionData = {
  userId?: string,
  email?: string,
  role?: string,
  image?: string
}

function useSessionWrapper() {
  return useSession<SessionData>({
    name: 'app-session',
    password: process.env.SESSION_SECRET,
    // Optional
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      httpOnly: process.env.NODE_ENV === 'production',
    },
  })
}


export const putSessionToContext = createMiddleware().server(async ({ next, context }) => {
  console.log("putSessionToContext: ", context)
  const session = await useSessionWrapper()
  return await next({
    context: { session }
  })
})