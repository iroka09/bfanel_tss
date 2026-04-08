
import mainCss from '@/styles/main.css?url'
import swiperCss from "swiper/css?url"
import swiperCssPagination from "swiper/css/pagination?url"
import swiperCssNavigation from "swiper/css/navigation?url"
import swiperCssEffectCoverflow from "swiper/css/effect-coverflow?url"
// import swiperCssEffectCube from  "swiper/css/effect-cube?url"



const isDev = process.env.NODE_ENV === "development"
const title = "B-Fanel Industries Limited"
const description = "B-Fanel Industries manufactures durable plumbing and electrical conduit pipes in multiple sizes for residential, commercial, and industrial construction across Nigeria."



export const root_metadatas = async (key = "all") => {
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