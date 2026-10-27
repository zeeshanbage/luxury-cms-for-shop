import { supabase } from "./supabase";
import type { DbSettings, DbCollection, DbGallery, DbTestimonial, DbService, Product, MediaItem } from "@/types/db";

// 1. SETTINGS SERVICE
export async function getSettings(): Promise<DbSettings> {
  if (!supabase) throw new Error("Database is down: Supabase client is not configured.");
  
  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .order("id", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(`Database is down: ${error.message || "Failed to fetch settings"}`);
  if (!data) throw new Error("Database is down: No settings record found in database");
  
  return data as DbSettings;
}

export async function updateSettings(updates: Partial<DbSettings>): Promise<DbSettings> {
  if (!supabase) throw new Error("Database is down: Supabase client is not configured.");

  const { data: records, error: fetchError } = await supabase
    .from("settings")
    .select("id")
    .limit(1);
  
  if (fetchError) throw fetchError;
  const settingsId = records?.[0]?.id;
  
  if (!settingsId) {
    const { data, error } = await supabase
      .from("settings")
      .insert([updates])
      .select("*");
    
    if (error) throw error;
    const created = data?.[0];
    if (!created) {
      throw new Error(
        "Settings insert failed — no rows returned. " +
        "This is usually caused by a missing INSERT Row Level Security (RLS) policy on your Supabase 'settings' table."
      );
    }
    return created as DbSettings;
  } else {
    const { data, error } = await supabase
      .from("settings")
      .update(updates)
      .eq("id", settingsId)
      .select("*");
    
    if (error) throw error;
    const updated = data?.[0];
    if (!updated) {
      throw new Error(
        "Settings update failed — no rows were modified. " +
        "This is usually caused by a missing UPDATE Row Level Security (RLS) policy on your Supabase 'settings' table."
      );
    }
    return updated as DbSettings;
  }
}

// 2. COLLECTIONS SERVICE
export async function getCollections(): Promise<DbCollection[]> {
  if (!supabase) throw new Error("Database is down: Supabase client is not configured.");

  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw new Error(`Database is down: ${error.message || "Failed to fetch collections"}`);
  if (!data || data.length === 0) throw new Error("Database is down: No collections records found");

  return data as DbCollection[];
}

// 3. GALLERY SERVICE
export async function getGallery(): Promise<DbGallery[]> {
  if (!supabase) throw new Error("Database is down: Supabase client is not configured.");

  const { data, error } = await supabase
    .from("gallery")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw new Error(`Database is down: ${error.message || "Failed to fetch gallery"}`);
  if (!data || data.length === 0) throw new Error("Database is down: No gallery records found");

  return data as DbGallery[];
}

// 4. TESTIMONIALS SERVICE
export async function getTestimonials(): Promise<DbTestimonial[]> {
  if (!supabase) throw new Error("Database is down: Supabase client is not configured.");

  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw new Error(`Database is down: ${error.message || "Failed to fetch testimonials"}`);
  if (!data || data.length === 0) throw new Error("Database is down: No testimonials records found");

  return data as DbTestimonial[];
}

// 5. SERVICES SERVICE
export async function getServices(): Promise<DbService[]> {
  if (!supabase) throw new Error("Database is down: Supabase client is not configured.");

  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw new Error(`Database is down: ${error.message || "Failed to fetch services"}`);
  if (!data || data.length === 0) throw new Error("Database is down: No services records found");

  return data as DbService[];
}

function compressImage(file: File, maxSizeMB: number = 5): Promise<File> {
  return new Promise((resolve) => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (!file.type.startsWith("image/") || file.size <= maxSizeBytes) {
      return resolve(file);
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        // High visually-lossless quality for premium lookbook photos
        const QUALITY = 0.92;
        let scale = 1.0;

        const attemptCompression = () => {
          const canvas = document.createElement("canvas");
          let width = Math.round(img.width * scale);
          let height = Math.round(img.height * scale);

          // Limit width and height to 4K max dimensions to prevent huge memory footprint
          const maxDimension = 3840;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) return resolve(file);

          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                return resolve(file);
              }
              // Stop scaling down if size is under 5MB or width is below 800px (to prevent too small resolutions)
              if (blob.size <= maxSizeBytes || width < 800) {
                const newName = file.name.replace(/\.[^/.]+$/, "") + ".jpg";
                const compressedFile = new File([blob], newName, {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                });
                console.log(
                  `[Image Compressor] Scaled ${scale.toFixed(2)}x and saved ${file.name} from ${(file.size / 1024 / 1024).toFixed(2)}MB to ${(blob.size / 1024 / 1024).toFixed(2)}MB at visually-lossless quality (${QUALITY})`
                );
                resolve(compressedFile);
              } else {
                scale *= 0.85;
                attemptCompression();
              }
            },
            "image/jpeg",
            QUALITY
          );
        };
        attemptCompression();
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
}

