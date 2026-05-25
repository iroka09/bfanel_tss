import { neon } from "@neondatabase/serverless";
import { Pool } from "pg";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres"
import * as schema from "./schema";

const isDev = process.env.NODE_ENV === "development";

export const db = isDev
  ? drizzlePg(process.env.DATABASE_URL)
  : drizzleNeon(neon(process.env.NEON_DATABASE_URL!), { schema });
/*
export const db = isDev
  ? drizzlePg(new Pool({ connectionString: process.env.DATABASE_URL! }), { schema })
  : drizzleNeon(neon(process.env.NEON_DATABASE_URL!), { schema });*/