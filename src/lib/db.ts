import { Pool } from "pg";

if (!process.env.DATABASE_URL) {
  throw new Error("❌ Missing DATABASE_URL in environment variables");
}

export const pool: Pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

