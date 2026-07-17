import * as fashionKingSite from "./clients/fashionking/site";
import * as fashionKingContact from "./clients/fashionking/contact";
import * as fashionKingSocial from "./clients/fashionking/social";
import * as fashionKingTheme from "./clients/fashionking/theme";
import * as fashionKingImages from "./clients/fashionking/images";
import * as fashionKingCollections from "./clients/fashionking/collections";

import * as seemaSareesSite from "./clients/seemasarees/site";
import * as seemaSareesContact from "./clients/seemasarees/contact";
import * as seemaSareesSocial from "./clients/seemasarees/social";
import * as seemaSareesTheme from "./clients/seemasarees/theme";
import * as seemaSareesImages from "./clients/seemasarees/images";
import * as seemaSareesCollections from "./clients/seemasarees/collections";


interface ClientConfig {
  site: typeof fashionKingSite.siteConfig;
  contact: typeof fashionKingContact.contactConfig;
  social: typeof fashionKingSocial.socialConfig;
  theme: typeof fashionKingTheme.themeConfig;
  images: {
    baseUrl: string;
    logo: string;
    heroImages: {
      teaserHero: string;
      storefront: string;
    };
    collections: Record<string, string>;
    workGallery: { id: string; url: string; alt: string }[];
    fabrics: { name: string; url: string }[];
    testimonials: { clientName: string; clientImage: string; reviewText?: string }[];
  };
  collections: typeof fashionKingCollections.collectionsConfig;
}

const clientConfigs: Record<string, ClientConfig> = {
  fashionking: {
    site: fashionKingSite.siteConfig,
    contact: fashionKingContact.contactConfig,
    social: fashionKingSocial.socialConfig,
    theme: fashionKingTheme.themeConfig,
    images: fashionKingImages.imageConfig,
    collections: fashionKingCollections.collectionsConfig,
  },
  seemasarees: {
    site: seemaSareesSite.siteConfig,
    contact: seemaSareesContact.contactConfig,
    social: seemaSareesSocial.socialConfig,
    theme: seemaSareesTheme.themeConfig,
    images: seemaSareesImages.imageConfig,
    collections: seemaSareesCollections.collectionsConfig,
  },
};

const activeClient = import.meta.env.VITE_ACTIVE_CLIENT || "fashionking";
export const activeClientName = activeClient.toLowerCase();
export const activeClientConfig = clientConfigs[activeClientName] || clientConfigs.fashionking;
