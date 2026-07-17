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

  // 1. Read supabase_schema.sql
  const schemaPath = path.resolve(process.cwd(), 'supabase_schema.sql');
  console.log("Reading schema SQL from:", schemaPath);
  const sqlContent = fs.readFileSync(schemaPath, 'utf-8');

  // 2. Execute schema query block
  console.log("Executing supabase_schema.sql query block...");
  await client.query(sqlContent);
  console.log("✅ Core tables and seeds created.");

  // 3. Add custom upgrades columns
  console.log("Applying multi-media and sorting upgrades to 'products' table...");
  await client.query(`
    ALTER TABLE products 
    ADD COLUMN IF NOT EXISTS media JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0;
  `);
  console.log("✅ Upgrades successfully applied.");

  await client.end();
}

main().catch(err => {
  console.error("❌ Failed to initialize database:", err);
  process.exit(1);
});
