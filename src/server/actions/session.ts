import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import { useAppSession } from "@/server/server_only/use_session"



// Login server function
export const loginFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { email: string; password: string }) => data)
  .handler(async ({ data }) => {
    // Verify credentials (replace with your auth logic)
    // Create session
    const session = await useAppSession()
    await session.update({
      userId: Math.random(),
      email: data.email,
    })
    return { success: true }
    // Redirect to protected area
    //throw redirect({ to: "/customer_care" })
  })



// Logout server function
export const logoutFn = createServerFn({ method: 'POST' })
  .inputValidator((data?: { to: string }) => data)
  .handler(async ({ data }) => {
    const session = await useAppSession()
    await session.clear()
  })



// Get current user
export const getSession = createServerFn({ method: 'GET' }).handler(
  async () => {
    const session = await useAppSession()
    const data = session.data
    return Object.keys(data).length > 0 ? data : null
  },
)