// 6. PRODUCTS / LOOKBOOK UPLOADS SERVICE
export async function uploadProductMedia(file: File, categoryId: string): Promise<string> {
  if (!supabase) throw new Error("Supabase client not initialized");

  const fileToUpload = await compressImage(file, 5);
  const fileExt = fileToUpload.name.split(".").pop();
  const fileName = `${categoryId}/${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

  const { error } = await supabase.storage
    .from("products")
    .upload(fileName, fileToUpload, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage
    .from("products")
    .getPublicUrl(fileName);

  return data.publicUrl;
}

export async function getProducts(categoryId: string): Promise<Product[]> {
  if (!supabase) throw new Error("Database is down: Supabase client is not configured.");

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category_id", categoryId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Database is down: ${error.message || "Failed to fetch products"}`);
  if (!data) throw new Error(`Database is down: No products returned for category "${categoryId}"`);

  return data.map((row) => {
    const dbMedia = Array.isArray(row.media) && row.media.length > 0 ? row.media : null;
    const mediaItems: MediaItem[] = dbMedia ? dbMedia.map((m: any) => ({
      type: m.type || "image",
      url: m.url,
      thumbnail: m.thumbnail || (m.type === "video" ? "/images/brand-logo.png" : m.url),
      subtitle: m.subtitle || "",
      focalPoint: m.focalPoint,
    })) : [
      {
        type: row.media_type as "image" | "video",
        url: row.url,
        thumbnail: row.thumbnail || (row.media_type === "video" ? "/images/brand-logo.png" : row.url),
        subtitle: row.subtitle || "",
      }
    ];

    return {
      id: row.id,
      title: row.title,
      subtitle: row.subtitle || "",
      heroMedia: { 
        type: (mediaItems[0]?.type || row.media_type) as "image" | "video", 
        url: mediaItems[0]?.url || row.url 
      },
      media: mediaItems,
    };
  });
}

export async function createProduct(
  categoryId: string,
  productMetadata: { title: string; subtitle: string },
  mediaItems: { file: File; mediaType: "image" | "video"; subtitle: string }[]
): Promise<Product> {
  if (!supabase) throw new Error("Supabase client not initialized");
  if (mediaItems.length === 0) throw new Error("No media items provided");

  const id = `${categoryId}-${Date.now()}`;
  
  const mediaList = await Promise.all(
    mediaItems.map(async (item) => {
      const url = await uploadProductMedia(item.file, categoryId);
      const thumbnail = item.mediaType === "image" ? url : "/images/brand-logo.png";
      return {
        type: item.mediaType,
        url,
        thumbnail,
        subtitle: item.subtitle || "",
      };
    })
  );

  const heroItem = mediaList[0];

  const { error } = await supabase.from("products").insert({
    id,
    category_id: categoryId,
    title: productMetadata.title,
    subtitle: productMetadata.subtitle,
    media_type: heroItem.type,
    url: heroItem.url,
    thumbnail: heroItem.thumbnail,
    media: mediaList,
  });

  if (error) throw error;

  return {
    id,
    title: productMetadata.title,
    subtitle: productMetadata.subtitle,
    heroMedia: { type: heroItem.type, url: heroItem.url },
    media: mediaList,
  };
}

export async function updateProduct(
  productId: string,
  updates: { 
    title?: string; 
    subtitle?: string; 
    media?: MediaItem[];
  }
): Promise<Product> {
  if (!supabase) throw new Error("Supabase client not initialized");

  const extraFields: any = {};
  if (updates.media && updates.media.length > 0) {
    const heroItem = updates.media[0];
    extraFields.media_type = heroItem.type;
    extraFields.url = heroItem.url;
    extraFields.thumbnail = heroItem.thumbnail;
  }

  const dbUpdates = {
    ...updates,
    ...extraFields,
  };

  // NOTE: Do NOT use .single() here — RLS block returns 0 rows and .single() throws 406.
  const { data: rows, error } = await supabase
    .from("products")
    .update(dbUpdates)
    .eq("id", productId)
    .select("*");

  if (error) throw error;

  const data = rows?.[0];
  if (!data) {
    throw new Error(`Product update failed — no rows were modified. Check RLS policies on the products table.`);
  }

  const dbMedia = Array.isArray(data.media) && data.media.length > 0 ? data.media : null;
  const mediaItems: MediaItem[] = dbMedia ? dbMedia.map((m: any) => ({
    type: m.type || "image",
    url: m.url,
    thumbnail: m.thumbnail || (m.type === "video" ? "/images/brand-logo.png" : m.url),
    subtitle: m.subtitle || "",
    focalPoint: m.focalPoint,
  })) : [
    {
      type: data.media_type as "image" | "video",
      url: data.url,
      thumbnail: data.thumbnail || (data.media_type === "video" ? "/images/brand-logo.png" : data.url),
      subtitle: data.subtitle || "",
    }
  ];

  return {
    id: data.id,
    title: data.title,
    subtitle: data.subtitle || "",
    heroMedia: { 
      type: (mediaItems[0]?.type || data.media_type) as "image" | "video", 
      url: mediaItems[0]?.url || data.url 
    },
    media: mediaItems,
  };
}

