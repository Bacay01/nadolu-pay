import { Client } from "pg";

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  const result = await client.query("SELECT 1");
  console.log("Neon keep-alive ping succeeded:", result.rows);
  await client.end();
}

main().catch((err) => {
  console.error("Neon keep-alive ping failed:", err);
  process.exit(1);
});