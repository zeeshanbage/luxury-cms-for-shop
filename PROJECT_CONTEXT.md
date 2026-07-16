# Project Context: Fashion King

Welcome to **Fashion King**, a premium e-commerce showcase, lookbook, and content management web application for a luxury tailoring house based in Beed, Maharashtra, India. 

This document serves as the single source of truth for the project's architecture, stack, design rules, and file mapping, allowing any developer or AI assistant to quickly understand the codebase.

---

## 1. Domain & Core Features
- **Brand**: Fashion King (founded in 1999) — specializing in bespoke suits, royal wedding sherwanis, signature designer kurtas, and premium fabric curation.
- **Clientele**: Elite grooms and gentlemen seeking high-quality custom-crafted traditional and modern suits.
- **Key Features**:
  - **Immersive Lookbook & Gallery**: Categorized showcases of suits, sherwanis, kurtas, and fabrics with smooth transition lightboxes.
  - **Dynamic Settings & Config**: Live theme injection, contact info, business hours, and SEO metadata update dynamically.
  - **Hybrid Database System**: Uses **Supabase** for live data (settings, products, collections, gallery, testimonials) and seamlessly falls back to **LocalStorage** (for mutations) and static **configuration JSON/TS files** (for reads) if Supabase is offline or unconfigured.
  - **Secret Admin Panel**: Located at `/admin` (not linked in the main navigation) to upload/delete product listings, view database status, and manage collections.

---

