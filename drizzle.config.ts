import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";


const isNeon = true

dotenv.config({ path: (isNeon) ? ".env.production.local" : ".env.development" });

export default defineConfig({
  schema: "./src/db/schema",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});