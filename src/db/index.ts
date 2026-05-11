import { neon } from "@neondatabase/serverless";
//import { Pool } from "pg";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema.ts";


// clound storage
const neonClient = neon(process.env.NEON_DATABASE_URL!);

// localhost storage sql server
// const poolClient = new Pool({ connectionString: process.env.DATABASE_URL! });

export const db = drizzle(
  neonClient, // replace with neonClient for cloud neon sever.
  { schema }
);