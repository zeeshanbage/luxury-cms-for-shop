-- ============================================================
-- Supabase Schema: Fashion King / Seema Sarees (Multi-client)
-- ============================================================
--
-- ⚠️  MANDATORY RLS RULE — READ BEFORE ADDING ANY TABLE ⚠️
--
-- The Supabase portal has Row Level Security (RLS) ENABLED BY DEFAULT.
-- This means: when you create a new table, ALL writes (INSERT / UPDATE / DELETE)
-- are silently blocked for the anon key unless you add explicit policies.
-- The API returns 204 No Content as if it succeeded — but NOTHING is saved.
--
-- CHECKLIST FOR EVERY NEW TABLE:
--   1. Add the table definition (CREATE TABLE IF NOT EXISTS ...)
--   2. Enable RLS:     ALTER TABLE <table_name> ENABLE ROW LEVEL SECURITY;
--   3. Add a SELECT policy (public read):
--        CREATE POLICY "Allow public select" ON <table_name> FOR SELECT TO public USING (true);
--   4. If the app writes to this table, also add:
--        CREATE POLICY "Allow public insert" ON <table_name> FOR INSERT TO public WITH CHECK (true);
--        CREATE POLICY "Allow public update" ON <table_name> FOR UPDATE TO public USING (true) WITH CHECK (true);
--        CREATE POLICY "Allow public delete" ON <table_name> FOR DELETE TO public USING (true);
--
-- Use the safe DO $$ BEGIN ... END $$; pattern (shown below) so re-running the
-- migration does NOT throw "policy already exists" errors.
--
-- DEBUGGING TIP: If a write returns 204 but the DB is unchanged, run:
--   SELECT tablename, policyname, cmd FROM pg_policies WHERE tablename = '<table_name>';
-- Missing rows = missing policy = silent block.
-- ============================================================

-- Migration file to set up Fashion King / Seema Sarees tables on Supabase

