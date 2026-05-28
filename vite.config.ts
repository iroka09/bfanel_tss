import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { nitro } from 'nitro/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'


const config = defineConfig({
  server: {
    port: 3000,
  },
  resolve: {
    // Enables Vite to resolve imports using path aliases.
    tsconfigPaths: true,
  },
  plugins: [
    devtools(),
    tailwindcss(),
    tanstackStart({
      srcDirectory: 'src', // "src" is the default
      router: {
        routesDirectory: 'routes', // "routes" is the default
      },
    }),
    nitro(),
    viteReact(),
    //this makes browser to install the website as mobile app
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'B-Fanel Industries',
        short_name: 'B-Fanel',
        start_url: '/',
        display: 'standalone',
        theme_color: '#1e2840',
        background_color: '#ffffff',
        icons: [
          { src: '/logo_low.png', sizes: '192x192', type: 'image/png' }
        ]
      }
    })
  ]
})

export default config
