
import TanStackQueryProvider from '@/integrations/tanstack-query/root-provider'
import { SessionProvider } from '@/context/session'
import { GoogleOAuthProvider } from '@react-oauth/google';



export default function Providers({ initialSession, children }) {
  return (
    <SessionProvider initialSession={initialSession}>
      <GoogleOAuthProvider clientId='910193991072-542kbb03f4b1o8th2k2bui06u8eh9jng.apps.googleusercontent.com'>
        <TanStackQueryProvider>
          {children}
        </TanStackQueryProvider>
      </GoogleOAuthProvider>
    </SessionProvider>
  )
}