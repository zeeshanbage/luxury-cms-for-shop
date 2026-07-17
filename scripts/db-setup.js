import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const { Client } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 1. Parse current .env file to retrieve connection details
const envPath = path.join(rootDir, '.env');
if (!fs.existsSync(envPath)) {
  console.error('\x1b[31mError: .env file does not exist. Run "npm run setup <client-name>" first.\x1b[0m');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split(/\r?\n/).forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const value = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
    env[key] = value;
  }
});

let connectionString = env.CONNECTION_STRING || env.CONENCTION_STRING;

if (connectionString) {
  // Strip brackets from the password placeholder if present, e.g. :[password]@ -> :password@
  connectionString = connectionString.replace(/:\[([^\]]+)\]@/, ':$1@');
}

const activeClient = env.VITE_ACTIVE_CLIENT || 'fashionking';

if (!connectionString) {
  console.error('\x1b[31mError: CONNECTION_STRING or CONENCTION_STRING not found in .env\x1b[0m');
  process.exit(1);
}

console.log(`Setting up database for client: \x1b[1m${activeClient.toUpperCase()}\x1b[22m`);
console.log(`Connecting to database...`);

const client = new Client({ connectionString });

async function setup() {
  try {
    await client.connect();
    console.log('\x1b[32mConnected successfully.\x1b[0m');

    // 2. Read and run schema migrations
    const schemaPath = path.join(rootDir, 'supabase_schema.sql');
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Migration schema file not found at: ${schemaPath}`);
    }
    console.log('Applying table migrations (supabase_schema.sql)...');
    const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
    await client.query(schemaSql);
    console.log('\x1b[32mBase migrations applied successfully.\x1b[0m');

    // Ensure sort_order column exists on the products table for existing setups
    console.log('Ensuring sort_order column exists on products table...');
    await client.query('ALTER TABLE products ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0;');
    console.log('\x1b[32mProduct sort order column verified.\x1b[0m');

    // Ensure media column exists on the products table for existing setups
    console.log('Ensuring media column exists on products table...');
    await client.query('ALTER TABLE products ADD COLUMN IF NOT EXISTS media JSONB NOT NULL DEFAULT \'[]\'::jsonb;');
    console.log('\x1b[32mProduct media column verified.\x1b[0m');

    // 3. Read and run client-specific seed data
    const seedPath = path.join(rootDir, 'seeds', `${activeClient}.sql`);
    if (!fs.existsSync(seedPath)) {
      throw new Error(`Seed data file not found at: ${seedPath}`);
    }
    console.log(`Applying client seed data (${activeClient}.sql)...`);
    const seedSql = fs.readFileSync(seedPath, 'utf-8');
    await client.query(seedSql);
    console.log(`\x1b[32mDatabase successfully seeded for ${activeClient.toUpperCase()}.\x1b[0m`);

  } catch (err) {
    console.error('\x1b[31mError during database setup:\x1b[0m', err.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log('Database connection closed.');
  }
}

setup();
