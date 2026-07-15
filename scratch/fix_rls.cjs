const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

// Read env variables
const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split(/\r?\n/).forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    const key = match[1];
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    env[key] = value;
  }
});

let connectionString = env.CONNECTION_STRING;
if (connectionString && connectionString.includes('[rQk8zi8x1q5i7zYo]')) {
  connectionString = connectionString.replace('[rQk8zi8x1q5i7zYo]', 'rQk8zi8x1q5i7zYo');
}

async function run() {
  if (!connectionString) {
    console.error('❌ CONNECTION_STRING not found in env.');
    return;
  }

  console.log('Connecting to database...');
  const client = new Client({ connectionString });
  try {
    await client.connect();

    // Enable policies for the storage.objects table to allow anon writes to "products" bucket
    console.log('Creating storage RLS policies...');
    const sql = `
      -- 1. Drop existing policies to prevent naming conflict errors
      DROP POLICY IF EXISTS "Allow public uploads to products bucket" ON storage.objects;
      DROP POLICY IF EXISTS "Allow public select from products bucket" ON storage.objects;
      DROP POLICY IF EXISTS "Allow public delete from products bucket" ON storage.objects;

      -- 2. Allow anonymous uploads to the 'products' bucket
      CREATE POLICY "Allow public uploads to products bucket" ON storage.objects
      FOR INSERT
      TO public
      WITH CHECK (bucket_id = 'products');

      -- 3. Allow anonymous reads from the 'products' bucket
      CREATE POLICY "Allow public select from products bucket" ON storage.objects
      FOR SELECT
      TO public
      USING (bucket_id = 'products');

      -- 4. Allow anonymous deletes from the 'products' bucket (for when products are removed)
      CREATE POLICY "Allow public delete from products bucket" ON storage.objects
      FOR DELETE
      TO public
      USING (bucket_id = 'products');
    `;
    await client.query(sql);
    console.log('✅ Storage bucket policies updated successfully! Anyone can now upload/delete lookbook items.');
  } catch (err) {
    console.error('❌ Failed to update storage policies:', err);
  } finally {
    await client.end();
  }
}

run();
