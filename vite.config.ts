import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const CLIENT_DEFAULTS: Record<string, Record<string, string>> = {
  fashionking: {
    VITE_SEO_TITLE: "Fashion King | Men's Tailoring & Fabrics | Syed Siddik",
    VITE_SEO_DESCRIPTION: "Fashion King by Syed Siddik — Suit & sherwani specialist, tailoring & fabrics exclusive. Address: Takiya masjid road, Shahinsha nagar, Beed - 431122, Maharashtra. WhatsApp: +91 9960434588.",
    VITE_OG_TITLE: "Fashion King — Men's Tailoring & Fabrics",
    VITE_OG_DESCRIPTION: "Suit & sherwani specialist, tailoring & fabrics exclusive by Syed Siddik. Address: Takiya masjid road, Shahinsha nagar, Beed - 431122, Maharashtra. WhatsApp: +91 9960434588.",
    VITE_OG_URL: "https://fashionking-beed.vercel.app/",
    VITE_OG_IMAGE: "https://fashionking-beed.vercel.app/images/brand-logo.png",
    VITE_OG_SITE_NAME: "Fashion King",
    VITE_FAVICON_HREF: "/images/brand-logo.png",
  },
  seemasarees: {
    VITE_SEO_TITLE: "Seema Sarees Beed | Wholesale & Retail Sarees & Ladies Suits",
    VITE_SEO_DESCRIPTION: "Discover an exquisite collection of ladies suits, fancy dress materials, designer sarees, and premium burqas at Seema Saree Center in Beed. Wholesale & retail. Address: Seema saree center, Karanja Rd, Bir, Beed, Maharashtra 431122. Phone: +91 89837 91615.",
    VITE_OG_TITLE: "Seema Sarees Beed | Premium Sarees & Dress Materials",
    VITE_OG_DESCRIPTION: "Stunning traditional sarees, designer suits, unstitched dress materials, and elegant burqas at Seema Saree Center. Address: Seema saree center, Karanja Rd, Bir, Beed, Maharashtra 431122. Phone: +91 89837 91615.",
    VITE_OG_URL: "https://seema-saree-center.vercel.app/",
    VITE_OG_IMAGE: "https://seema-saree-center.vercel.app/images/seemasarees-logo.png",
    VITE_OG_SITE_NAME: "Seema Saree Center",
    VITE_FAVICON_HREF: "/images/seemasarees-logo.png",
  },
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const clientKey = (env.VITE_ACTIVE_CLIENT || process.env.VITE_ACTIVE_CLIENT || 'fashionking').toLowerCase();
  const defaults = CLIENT_DEFAULTS[clientKey] || CLIENT_DEFAULTS.fashionking;

  // Supply default env vars if not explicitly set in Vercel environment
  for (const [key, val] of Object.entries(defaults)) {
    if (!process.env[key] && !env[key]) {
      process.env[key] = val;
    }
  }

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    envPrefix: ['VITE_', 'SUPABASE_'],
    css: {
      devSourcemap: true,
    },
    build: {
      sourcemap: true,
    },
  };
});
