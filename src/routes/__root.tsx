
import type { ReactNode, PropsWithChildren } from "react";
import { HeadContent, Scripts, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import type { QueryClient } from '@tanstack/react-query'
import TanStackQueryDevtools from '@/integrations/tanstack-query/devtools'
import Header from '@/components/Header'
import Events from "@/components/Events"
import { MdInfo } from "react-icons/md";
import GoogleLogin from "@/components/GoogleLogin"
import Footer from "@/components/Footer"
import { Toaster } from "@/components/ui/sonner"
import { getSession } from '@/server/actions/session'
import Providers from '@/context/providers'
import mainCss from '@/styles/main.css?url'
import swiperCss from "swiper/css?url"
import swiperCssPagination from "swiper/css/pagination?url"
import swiperCssNavigation from "swiper/css/navigation?url"
import swiperCssEffectCoverflow from "swiper/css/effect-coverflow?url"
// import swiperCssEffectCube from  "swiper/css/effect-cube?url"



const isDev = process.env.NODE_ENV === "development"



interface MyRouterContext {
  queryClient: QueryClient
}


export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: async () => {
    return await root_metadatas()
  },
  beforeLoad: async ({ context }) => {
    const sessionData = await getSession();
    return { sessionData };
  },
  shellComponent: RootDocument,
})



function RootDocument({ children }: PropsWithChildren): ReactNode {
  const { sessionData } = Route.useRouteContext();
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="nice-font2 tet-xl p-0 m-0 dark:bg-neutral-950 dark:text-white/80 ">
        <Providers initialSession={sessionData}>
          {
            <div className="flex items-center gap-3 w-fit max-w-[80%] mx-auto my-3 px-4 py-3 rounded-xl border border-red-500/30 text-red-400 text-sm font-medium skeleton-wave">
              <MdInfo className="rotate-180 text-xl shrink-0 animate-pulse" />
              <span className="tracking-wide">
                This is <span className="font-bold underline underline-offset-2">not</span> the official BFanel website, please visit <a href="https://bfanel.com" className="font-bold underline underline-offset-2 text-blue-400/70 dark:text-white/70" target="_blank">bfanel.com</a>
              </span>
            </div>
          }
          <Header />
          {children}
          <Footer />
          <GoogleLogin />
          <Toaster />
          <DevTools />
          <Events />
        </Providers>
        <Scripts />
      </body>
    </html>
  )
}



async function root_metadatas(key = "all") {
  const title = "B-Fanel Industries Limited"
  const description = "B-Fanel Industries manufactures durable plumbing and electrical conduit pipes in multiple sizes for residential, commercial, and industrial construction across Nigeria."
  const metadata = {
    meta: [
      { title },
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: "description", content: description },
      { name: "keywords", content: "Pipes production, Plumbing pipes, Conduit pipes, Pipes supply" },
      { name: 'author', content: 'Iroka Ntomchukwu Chisom' },
      { name: 'author:url', content: 'https://iroka09.github.io' },
      // Open Graph
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: 'https://bfanel.vercel.app' },
      { property: 'og:site_name', content: title },
      { property: 'og:type', content: 'website' },
      { property: 'og:image', content: '/bfanel.jpg' },
      { property: 'og:image:alt', content: "website's logo" },
      // Verification
      { name: 'google-site-verification', content: "ZulafKF0UqLIJLvCzrwmpvV1iD93LFrJZocTxwY_mas" },
    ],
    //link tags
    links: [
      { rel: 'preconnect', href: "https://fonts.googleapis.com" },
      { rel: 'preconnect', href: "https://fonts.gstatic.com", crossOrigin: "crossOrigin" },
      { rel: 'stylesheet', href: "https://fonts.googleapis.com/css2?family=Alice&family=Marcellus&display=swap" },
      { rel: 'stylesheet', href: mainCss },
      { rel: 'stylesheet', href: swiperCss },
      { rel: 'stylesheet', href: swiperCssPagination },
      { rel: 'stylesheet', href: swiperCssNavigation },
      { rel: 'stylesheet', href: swiperCssEffectCoverflow },
      { rel: 'icon', href: '/favicon.ico' },
      { rel: 'apple-touch-icon', href: '/favicon.ico' }
    ],
    //scripts
    scripts: [
      ...isDev ?
        [
          {
            src: '/eruda.js',
            defer: false
          },
          {
            children: `
        window.eruda?.init();
      `,
          },
        ]
        : []
    ],
  }
  if (key === "all") return metadata
  return metadata[key]
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