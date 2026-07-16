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

  console.log("Adding column 'media' of type JSONB to 'products' table...");
  await client.query(`
    ALTER TABLE products 
    ADD COLUMN IF NOT EXISTS media JSONB DEFAULT '[]'::jsonb;
  `);
  console.log("Column added successfully or already exists.");

  console.log("Migrating existing products to populate 'media' column...");
  const updateRes = await client.query(`
    UPDATE products 
    SET media = jsonb_build_array(
      jsonb_build_object(
        'type', media_type,
        'url', url,
        'thumbnail', COALESCE(thumbnail, url),
        'subtitle', COALESCE(subtitle, '')
      )
    )
    WHERE media IS NULL OR media = '[]'::jsonb OR jsonb_array_length(media) = 0;
  `);
  console.log(`Updated ${updateRes.rowCount} rows.`);

  await client.end();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
