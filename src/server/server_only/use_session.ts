
import { useSession } from '@tanstack/react-start/server'


type SessionData = {
  userId?: string,
  email?: string,
  role?: string,
  image?: string
}



export function useAppSession() {
  return useSession<SessionData>({
    // Session configuration
    name: 'app-session',
    password: process.env.SESSION_SECRET || "c3f7a9e1b5d2c8f4a6e0b1d9c7a3f5e8b2c4d6a1f9e0c3b7d8a2e5f1c6b9a4", // At least 32 characters
    // Optional: customize cookie settings
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      httpOnly: process.env.NODE_ENV === 'production',
    },
  })
}