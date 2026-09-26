import { createMiddleware } from '@tanstack/react-start'
import { useSession } from '@tanstack/react-start/server'

export type SessionData = {
  userId?: string
  email?: string
  role?: string
  image?: string
}

const isProduction = process.env.NODE_ENV === 'production'

function useSessionWrapper() {
  return useSession<SessionData>({
    name: 'app-session',
    password: process.env.SESSION_SECRET,
    // Optional
    cookie: {
      secure: isProduction,
      httpOnly: isProduction,
      sameSite: 'lax',
    },
  })
}

export const putSessionToContext = createMiddleware().server(
  async ({ next, context }) => {
    const session = await useSessionWrapper()
    return await next({
      context: { session },
    })
  },
)