-- 1. SETTINGS TABLE
CREATE TABLE IF NOT EXISTS settings (
    id SERIAL PRIMARY KEY,
    site_name VARCHAR(100) NOT NULL DEFAULT 'FASHION KING',
    site_sub_name VARCHAR(100) NOT NULL DEFAULT 'Cloths & Tailoring',
    site_tagline VARCHAR(255) NOT NULL DEFAULT 'Suit & Sherwani Specialist, Tailoring & Fabrics Exclusive',
    site_description TEXT NOT NULL DEFAULT 'Step into the ultimate destination for premium custom tailoring in Beed. We specialize in crafting masterfully fit suits, majestic royal sherwanis, signature kurtas, and curating the finest fabrics.',
    seo_title VARCHAR(255) NOT NULL DEFAULT 'Fashion King | Suit & Sherwani Specialist Beed | Custom Tailoring',
    seo_description TEXT NOT NULL DEFAULT 'Fashion King in Beed offers exclusive custom tailoring and premium fabrics. Specialized in bespoke wedding sherwanis, groom suits, designer kurtas, and imported suiting materials.',
    og_title VARCHAR(255) NOT NULL DEFAULT 'Fashion King | Bespoke Suit & Sherwani Tailor Beed',
    og_description TEXT NOT NULL DEFAULT 'Exquisite hand-tailored traditional sherwanis, jodhpuri suits, and blazer materials.',
    founded_year INT NOT NULL DEFAULT 1999,
    
    -- Contact parameters
    phone VARCHAR(50) NOT NULL DEFAULT '+919960434588',
    phone_formatted VARCHAR(50) NOT NULL DEFAULT '+91 99604 34588',
    email VARCHAR(100) NOT NULL DEFAULT 'contact@fashionkingbeed.com',
    address VARCHAR(255) NOT NULL DEFAULT 'Takiya Masjid Road, Shahinsha Nagar, Beed, Maharashtra 431122',
    maps_link TEXT NOT NULL DEFAULT 'https://maps.app.goo.gl/RQy6UNGJWvTJuBu5A',
    
    -- About Page details
    about_title VARCHAR(100) NOT NULL DEFAULT 'Maison Heritage',
    about_header TEXT NOT NULL DEFAULT 'Quality and Style in Hand-Tailoring since 1999',
    about_accent_word VARCHAR(100) NOT NULL DEFAULT 'Quality and Style',
    about_subtitle VARCHAR(100) NOT NULL DEFAULT 'Our Philosophy',
    about_intro TEXT NOT NULL DEFAULT 'A masterfully tailored garment is a crown of distinction. At Fashion King, every shoulder alignment, collar silhouette, and fabric cut is custom-drafted to match your personal build, posture, and presence.',
    about_paragraph1 TEXT NOT NULL DEFAULT 'Located in Beed, Maharashtra, Fashion King has spent over two decades crafting premium western suits and ethnic wedding garments for discerning grooms and gentlemen. Our philosophy centers on creating traditional and modern masterpieces with uncompromising attention to fit, finish, and structural excellence.',
    about_paragraph2 TEXT NOT NULL DEFAULT 'We source our luxury wools, linens, and pure raw silks from India''s and Europe''s most renowned mills. Whether you commission a classic double-breasted groom blazer, a designer bandhgala jodhpuri suit, or an heavily embroidered sherwani, we invest hours of meticulous handcrafting to deliver a garment representing confidence, style, and absolute comfort.',
    
    -- JSON metadata fields for structured sub-objects
    business_hours JSONB NOT NULL DEFAULT '[
      {"days": "Monday — Saturday", "hours": "10:00 AM — 09:30 PM"},
      {"days": "Sunday", "hours": "11:00 AM — 09:00 PM"},
      {"days": "Weekly Holiday", "hours": "Open Seven Days", "highlight": true}
    ]'::jsonb,
    socials JSONB NOT NULL DEFAULT '{
      "instagram": "https://instagram.com/fashion_king_beed",
      "whatsapp": "https://wa.me/919960434588?text=Hello%20Fashion%20King%2C%20I%20would%20like%20to%20enquire%20about%20a%20custom%20suit%20or%20sherwani%20commission.",
      "twitter": "https://twitter.com/fashionkingbeed",
      "facebook": "https://facebook.com/fashionkingbeed",
      "linkedin": "https://linkedin.com/company/fashion-king-beed"
    }'::jsonb,
    pillars JSONB NOT NULL DEFAULT '[
      {
        "icon": "Award",
        "title": "Bespoke Specialization",
        "description": "As suit and sherwani specialists, we individually construct patterns to deliver the definitive standard in western silhouettes and traditional groom wear."
      },
      {
        "icon": "ShieldCheck",
        "title": "Premium Fabrics",
        "description": "We house an exclusive collection of imported wools, raw silks, jacquards, and linen bolts from the world''s most prestigious textile houses."
      },
      {
        "icon": "HeartHandshake",
        "title": "Quality Customization",
        "description": "Every commission is an collaborative consultation, ensuring personalized cuffs, collars, custom brooches, and perfect comfort tailored to your timeline."
      }
    ]'::jsonb,
    teaser_features JSONB NOT NULL DEFAULT '[
      {
        "icon": "Scissors",
        "title": "Custom Cut",
        "description": "Precise measurements and customized baste fittings ensure flawless shoulder draping."
      },
      {
        "icon": "Compass",
        "title": "Exclusive Fabrics",
        "description": "An elite catalog of premium suitings, shirtings, and wedding jacquards."
      },
      {
        "icon": "Award",
        "title": "Groom Wear Art",
        "description": "Specialized hand-embellished zardozi borders, button plackets, and matching brooches."
      }
    ]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. COLLECTIONS TABLE
