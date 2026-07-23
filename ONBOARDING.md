# Client Onboarding Guide

Follow this guide to configure and launch the website for a new business/client.

## Prerequisites
- Node.js (v18+)
- A Supabase project

---

## Step 1: Add Environment Configuration
Create a new file in the root folder named `.env.[client_name]` (e.g. `.env.seemasarees`). Populate it with the database credentials from Supabase:

```env
SUPABASE_URL=https://<project-id>.supabase.co
SUPABASE_PUBLISHABLE_KEY=<anon-key>
SUPABASE_SECRET_KEY=<service-role-key>
CONENCTION_STRING=postgresql://postgres:[<your-db-password>]@db.<project-id>.supabase.co:5432/postgres
VITE_ACTIVE_CLIENT=<client_name>
```

---

## Step 2: Create Static Config Fallback Files
Create a client configuration directory under `src/config/clients/[client_name]/` and create the following files to specify the fallback data when Supabase is offline:

- `site.ts`: SEO copy, philosophies, and taglines.
- `contact.ts`: Telephone numbers, address, and business hours.
- `social.ts`: WhatsApp, Instagram, and other social media handles.
- `theme.ts`: Hex branding colors (gold colors, backgrounds, cards, etc.).
- `images.ts`: Path configuration for static fallback images (suits, sarees, fabrics, logos, default reviews).
- `collections.ts`: Tab catalog names, features, pricing, and icons.

*(Tip: Copy the files from `src/config/clients/fashionking/` or `src/config/clients/seemasarees/` and update their values.)*

---

## Step 3: Register the Client in the Resolver
Open [src/config/activeClient.ts](file:///c:/Users/zeesh/.gemini/antigravity-ide/scratch/luxury-tailor-web/src/config/activeClient.ts) and:
1. Import the client's configuration modules.
2. Add the client's configurations mapping to the `clientConfigs` object.

---

## Step 4: Add Seeding Data
Create a new database seed script under `seeds/[client_name].sql` to define the default setup rows (Settings, Collections, Gallery, Testimonials, Services).

*(Tip: Copy `seeds/seemasarees.sql` as a template and customize the content.)*

---

## Step 5: Initialize the Environment
Run the client setup command to configure the current active client env:
```bash
node scripts/setup-client.js [client_name]
```

---

## Step 6: Create Database Tables, Storage Buckets, and Seed Data
Run the database setup script to apply table migrations, automatically initialize the public 'products' storage bucket with its RLS security policies, and seed the database:
```bash
node scripts/db-setup.js
```

---

## Step 7: Launch or Build
Run the development environment or build the production bundle:
```bash
# Development
npm run dev

# Production Build
node node_modules/typescript/bin/tsc -b; node node_modules/vite/bin/vite.js build
```
The website will adapt automatically, displaying all configurations, logos, colors, and lookbooks of the active client.

---

## Separate Vercel Projects Deployment Guide

To deploy separate websites for each client on Vercel, you should create a separate Vercel project for each client. Both projects will link to the **same** GitHub repository, but you will configure different Environment Variables in each project.

### Step 1: Create a Vercel Project for the Client
1. Log in to Vercel and click **Add New > Project**.
2. Import your GitHub repository.
3. Name your project (e.g. `fashion-king-beed` or `seema-sarees-center`).

### Step 2: Configure Environment Variables
In the **Environment Variables** section of the Vercel project configuration, add the following variables:

#### For the Seema Sarees Project (`seemasareecenter.vercel.app`):
- `VITE_ACTIVE_CLIENT` = `seemasarees`
- `VITE_SUPABASE_URL` = `https://gfxskzrmfncolffwefge.supabase.co`
- `VITE_SUPABASE_ANON_KEY` = `key`

#### For the Fashion King Project:
- `VITE_ACTIVE_CLIENT` = `fashionking`
- `VITE_SUPABASE_URL` = `https://jfwycmxmijssvoubedfv.supabase.co`
- `VITE_SUPABASE_ANON_KEY` = `key`

### Step 3: Configure Build Command & Output
- **Framework Preset**: Vite
- **Build Command**: `tsc -b && vite build`
- **Output Directory**: `dist`
- Click **Deploy**.

---

### Advantages:
- **Optimized Bundles**: Because the active client is resolved at compile time, Vite automatically tree-shakes and completely strips the configurations and assets of all other clients from the final build bundle, improving speed and performance.
- **Isolated Environments**: Each client has their own isolated Vercel project, deployment pipeline, custom domains, and settings.
