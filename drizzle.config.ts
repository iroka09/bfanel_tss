import { defineConfig } from 'drizzle-kit'
import * as dotenv from 'dotenv'

const isDev = true

dotenv.config({ path: isDev ? '.env.development' : '.env.production.local' })

//console.log(process.env.DATABASE_URL)

export default defineConfig({
  schema: './src/db/schema',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