CREATE TABLE IF NOT EXISTS collections (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    price VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(50) NOT NULL,
    features TEXT[] NOT NULL,
    image_url TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. GALLERY TABLE
CREATE TABLE IF NOT EXISTS gallery (
    id VARCHAR(100) PRIMARY KEY,
    url TEXT NOT NULL,
    alt VARCHAR(255) NOT NULL,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. TESTIMONIALS TABLE
CREATE TABLE IF NOT EXISTS testimonials (
    id SERIAL PRIMARY KEY,
    client_name VARCHAR(100) NOT NULL,
    client_image TEXT NOT NULL,
    review_text TEXT NOT NULL,
    rating INT DEFAULT 5,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. SERVICES TABLE (Additional custom tailoring service options)
CREATE TABLE IF NOT EXISTS services (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    price VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(50) NOT NULL,
    features TEXT[] NOT NULL,
    image_url TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. PRODUCTS TABLE (Admin-uploaded lookbook / collection campaign items)
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(100) PRIMARY KEY,
    category_id VARCHAR(100) NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    media_type VARCHAR(50) NOT NULL, -- 'image' or 'video'
    url TEXT NOT NULL,
    thumbnail TEXT,
    sort_order INT DEFAULT 0,
    media JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Note: Ensure to create a public storage bucket named "products" in the Supabase console.

-- 7. AUTOMATED STORAGE BUCKETS SETUP
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- Setup storage policies safely using a PL/pgSQL block to prevent duplicate errors
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Public Access'
    ) THEN
        CREATE POLICY "Public Access" ON storage.objects FOR SELECT TO public USING (bucket_id = 'products');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Public Upload'
    ) THEN
        CREATE POLICY "Public Upload" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'products');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Public Delete'
    ) THEN
        CREATE POLICY "Public Delete" ON storage.objects FOR DELETE TO public USING (bucket_id = 'products');
    END IF;
END
$$;

-- 8. TABLE ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Setup SELECT policies safely using a PL/pgSQL block to prevent duplicate errors
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'settings' AND policyname = 'Allow public select') THEN
        CREATE POLICY "Allow public select" ON settings FOR SELECT TO public USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'collections' AND policyname = 'Allow public select') THEN
        CREATE POLICY "Allow public select" ON collections FOR SELECT TO public USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'gallery' AND policyname = 'Allow public select') THEN
        CREATE POLICY "Allow public select" ON gallery FOR SELECT TO public USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'testimonials' AND policyname = 'Allow public select') THEN
        CREATE POLICY "Allow public select" ON testimonials FOR SELECT TO public USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'services' AND policyname = 'Allow public select') THEN
        CREATE POLICY "Allow public select" ON services FOR SELECT TO public USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Allow public select') THEN
        CREATE POLICY "Allow public select" ON products FOR SELECT TO public USING (true);
    END IF;
END
$$;

-- Setup WRITE policies for products table safely using a PL/pgSQL block
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Allow public insert') THEN
        CREATE POLICY "Allow public insert" ON products FOR INSERT TO public WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Allow public update') THEN
        CREATE POLICY "Allow public update" ON products FOR UPDATE TO public USING (true) WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Allow public delete') THEN
        CREATE POLICY "Allow public delete" ON products FOR DELETE TO public USING (true);
    END IF;
END
$$;

-- Setup WRITE policies for collections table safely using a PL/pgSQL block
-- NOTE: Without these, Supabase silently returns 204 but does NOT mutate any rows.
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'collections' AND policyname = 'Allow public insert') THEN
        CREATE POLICY "Allow public insert" ON collections FOR INSERT TO public WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'collections' AND policyname = 'Allow public update') THEN
        CREATE POLICY "Allow public update" ON collections FOR UPDATE TO public USING (true) WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'collections' AND policyname = 'Allow public delete') THEN
        CREATE POLICY "Allow public delete" ON collections FOR DELETE TO public USING (true);
    END IF;
END
$$;

-- Setup WRITE policies for settings table safely using a PL/pgSQL block
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'settings' AND policyname = 'Allow public insert') THEN
        CREATE POLICY "Allow public insert" ON settings FOR INSERT TO public WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'settings' AND policyname = 'Allow public update') THEN
        CREATE POLICY "Allow public update" ON settings FOR UPDATE TO public USING (true) WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'settings' AND policyname = 'Allow public delete') THEN
        CREATE POLICY "Allow public delete" ON settings FOR DELETE TO public USING (true);
    END IF;
END
$$;

