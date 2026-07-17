import pg from 'pg';
import fs from 'fs';
import path from 'path';

// Parse .env manually
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    env[parts[0].trim()] = parts.slice(1).join('=').trim();
  }
});

let connectionString = env.CONNECTION_STRING;
if (connectionString) {
  connectionString = connectionString.replace('[rQk8zi8x1q5i7zYo]', 'rQk8zi8x1q5i7zYo');
}

if (!connectionString) {
  console.error("Missing CONNECTION_STRING in .env");
  process.exit(1);
}

const client = new pg.Client({ connectionString });

async function main() {
  await client.connect();
  console.log("Connected to PostgreSQL!");

  console.log("Reloading PostgREST schema cache...");
  await client.query("NOTIFY pgrst, 'reload schema';");
  console.log("✅ PostgREST schema cache reloaded successfully!");

  await client.end();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