export async function deleteProduct(productId: string, _categoryId: string): Promise<void> {
  if (!supabase) throw new Error("Supabase client not initialized");
  const { error } = await supabase.from("products").delete().eq("id", productId);
  if (error) throw error;
}

export async function updateProductsOrder(orderedIds: string[]): Promise<void> {
  const client = supabase;
  if (!client) throw new Error("Supabase client not initialized");

  const promises = orderedIds.map((id, index) =>
    client
      .from("products")
      .update({ sort_order: index })
      .eq("id", id)
  );

  const results = await Promise.all(promises);
  const error = results.find(r => r.error)?.error;
  if (error) throw error;
}

export async function createCollection(title: string): Promise<DbCollection> {
  if (!supabase) throw new Error("Supabase client not initialized");

  // Generate unique URL-friendly ID
  const baseId = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  
  let id = baseId;
  let attempt = 0;
  while (true) {
    const { data: existing } = await supabase
      .from("collections")
      .select("id")
      .eq("id", id)
      .maybeSingle();
    if (!existing) break;
    attempt++;
    id = `${baseId}-${attempt}`;
  }

  // Get current max sort order
  const { data: countData } = await supabase
    .from("collections")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1);
  const nextOrder = countData && countData.length > 0 ? (countData[0].sort_order ?? 0) + 1 : 0;

  const newCol: DbCollection = {
    id,
    title,
    price: "Starting from ₹1,000",
    description: `Exquisite custom collection of ${title}`,
    icon: "Layers",
    features: ["Premium quality materials", "Custom size fittings available", "Tailored to perfection"],
    image_url: undefined,
    sort_order: nextOrder,
  };

  const { error } = await supabase.from("collections").insert(newCol);
  if (error) {
    // 42501 = RLS violation / insufficient privilege
    if (error.code === "42501" || error.message?.includes("policy")) {
      throw new Error(
        `Collection insert was blocked by Supabase RLS — the collections table is missing an INSERT policy. ` +
        `Run scripts/fix_collections_rls.sql in your Supabase SQL editor to fix this.`
      );
    }
    throw error;
  }

  return newCol;
}

export async function updateCollection(
  id: string,
  updates: Partial<DbCollection>
): Promise<DbCollection> {
  if (!supabase) throw new Error("Supabase client not initialized");

  // NOTE: Do NOT use .single() here — if RLS silently blocks the UPDATE,
  // PostgREST returns 0 rows and .single() throws 406 Not Acceptable.
  // Using array select + data[0] check handles this cleanly.
  const { data, error } = await supabase
    .from("collections")
    .update(updates)
    .eq("id", id)
    .select("*");

  if (error) throw error;

  const updated = data?.[0];
  if (!updated) {
    throw new Error(
      `Collection update failed — no rows were modified.\n` +
      `This is caused by a missing RLS UPDATE policy on the collections table.\n` +
      `Run scripts/fix_collections_rls.sql in your Supabase SQL editor (for BOTH projects: fashionking + seemasarees).`
    );
  }
  return updated as DbCollection;
}


export async function deleteCollection(id: string): Promise<void> {
  if (!supabase) throw new Error("Supabase client not initialized");

  // Check if any product exists under this collection
  const { data: products, error: checkError } = await supabase
    .from("products")
    .select("id")
    .eq("category_id", id)
    .limit(1);

  if (checkError) throw checkError;
  if (products && products.length > 0) {
    throw new Error("Cannot delete collection. Move or delete all products inside it first.");
  }

  // Use count to detect RLS silent block (204 with 0 rows affected)
  const { error, count } = await supabase
    .from("collections")
    .delete({ count: "exact" })
    .eq("id", id);

  if (error) throw error;

  if (count === 0) {
    throw new Error(
      `Collection delete was blocked by Supabase RLS — the collections table is missing a DELETE policy. ` +
      `Run scripts/fix_collections_rls.sql in your Supabase SQL editor to fix this.`
    );
  }
}

export async function updateCollectionsOrder(orderedIds: string[]): Promise<void> {
  const client = supabase;
  if (!client) throw new Error("Supabase client not initialized");

  const promises = orderedIds.map((id, index) =>
    client
      .from("collections")
      .update({ sort_order: index })
      .eq("id", id)
  );

  const results = await Promise.all(promises);
  const error = results.find(r => r.error)?.error;
  if (error) throw error;
}
