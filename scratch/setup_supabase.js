const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const { Client } = require('pg');

// 1. Read env variables
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

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;
let connectionString = env.CONNECTION_STRING;

// Clean connection string brackets if any
if (connectionString && connectionString.includes('[rQk8zi8x1q5i7zYo]')) {
  connectionString = connectionString.replace('[rQk8zi8x1q5i7zYo]', 'rQk8zi8x1q5i7zYo');
}

console.log('Connecting to Supabase at:', supabaseUrl);

async function run() {
  // Step A: Create products table
  if (connectionString) {
    console.log('Creating database table "products"...');
    const client = new Client({ connectionString });
    try {
      await client.connect();
      const sql = `
        CREATE TABLE IF NOT EXISTS products (
            id VARCHAR(100) PRIMARY KEY,
            category_id VARCHAR(100) NOT NULL,
            title VARCHAR(255) NOT NULL,
            subtitle TEXT,
            media_type VARCHAR(50) NOT NULL,
            url TEXT NOT NULL,
            thumbnail TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `;
      await client.query(sql);
      console.log('✅ Database table "products" is ready.');
    } catch (err) {
      console.error('❌ Failed to run migration:', err);
    } finally {
      await client.end();
    }
  } else {
    console.warn('⚠️ CONNECTION_STRING not found in env, skipping table migration.');
  }

  // Step B: Initialize Supabase Client
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Step C: Ensure "products" bucket exists and is public
  console.log('Creating/verifying "products" storage bucket...');
  try {
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    if (listError) throw listError;

    const exists = buckets.some(b => b.name === 'products');
    if (!exists) {
      const { error: createError } = await supabase.storage.createBucket('products', {
        public: true,
        allowedMimeTypes: ['image/*', 'video/*'],
      });
      if (createError) throw createError;
      console.log('✅ Created public storage bucket "products".');
    } else {
      console.log('✅ Storage bucket "products" already exists.');
    }
  } catch (err) {
    console.error('❌ Failed to setup storage bucket:', err.message || err);
  }

  // Step D: Upload all local images to "products" storage bucket
  const imagesDir = path.join(__dirname, '..', 'public', 'images');
  if (fs.existsSync(imagesDir)) {
    const files = fs.readdirSync(imagesDir);
    console.log(`Found ${files.length} images to upload...`);

    for (const file of files) {
      const filePath = path.join(imagesDir, file);
      const fileBuffer = fs.readFileSync(filePath);
      const mimeType = file.endsWith('.jpg') || file.endsWith('.jpeg') ? 'image/jpeg' : 'image/png';

      // We upload under the "initial" category directory or flat
      const storagePath = `initial/${file}`;
      console.log(`Uploading ${file} -> ${storagePath}...`);

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(storagePath, fileBuffer, {
          contentType: mimeType,
          upsert: true,
        });

      if (uploadError) {
        console.error(`❌ Failed to upload ${file}:`, uploadError.message);
      } else {
        const { data } = supabase.storage.from('products').getPublicUrl(storagePath);
        console.log(`✅ Uploaded successfully. CDN URL: ${data.publicUrl}`);
      }
    }
  } else {
    console.warn('⚠️ public/images directory not found.');
  }
}

run();
