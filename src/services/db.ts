import { supabase } from "./supabase";
import { siteConfig } from "@/config/site";
import { contactConfig } from "@/config/contact";
import { socialConfig } from "@/config/social";
import { collectionsConfig } from "@/config/collections";
import { imageConfig } from "@/config/images";
import type { DbSettings, DbCollection, DbGallery, DbTestimonial, DbService, Product } from "@/types/db";

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
    return imageConfig.testimonials.map((item, idx) => ({
      id: idx + 1,
      client_name: item.clientName,
      client_image: item.clientImage,
      review_text: "The suit fitting was absolutely flawless. They took the time to map my posture and the result was incredibly comfortable.",
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

// 6. PRODUCTS / LOOKBOOK UPLOADS SERVICE
export async function uploadProductMedia(file: File, categoryId: string): Promise<string> {
  if (!supabase) throw new Error("Supabase client not initialized");

  const fileExt = file.name.split(".").pop();
  const fileName = `${categoryId}/${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

  const { error } = await supabase.storage
    .from("products")
    .upload(fileName, file, {
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
    .order("created_at", { ascending: false });

  if (error) {
    console.error(`[DB Service] Error fetching products for "${categoryId}":`, error);
    throw error;
  }

  return (data || []).map((row) => ({
    id: row.id,
    title: row.title,
    subtitle: row.subtitle || "",
    heroMedia: { type: row.media_type as "image" | "video", url: row.url },
    media: [
      {
        type: row.media_type as "image" | "video",
        url: row.url,
        thumbnail: row.thumbnail || (row.media_type === "video" ? "/images/brand-logo.png" : row.url),
        subtitle: row.subtitle || "",
      },
    ],
  }));
}

export async function createProduct(
  categoryId: string,
  productMetadata: { title: string; subtitle: string; mediaType: "image" | "video" },
  file?: File
): Promise<Product> {
  if (!supabase) throw new Error("Supabase client not initialized");
  if (!file) throw new Error("No file provided for upload");

  const publicUrl = await uploadProductMedia(file, categoryId);
  const id = `${categoryId}-${Date.now()}`;
  const thumbnail = productMetadata.mediaType === "image" ? publicUrl : "/images/brand-logo.png";

  const { error } = await supabase.from("products").insert({
    id,
    category_id: categoryId,
    title: productMetadata.title,
    subtitle: productMetadata.subtitle,
    media_type: productMetadata.mediaType,
    url: publicUrl,
    thumbnail,
  });

  if (error) throw error;

  return {
    id,
    title: productMetadata.title,
    subtitle: productMetadata.subtitle,
    heroMedia: { type: productMetadata.mediaType, url: publicUrl },
    media: [
      {
        type: productMetadata.mediaType,
        url: publicUrl,
        thumbnail,
        subtitle: productMetadata.subtitle,
      },
    ],
  };
}

export async function deleteProduct(productId: string, _categoryId: string): Promise<void> {
  if (!supabase) throw new Error("Supabase client not initialized");
  const { error } = await supabase.from("products").delete().eq("id", productId);
  if (error) throw error;
}