## 2. Technology Stack
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: TailwindCSS (v3) + custom utility declarations in [src/index.css](file:///c:/Users/zeesh/.gemini/antigravity-ide/scratch/luxury-tailor-web/src/index.css).
- **Animations**: Framer Motion (for premium parallax scroll, hover micro-animations, slide-ins, and lightboxes).
- **Icons**: Lucide React.
- **Data Querying**: `@tanstack/react-query` (React Query) with custom caching (10 mins staleTime for static data, 2 mins for products).
- **Backend & Database**: Supabase JS Client (`@supabase/supabase-js`).
- **Routing**: `react-router-dom` (using `createBrowserRouter` in [router.tsx](file:///c:/Users/zeesh/.gemini/antigravity-ide/scratch/luxury-tailor-web/src/config/router.tsx)).

---

## 3. Directory Structure Map
```text
luxury-tailor-web/
├── .agents/                   # IDE custom agent rules and configs
│   └── AGENTS.md              # Project-scoped guidelines loaded by coding agents
├── public/
│   ├── data/                  # Local fallback datasets (read when Supabase is unconfigured)
│   │   ├── suits.json         # Lookbook entries for Suits
│   │   ├── sherwani.json      # Lookbook entries for Sherwanis
│   │   ├── kurta.json         # Lookbook entries for Kurtas
│   │   └── fabrics.json       # Lookbook entries for Fabrics
│   └── images/                # Static asset placeholders and lookbook assets
├── src/
│   ├── assets/                # App asset imports
│   ├── components/            # Reusable UI components
│   │   └── ui/
│   │       └── LuxuryButton.tsx   # Premium gold-bordered button with hover animations
│   ├── config/                # Central application fallback configurations
│   │   ├── collections.ts     # Core categories and pricing catalog
│   │   ├── contact.ts         # Showroom phone, email, address, and maps
│   │   ├── images.ts          # Default public URLs for models and products
│   │   ├── router.tsx         # Routing definitions (/, /contact, /admin)
│   │   ├── site.ts            # Core SEO text, philosophical copy, values, and features
│   │   ├── social.ts          # WhatsApp, Instagram, and other social media links
│   │   └── theme.ts           # Hex code parameters for colors (primary, hover, bg, etc.)
│   ├── hooks/                 # Custom React hooks
│   │   ├── useDbQueries.ts    # React Query wrappers for database fetching
│   │   └── useScroll.ts       # Page scroll direction and position listener
│   ├── layouts/
│   │   └── MainLayout.tsx     # Base template containing header nav, background glow, and footer
│   ├── pages/
│   │   ├── Home.tsx           # Immersive parallax hero, brand philosophy, Lookbook grid, and testimonials
│   │   ├── Contact.tsx        # Business hours, interactive map link, and quick WhatsApp action
│   │   ├── AdminPanel.tsx     # Content uploads, item deletion, and database status check
│   │   └── NotFound.tsx       # Luxury 404 fallback page
│   ├── services/              # External integrations
│   │   ├── db.ts              # Core database service (interfaces with Supabase / falls back to local)
│   │   ├── supabase.ts        # Supabase client instantiation and connection check
│   │   └── analytics.ts       # Basic user analytics / interaction logger
│   ├── types/
│   │   └── db.ts              # TypeScript interfaces for Settings, Collections, Products, etc.
│   ├── utils/
│   │   └── image.ts           # Helper to resolve image paths (local vs. remote)
│   ├── App.tsx                # App entrypoint (injects theme variables and dynamic SEO)
│   ├── index.css              # Main stylesheets (imports fonts, configures Tailwind, sets custom transitions)
│   └── main.tsx               # DOM renderer
├── supabase_schema.sql        # Database initialization script (tables: settings, collections, gallery, etc.)
├── tailwind.config.js         # Custom brand colors (luxury-gold, luxury-black) and font definitions
└── vite.config.ts             # Vite bundler configs with import alias (@ -> /src)
```

---

## 4. Architecture: Database & Local Fallback Mode
The application implements a unique hybrid mode. If the environment variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are not provided in `.env`, the application automatically runs in local fallback mode:
- **Queries (Getters)**: Functions in [db.ts](file:///c:/Users/zeesh/.gemini/antigravity-ide/scratch/luxury-tailor-web/src/services/db.ts) catch database errors and return values defined in static configuration files inside `src/config/`.
- **Products**: Local product lists are read from and written to browser `localStorage` under keys like `fashionking_products_<category_id>`. Lookbook items fallback to base64 encoding inside `localStorage` for media files when uploading without Supabase.
- **Dynamic SEO and Theme**: In [App.tsx](file:///c:/Users/zeesh/.gemini/antigravity-ide/scratch/luxury-tailor-web/src/App.tsx), theme parameters from `src/config/theme.ts` are injected into CSS root properties on mount. Dynamic headers (document title and meta description) are bound to the values fetched from the `settings` database table or local site configuration.

---

## 5. Design System & Aesthetics
To preserve the brand's luxury positioning, always follow these rules during UI enhancements:
1. **Fonts**:
   - Headings (`<h1>` - `<h6>`): `Cormorant Garamond` or `Playfair Display` (serif) for a regal, classic feel.
   - Body & Controls: `Outfit` or `Inter` (sans-serif) for clean readability.
2. **Colors**:
   - Backgrounds: Dark charcoal `#030303` (pure blacks and deep values). Avoid solid gray `#333` or `#666`. Use the custom Tailwind configurations:
     - `bg-luxury-black` (`#030303`)
     - `bg-luxury-charcoal` (`#0c0c0e`)
   - Accent / Gold: Metallic luxury gold `#C5A880`. Never use bright yellow `#FFD700`.
   - Hover elements should fade softly towards primary colors or display ambient shadows using the custom glow properties:
     - `var(--shadow-glow-color)`
     - `var(--ambient-glow-color)`
3. **Glassmorphism**:
   - Use Tailwind utility classes like `glass-nav` and `glass-card` (configured in `index.css`) for floating elements, panels, and input fields.
   - Card items should utilize `glass-card-hover` to animate borders and apply custom drop shadow glows upon hover.

---

## 6. How to Develop & Test
1. **Local Server**:
   ```bash
   npm run dev
   ```
2. **Production Build & Lint**:
   ```bash
   npm run build
   ```
   *Note: Oxlint is configured in `.oxlintrc.json` for lightweight linting. Ensure typescript compiling parses clean without warnings.*
3. **Database Setup**:
   The migration file `supabase_schema.sql` contains the queries to build all tables (with RLS policies and table triggers) directly on Supabase.
