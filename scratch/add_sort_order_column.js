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

  console.log("Adding column 'sort_order' of type INT to 'products' table...");
  await client.query(`
    ALTER TABLE products 
    ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0;
  `);
  console.log("Column added successfully or already exists.");

  console.log("Initializing sort_order sequentially for each category...");
  const categoriesRes = await client.query(`
    SELECT DISTINCT category_id FROM products;
  `);
  const categories = categoriesRes.rows.map(r => r.category_id);

  for (const catId of categories) {
    console.log(`Processing category: ${catId}`);
    const productsRes = await client.query(`
      SELECT id FROM products 
      WHERE category_id = $1 
      ORDER BY created_at ASC;
    `, [catId]);

    const products = productsRes.rows;
    for (let i = 0; i < products.length; i++) {
      await client.query(`
        UPDATE products 
        SET sort_order = $1 
        WHERE id = $2;
      `, [i, products[i].id]);
    }
  }
  console.log("Initial sorting order assigned successfully.");

  await client.end();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
