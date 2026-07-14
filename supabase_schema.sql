-- Migration file to set up Fashion King Beed showroom tables on Supabase

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

-- SEED MOCK DATA

-- Settings Seed
INSERT INTO settings (id, site_name, site_sub_name) 
VALUES (1, 'FASHION KING', 'Cloths & Tailoring') 
ON CONFLICT (id) DO NOTHING;

-- Collections Seed
INSERT INTO collections (id, title, price, description, icon, features, image_url, sort_order) VALUES
('bespoke-suit', 'Bespoke Groom Suit', 'Starting from ₹15,000', 'Individually styled and tailored western lounge suits, double-breasted coats, groom blazers, and Tuxedos drafted from your customized measurements.', 'Scissors', ARRAY['Custom blazer & trouser drafting', 'Choice of premium imported suiting materials', 'Individual canvas structured chest lining', 'Includes personalized lapel pins & borders'], '/images/suit-client.png', 10),
('royal-sherwani', 'Royal Wedding Sherwani', 'Starting from ₹25,000', 'Exquisite traditional wedding sherwanis tailored from hand-embroidered raw silk, banarasi silk, and heavy brocade. Custom fitted for grooms.', 'Award', ARRAY['Handmade zardozi and thread embroidery', 'Premium raw silk & jacquard swatches', 'Custom collar embellishments', 'Coordinated inner kurta & matching stole'], '/images/sherwani-client-1.png', 20),
('signature-kurta', 'Designer Kurta & Jodhpuri', 'Starting from ₹5,000', 'Sophisticated bandhgala Jodhpuri suits, designer pathani kurtas, and luxury linen kurtas custom contoured for festive and everyday elegance.', 'Layers', ARRAY['Premium Indian linen and silk materials', 'Hand-stitched sleeve cuffs and collar plackets', 'Perfect fall, posture, and side cut structure', 'Includes customized bottoms (Churidar/Salwar)'], '/images/sherwani-client-2.png', 30),
('fabric-shop', 'Exclusive Fabrics Shop', 'Starting from ₹450 / meter', 'Browse our select collection of imported suiting wools, jacquards, cotton shirtings, and wedding silks from India''s and Italy''s finest mills.', 'Compass', ARRAY['Exclusive Raymond, Reid & Taylor materials', 'Wedding brocades and heavy velvet swatches', 'Premium linen, cotton, and silk shirtings', 'Custom package discounts on fabric + stitching'], '/images/collections-fabric.png', 40)
ON CONFLICT (id) DO NOTHING;

-- Gallery Seed
INSERT INTO gallery (id, url, alt, sort_order) VALUES
('gallery-1', '/images/suit-client.png', 'Bespoke Groom Jodhpuri Suit in Jet Black', 10),
('gallery-2', '/images/sherwani-client-1.png', 'Royal Ivory Silk Wedding Sherwani with Zardozi Collar', 20),
('gallery-3', '/images/sherwani-client-2.png', 'Embroidered Cream Sherwani and Kurta Ensemble', 30)
ON CONFLICT (id) DO NOTHING;

-- Testimonials Seed
INSERT INTO testimonials (id, client_name, client_image, review_text, rating, sort_order) VALUES
(1, 'Marcus Sterling', '/images/suit-client.png', 'The Jodhpuri suit fitting was absolutely flawless. They took the time to map my posture and the result was incredibly comfortable.', 5, 10)
ON CONFLICT (id) DO NOTHING;

-- Services Seed
INSERT INTO services (id, title, price, description, icon, features, sort_order) VALUES
('visiting-tailor', 'Visiting Tailor Service', 'On Demand', 'A private fitting consultant travels directly to your residence or hotel in Beed district to measure and consult on wedding packages.', 'Users', ARRAY['Private measuring session at your home', 'Complete fabric swatches brought to you', 'Saves time for busy grooms'], 10)
ON CONFLICT (id) DO NOTHING;
