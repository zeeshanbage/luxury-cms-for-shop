import { createClient } from '@supabase/supabase-js';
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

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase URL or Anon Key in .env", env);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  console.log("Fetching collections...");
  const { data: collections, error: cErr } = await supabase.from('collections').select('*');
  if (cErr) console.error("Collections error:", cErr);
  else console.log("Collections:", collections);

  console.log("Fetching products...");
  const { data: products, error: pErr } = await supabase.from('products').select('*');
  if (pErr) console.error("Products error:", pErr);
  else console.log("Products count:", products.length, "Products:", products);
}

main();
