// For Node.js - make sure to install the 'ws' and 'bufferutil' packages
import { Pool, neonConfig } from "@neondatabase/serverless";
import { ExtractTablesWithRelations } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-serverless";
import { PgQueryResultHKT, PgTransaction } from "drizzle-orm/pg-core";
import ws from "ws";
import { schema } from "./schema";

neonConfig.webSocketConstructor = ws;
type Schema = typeof schema;

const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 1 });
export const db = drizzle({ client: pool, schema });

export { schema };

export type Transaction = PgTransaction<
    PgQueryResultHKT,
    Schema,
    ExtractTablesWithRelations<Schema>
>;
