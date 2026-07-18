import { supabase } from "./supabase";
import { siteConfig } from "@/config/site";
import { contactConfig } from "@/config/contact";
import { socialConfig } from "@/config/social";
import { collectionsConfig } from "@/config/collections";
import { imageConfig } from "@/config/images";
import type { DbSettings, DbCollection, DbGallery, DbTestimonial, DbService, Product, MediaItem } from "@/types/db";

// 1. SETTINGS SERVICE
export async function getSettings(): Promise<DbSettings> {
  try {
    if (!supabase) throw new Error("Supabase client not initialized");
    
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .order("id", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error("No settings record found in database");
    
    return data as DbSettings;
  } catch (err) {
    console.warn("[DB Service] getSettings failed. Falling back to local configuration files.", err);
    return {
      site_name: siteConfig.name,
      site_sub_name: siteConfig.subName,
      site_tagline: siteConfig.tagline,
      site_description: siteConfig.description,
      seo_title: siteConfig.seoTitle,
      seo_description: siteConfig.seoDescription,
      og_title: siteConfig.ogTitle,
      og_description: siteConfig.ogDescription,
      founded_year: siteConfig.foundedYear,
      phone: contactConfig.phone,
      phone_formatted: contactConfig.phoneFormatted,
      email: contactConfig.email,
      address: contactConfig.address,
      maps_link: contactConfig.mapsLink,
      about_title: siteConfig.philosophy.title,
      about_header: siteConfig.philosophy.header,
      about_accent_word: siteConfig.philosophy.accentWord,
      about_subtitle: siteConfig.philosophy.subTitle,
      about_intro: siteConfig.philosophy.intro,
      about_paragraph1: siteConfig.philosophy.paragraph1,
      about_paragraph2: siteConfig.philosophy.paragraph2,
      business_hours: contactConfig.businessHours,
      socials: socialConfig,
      pillars: siteConfig.pillars,
      teaser_features: siteConfig.teaserFeatures,
    };
  }
}

// 2. COLLECTIONS SERVICE
export async function getCollections(): Promise<DbCollection[]> {
  try {
    if (!supabase) throw new Error("Supabase client not initialized");

    const { data, error } = await supabase
      .from("collections")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;
    if (!data || data.length === 0) throw new Error("No collections records found");

    return data as DbCollection[];
  } catch (err) {
    console.warn("[DB Service] getCollections failed. Falling back to local collectionsConfig.", err);
    return collectionsConfig.map((item) => ({
      id: item.id,
      title: item.title,
      price: item.price,
      description: item.description,
      icon: item.icon,
      features: item.features,
      image_url: imageConfig.collections[item.id as keyof typeof imageConfig.collections] || imageConfig.heroImages.teaserHero
    }));
  }
}

// 3. GALLERY SERVICE
export async function getGallery(): Promise<DbGallery[]> {
  try {
    if (!supabase) throw new Error("Supabase client not initialized");

    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;
    if (!data || data.length === 0) throw new Error("No gallery records found");

    return data as DbGallery[];
  } catch (err) {
    console.warn("[DB Service] getGallery failed. Falling back to local imageConfig.workGallery.", err);
    return imageConfig.workGallery.map((item) => ({
      id: item.id,
      url: item.url,
      alt: item.alt,
    }));
  }
}

// 4. TESTIMONIALS SERVICE
export async function getTestimonials(): Promise<DbTestimonial[]> {
  try {
    if (!supabase) throw new Error("Supabase client not initialized");

    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;
    if (!data || data.length === 0) throw new Error("No testimonials records found");

    return data as DbTestimonial[];
  } catch (err) {
    console.warn("[DB Service] getTestimonials failed. Falling back to local testimonials fallback mock.", err);
    return (imageConfig.testimonials as any[]).map((item, idx) => ({
      id: idx + 1,
      client_name: item.clientName,
      client_image: item.clientImage,
      review_text: item.reviewText || "The quality of fabrics and curation was absolutely flawless. Very satisfied with my purchase.",
      rating: 5,
      sort_order: 10,
    }));
  }
}

// 5. SERVICES SERVICE
export async function getServices(): Promise<DbService[]> {
  try {
    if (!supabase) throw new Error("Supabase client not initialized");

    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;
    if (!data || data.length === 0) throw new Error("No services records found");

    return data as DbService[];
  } catch (err) {
    console.warn("[DB Service] getServices failed. Falling back to local custom services mock.", err);
    return [
      {
        id: "visiting-tailor",
        title: "Visiting Tailor Service",
        price: "On Demand",
        description: "A private fitting consultant travels directly to your residence or hotel in Beed district to measure and consult on wedding packages.",
        icon: "Users",
        features: [
          "Private measuring session at your home",
          "Complete fabric swatches brought to you",
          "Saves time for busy grooms"
        ]
      }
    ];
  }
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
  if (!supabase) {
    console.warn(`[DB Service] Supabase not initialized. Cannot fetch products for "${categoryId}".`);
    return [];
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category_id", categoryId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error(`[DB Service] Error fetching products for "${categoryId}":`, error);
    throw error;
  }

  return (data || []).map((row) => {
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

  const { data, error } = await supabase
    .from("products")
    .update(dbUpdates)
    .eq("id", productId)
    .select("*")
    .single();

  if (error) throw error;

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
  if (error) throw error;

  return newCol;
}

export async function updateCollection(
  id: string,
  updates: Partial<DbCollection>
): Promise<DbCollection> {
  if (!supabase) throw new Error("Supabase client not initialized");

  const { data, error } = await supabase
    .from("collections")
    .update(updates)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return data as DbCollection;
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

  const { error } = await supabase.from("collections").delete().eq("id", id);
  if (error) throw error;
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


