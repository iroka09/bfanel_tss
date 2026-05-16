import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { nitro } from 'nitro/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


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
  ]
})

export default config
