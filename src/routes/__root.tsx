
//import { ReactNode } from "react";
import { HeadContent, Scripts, Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import type { QueryClient } from '@tanstack/react-query'
import TanStackQueryProvider from '@/integrations/tanstack-query/root-provider'
import TanStackQueryDevtools from '@/integrations/tanstack-query/devtools'
import Header from '@/components/Header'
import Events from "@/components/Events"
import { MdInfo } from "react-icons/md";
import GoogleLogin from "@/components/GoogleLogin"
//css
import globalCss from '@/globals.css?url'
import { root_metadatas } from './-root_metadatas'
import swiperCss from "swiper/css?url"
import swiperCssPagination from "swiper/css/pagination?url"
import swipeeCssNavigation from "swiper/css/navigation?url"
import swiperCssEffectCoverflow from "swiper/css/effect-coverflow?url"
// import swiperCssEffectCube from  "swiper/css/effect-cube?url"




const isDev = process.env.NODE_ENV === "development"



interface MyRouterContext {
  queryClient: QueryClient
}


export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: async () => await root_metadatas(),
  component: RootDocument,
})



function RootDocument() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="font-sans p-0 m-0 dark:bg-slate-900 dark:text-white/90 ">
        <TanStackQueryProvider>
          <div className="flex gap-3 w-fit max-w-[80%] my-2 mx-auto rounded-md border border-red-500 text-red-500 p-3 text-sm font-bold skeleton-wave">
            <MdInfo className="rotate-180 text-3xl" />
            <span>This is not the official BFanel website, it's just the sample.</span>
          </div>
          <Header />
          <Outlet />
          <Events />
          {typeof window && <GoogleLogin />}
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
        </TanStackQueryProvider>
        <Scripts />
      </body>
    </html>
  )
}
