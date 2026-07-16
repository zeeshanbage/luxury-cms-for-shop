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
// Use service role key to bypass RLS policies and have full admin privileges
const supabaseServiceKey = env.SERVICE_ROLE || env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase configuration in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const CATEGORIES_MAPPING = {
  'suits.json': 'suits',
  'sherwani.json': 'sherwani',
  'kurta.json': 'kurta',
  'fabrics.json': 'fabrics'
};

async function uploadFile(bucket, storagePath, localFilePath) {
  const fileBuffer = fs.readFileSync(localFilePath);
  const ext = path.extname(localFilePath).toLowerCase();
  let contentType = 'image/jpeg';
  if (ext === '.png') contentType = 'image/png';
  else if (ext === '.gif') contentType = 'image/gif';
  else if (ext === '.webp') contentType = 'image/webp';
  else if (ext === '.mp4') contentType = 'video/mp4';

  console.log(`Uploading ${localFilePath} to bucket:${bucket} at ${storagePath}...`);
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(storagePath, fileBuffer, {
      contentType,
      cacheControl: '3600',
      upsert: true
    });

  if (error) {
    // If it already exists, let's get the URL anyway
    if (error.message && error.message.includes('already exists')) {
      console.log(`File already exists at ${storagePath}, reusing.`);
    } else {
      throw error;
    }
  }

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(storagePath);

  return urlData.publicUrl;
}

async function migrate() {
  try {
    for (const [jsonFile, categoryId] of Object.entries(CATEGORIES_MAPPING)) {
      const jsonPath = path.resolve(process.cwd(), 'public', 'data', jsonFile);
      if (!fs.existsSync(jsonPath)) {
        console.warn(`JSON file not found: ${jsonFile}, skipping.`);
        continue;
      }

      console.log(`\nProcessing ${jsonFile} for category "${categoryId}"...`);
      const fileContent = fs.readFileSync(jsonPath, 'utf-8');
      const data = JSON.parse(fileContent);
      const items = data.items || [];

      for (const item of items) {
        console.log(`Migrating item: ${item.title} (${item.id})`);
        
        // 1. Resolve local media paths
        const heroUrl = item.heroMedia.url;
        let cdnUrl = heroUrl;
        
        if (heroUrl.startsWith('/images/')) {
          const localMediaFile = path.resolve(process.cwd(), 'public', heroUrl.substring(1));
          if (fs.existsSync(localMediaFile)) {
            const fileName = path.basename(localMediaFile);
            const storagePath = `${categoryId}/${fileName}`;
            try {
              cdnUrl = await uploadFile('products', storagePath, localMediaFile);
              console.log(`Uploaded media public URL: ${cdnUrl}`);
            } catch (err) {
              console.error(`Failed to upload ${localMediaFile}:`, err);
            }
          } else {
            console.warn(`Local file ${localMediaFile} not found for item ${item.title}`);
          }
        }

        // 2. Insert product row in DB
        const mediaType = item.heroMedia.type || 'image';
        const thumbnail = cdnUrl; // For simplicity, thumbnail is same as CDN URL

        const { data: existing, error: findError } = await supabase
          .from('products')
          .select('id')
          .eq('id', item.id)
          .maybeSingle();

        if (findError) {
          console.error(`Error checking product existence:`, findError);
        }

        if (existing) {
          console.log(`Product "${item.title}" (${item.id}) already exists in DB. Updating url...`);
          const { error: updateError } = await supabase
            .from('products')
            .update({
              category_id: categoryId,
              title: item.title,
              subtitle: item.subtitle,
              media_type: mediaType,
              url: cdnUrl,
              thumbnail
            })
            .eq('id', item.id);
          
          if (updateError) {
            console.error(`Failed to update product in DB:`, updateError);
          }
        } else {
          console.log(`Inserting product "${item.title}" (${item.id}) into DB...`);
          const { error: insertError } = await supabase
            .from('products')
            .insert({
              id: item.id,
              category_id: categoryId,
              title: item.title,
              subtitle: item.subtitle,
              media_type: mediaType,
              url: cdnUrl,
              thumbnail
            });

          if (insertError) {
            console.error(`Failed to insert product in DB:`, insertError);
          }
        }
      }
    }
    console.log("\nMigration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  }
}

migrate();
