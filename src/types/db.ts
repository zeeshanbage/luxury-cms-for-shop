export interface BusinessHour {
  days: string;
  hours: string;
  highlight?: boolean;
}

export interface SocialConfig {
  instagram: string;
  whatsapp: string;
  twitter?: string;
  facebook?: string;
  linkedin?: string;
}

export interface ValuePillar {
  icon: string;
  title: string;
  description: string;
}

export interface TeaserFeature {
  icon: string;
  title: string;
  description: string;
}

export interface DbSettings {
  id?: number;
  site_name: string;
  site_sub_name: string;
  site_tagline: string;
  site_description: string;
  seo_title: string;
  seo_description: string;
  og_title: string;
  og_description: string;
  founded_year: number;
  
  // Contact details
  phone: string;
  phone_formatted: string;
  email: string;
  address: string;
  maps_link: string;
  
  // About Page details
  about_title: string;
  about_header: string;
  about_accent_word: string;
  about_subtitle: string;
  about_intro: string;
  about_paragraph1: string;
  about_paragraph2: string;
  
  // JSONB structures
  business_hours: BusinessHour[];
  socials: SocialConfig;
  pillars: ValuePillar[];
  teaser_features: TeaserFeature[];
}

export interface DbCollection {
  id: string;
  title: string;
  price: string;
  description: string;
  icon: string;
  features: string[];
  image_url?: string;
  sort_order?: number;
}

export interface DbGallery {
  id: string;
  url: string;
  alt: string;
  sort_order?: number;
}

export interface DbTestimonial {
  id?: number;
  client_name: string;
  client_image: string;
  review_text: string;
  rating: number;
  sort_order?: number;
}

export interface DbService {
  id: string;
  title: string;
  price: string;
  description: string;
  icon: string;
  features: string[];
  image_url?: string;
  sort_order?: number;
}

export interface MediaItem {
  type: "image" | "video";
  url: string;
  thumbnail: string;
  subtitle: string;
}

export interface Product {
  id: string;
  title: string;
  subtitle: string;
  heroMedia: { type: "image" | "video"; url: string };
  media: MediaItem[];
  uniqueId?: string;
}

