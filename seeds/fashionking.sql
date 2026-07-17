-- Settings Seed for Fashion King
INSERT INTO settings (id, site_name, site_sub_name, site_tagline, site_description, seo_title, seo_description, og_title, og_description, phone, phone_formatted, email, address, maps_link, about_title, about_header, about_accent_word, about_subtitle, about_intro, about_paragraph1, about_paragraph2)
VALUES (1, 
  'FASHION KING', 
  'Cloths & Tailoring', 
  'Suit & Sherwani Specialist, Tailoring & Fabrics Exclusive', 
  'Step into the ultimate destination for premium custom tailoring in Beed. We specialize in crafting masterfully fit suits, majestic royal sherwanis, signature kurtas, and curating the finest fabrics.',
  'Fashion King | Suit & Sherwani Specialist Beed | Custom Tailoring',
  'Fashion King in Beed offers exclusive custom tailoring and premium fabrics. Specialized in bespoke wedding sherwanis, groom suits, designer kurtas, and imported suiting materials.',
  'Fashion King | Bespoke Suit & Sherwani Tailor Beed',
  'Exquisite hand-tailored traditional sherwanis, jodhpuri suits, and blazer materials.',
  '+919960434588',
  '+91 99604 34588',
  'contact@fashionkingbeed.com',
  'Takiya Masjid Road, Shahinsha Nagar, Beed, Maharashtra 431122',
  'https://maps.app.goo.gl/sBvFjZnwmzMa6wD59',
  'Maison Heritage',
  'Quality and Style in Hand-Tailoring since 1999',
  'Quality and Style',
  'Our Philosophy',
  'A masterfully tailored garment is a crown of distinction. At Fashion King, every shoulder alignment, collar silhouette, and fabric cut is custom-drafted to match your personal build, posture, and presence.',
  'Located in Beed, Maharashtra, Fashion King has spent over two decades crafting premium western suits and ethnic wedding garments for discerning grooms and gentlemen. Our philosophy centers on creating traditional and modern masterpieces with uncompromising attention to fit, finish, and structural excellence.',
  'We source our luxury wools, linens, and pure raw silks from India''s and Europe''s most renowned mills. Whether you commission a classic double-breasted groom blazer, a designer bandhgala jodhpuri suit, or an heavily embroidered sherwani, we invest hours of meticulous handcrafting to deliver a garment representing confidence, style, and absolute comfort.'
)
ON CONFLICT (id) DO UPDATE SET
  site_name = EXCLUDED.site_name,
  site_sub_name = EXCLUDED.site_sub_name,
  site_tagline = EXCLUDED.site_tagline,
  site_description = EXCLUDED.site_description,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  og_title = EXCLUDED.og_title,
  og_description = EXCLUDED.og_description,
  phone = EXCLUDED.phone,
  phone_formatted = EXCLUDED.phone_formatted,
  email = EXCLUDED.email,
  address = EXCLUDED.address,
  maps_link = EXCLUDED.maps_link,
  about_title = EXCLUDED.about_title,
  about_header = EXCLUDED.about_header,
  about_accent_word = EXCLUDED.about_accent_word,
  about_subtitle = EXCLUDED.about_subtitle,
  about_intro = EXCLUDED.about_intro,
  about_paragraph1 = EXCLUDED.about_paragraph1,
  about_paragraph2 = EXCLUDED.about_paragraph2;

-- Collections Seed
INSERT INTO collections (id, title, price, description, icon, features, image_url, sort_order) VALUES
('bespoke-suit', 'Bespoke Groom Suit', 'Starting from ₹15,000', 'Individually styled and tailored western lounge suits, double-breasted coats, groom blazers, and Tuxedos drafted from your customized measurements.', 'Scissors', ARRAY['Custom blazer & trouser drafting', 'Choice of premium imported suiting materials', 'Individual canvas structured chest lining', 'Includes personalized lapel pins & borders'], '/images/suit-client.png', 10),
('royal-sherwani', 'Royal Wedding Sherwani', 'Starting from ₹25,000', 'Exquisite traditional wedding sherwanis tailored from hand-embroidered raw silk, banarasi silk, and heavy brocade. Custom fitted for grooms.', 'Award', ARRAY['Handmade zardozi and thread embroidery', 'Premium raw silk & jacquard swatches', 'Custom collar embellishments', 'Coordinated inner kurta & matching stole'], '/images/sherwani-client-1.png', 20),
('signature-kurta', 'Designer Kurta & Jodhpuri', 'Starting from ₹5,000', 'Sophisticated bandhgala Jodhpuri suits, designer pathani kurtas, and luxury linen kurtas custom contoured for festive and everyday elegance.', 'Layers', ARRAY['Premium Indian linen and silk materials', 'Hand-stitched sleeve cuffs and collar plackets', 'Perfect fall, posture, and side cut structure', 'Includes customized bottoms (Churidar/Salwar)'], '/images/sherwani-client-2.png', 30),
('fabric-shop', 'Exclusive Fabrics Shop', 'Starting from ₹450 / meter', 'Browse our select collection of imported suiting wools, jacquards, cotton shirtings, and wedding silks from India''s and Italy''s finest mills.', 'Compass', ARRAY['Exclusive Raymond, Reid & Taylor materials', 'Wedding brocades and heavy velvet swatches', 'Premium linen, cotton, and silk shirtings', 'Custom package discounts on fabric + stitching'], '/images/collections-fabric.png', 40)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  features = EXCLUDED.features,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

-- Gallery Seed
INSERT INTO gallery (id, url, alt, sort_order) VALUES
('gallery-1', '/images/suit-client.png', 'Bespoke Groom Jodhpuri Suit in Jet Black', 10),
('gallery-2', '/images/sherwani-client-1.png', 'Royal Ivory Silk Wedding Sherwani with Zardozi Collar', 20),
('gallery-3', '/images/sherwani-client-2.png', 'Embroidered Cream Sherwani and Kurta Ensemble', 30)
ON CONFLICT (id) DO UPDATE SET
  url = EXCLUDED.url,
  alt = EXCLUDED.alt,
  sort_order = EXCLUDED.sort_order;

-- Testimonials Seed
INSERT INTO testimonials (id, client_name, client_image, review_text, rating, sort_order) VALUES
(1, 'Marcus Sterling', '/images/suit-client.png', 'The Jodhpuri suit fitting was absolutely flawless. They took the time to map my posture and the result was incredibly comfortable.', 5, 10)
ON CONFLICT (id) DO UPDATE SET
  client_name = EXCLUDED.client_name,
  client_image = EXCLUDED.client_image,
  review_text = EXCLUDED.review_text,
  rating = EXCLUDED.rating,
  sort_order = EXCLUDED.sort_order;

-- Services Seed
INSERT INTO services (id, title, price, description, icon, features, sort_order) VALUES
('visiting-tailor', 'Visiting Tailor Service', 'On Demand', 'A private fitting consultant travels directly to your residence or hotel in Beed district to measure and consult on wedding packages.', 'Users', ARRAY['Private measuring session at your home', 'Complete fabric swatches brought to you', 'Saves time for busy grooms'], 10)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  features = EXCLUDED.features,
  sort_order = EXCLUDED.sort_order;
