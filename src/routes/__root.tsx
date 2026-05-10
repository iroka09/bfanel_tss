
import type { ReactNode, PropsWithChildren } from "react";
import { HeadContent, Scripts, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import type { QueryClient } from '@tanstack/react-query'
import TanStackQueryProvider from '@/integrations/tanstack-query/root-provider'
import TanStackQueryDevtools from '@/integrations/tanstack-query/devtools'
import Header from '@/components/Header'
import Events from "@/components/Events"
import { MdInfo } from "react-icons/md";
import GoogleLogin from "@/components/GoogleLogin"
import Footer from "@/components/Footer"
import { Toaster } from "@/components/ui/sonner"
import { root_metadatas } from '@/utils/root_metadatas.ts'
import { getSession } from '@/server/actions/session'
import { SessionProvider } from '@/context/session'
import { GoogleOAuthProvider } from '@react-oauth/google';



const isDev = process.env.NODE_ENV === "development"



interface MyRouterContext {
  queryClient: QueryClient
}


export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: async () => await root_metadatas(),
  beforeLoad: async () => {
    const session = await getSession();
    return { session };
  },
  shellComponent: RootDocument,
})



function RootDocument({ children }: PropsWithChildren): ReactNode {
  const { session } = Route.useRouteContext();
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="nice-font2 tet-xl p-0 m-0 dark:bg-neutral-950 dark:text-white/80 ">
        <SessionProvider initialSession={session || null}>
          <GoogleOAuthProvider clientId='910193991072-542kbb03f4b1o8th2k2bui06u8eh9jng.apps.googleusercontent.com'>
            <TanStackQueryProvider>
              <GoogleLogin />
              {/*
              <div className="flex gap-3 w-fit max-w-[80%] my-2 mx-auto rounded-md border border-red-500 text-red-500 p-3 text-sm font-bold skeleton-wave">
                <MdInfo className="rotate-180 text-3xl" />
                <span>This is not the official BFanel website.</span>
              </div>
              */
              }
              <Header />
              {children}
              <Footer />
              <Events />
              <Toaster />
              <DevTools />
            </TanStackQueryProvider>
          </GoogleOAuthProvider>
        </SessionProvider>
        <Scripts />
      </body>
    </html>
  )
}


function DevTools() {
  return (
    <TanStackDevtools
      config={{
        position: 'bottom-right',
      }}
      plugins={[
        {
          name: 'Tanstack Router',
          render: <TanStackRouterDevtoolsPanel />,
        },
        TanStackQueryDevtools,
      ]}
    />
  )
}