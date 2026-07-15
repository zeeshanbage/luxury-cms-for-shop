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

    // Enable policies for the storage.objects table and products table to allow anon access
    console.log('Creating database & storage RLS policies...');
    const sql = `
      -- A. Storage RLS Policies
      DROP POLICY IF EXISTS "Allow public uploads to products bucket" ON storage.objects;
      DROP POLICY IF EXISTS "Allow public select from products bucket" ON storage.objects;
      DROP POLICY IF EXISTS "Allow public delete from products bucket" ON storage.objects;

      CREATE POLICY "Allow public uploads to products bucket" ON storage.objects
      FOR INSERT TO public WITH CHECK (bucket_id = 'products');

      CREATE POLICY "Allow public select from products bucket" ON storage.objects
      FOR SELECT TO public USING (bucket_id = 'products');

      CREATE POLICY "Allow public delete from products bucket" ON storage.objects
      FOR DELETE TO public USING (bucket_id = 'products');

      -- B. Products Table RLS Policies
      -- Enable RLS just in case it is disabled or needs to be active
      ALTER TABLE products ENABLE ROW LEVEL SECURITY;

      DROP POLICY IF EXISTS "Allow public select on products" ON products;
      DROP POLICY IF EXISTS "Allow public insert on products" ON products;
      DROP POLICY IF EXISTS "Allow public delete on products" ON products;

      CREATE POLICY "Allow public select on products" ON products
      FOR SELECT TO public USING (true);

      CREATE POLICY "Allow public insert on products" ON products
      FOR INSERT TO public WITH CHECK (true);

      CREATE POLICY "Allow public delete on products" ON products
      FOR DELETE TO public USING (true);
    `;
    await client.query(sql);
    console.log('✅ Database and Storage policies updated successfully! Anyone can now upload/read/delete lookbook items.');
  } catch (err) {
    console.error('❌ Failed to update storage policies:', err);
  } finally {
    await client.end();
  }
}

run();
