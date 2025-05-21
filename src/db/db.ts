import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config();

const isDebug = process.env.DEBUG === "True";

let pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

if (isDebug) {
  pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  });
}

export default pool;
