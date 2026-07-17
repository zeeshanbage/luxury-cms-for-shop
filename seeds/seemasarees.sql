-- Settings Seed for Seema Sarees Beed
INSERT INTO settings (id, site_name, site_sub_name, site_tagline, site_description, seo_title, seo_description, og_title, og_description, phone, phone_formatted, email, address, maps_link, about_title, about_header, about_accent_word, about_subtitle, about_intro, about_paragraph1, about_paragraph2)
VALUES (1, 
  'SEEMA SAREES BEED', 
  'Wholesale & Retail', 
  'Ladies Suits, Dress Materials, Sarees & Burqas', 
  'Step into Seema Sarees, your premier destination for the finest ladies suits, designer dress materials, exclusive sarees, and custom-tailored burqas/abayas in Beed, Maharashtra.',
  'Seema Sarees Beed | Wholesale & Retail Sarees & Ladies Suits',
  'Discover an exquisite collection of ladies suits, fancy dress materials, designer sarees, and premium burqas at Seema Saree Center in Beed. Premium fabrics, wholesale rates, and retail excellence.',
  'Seema Sarees Beed | Premium Sarees & Dress Materials',
  'Stunning traditional sarees, designer suits, unstitched dress materials, and elegant burqas at Seema Saree Center.',
  '+918983791615',
  '+91 89837 91615',
  'contact@seemasareesbeed.com',
  'Seema saree center, Karanja Rd, Bir, Beed, Maharashtra 431122',
  'https://maps.app.goo.gl/T3qXZPbe8FncukDn7',
  'Seema Heritage',
  'Elegance and Quality in Ladies Fashion since 2005',
  'Elegance and Quality',
  'Our Curation',
  'A beautiful outfit is an expression of grace and heritage. At Seema Sarees, we carefully curate the finest fabrics, intricate embroidery, and luxurious textiles to match your style and occasion.',
  'Located in the heart of Beed, Maharashtra, Seema Saree Center has spent over a decade offering the finest collection of traditional sarees, wedding dress materials, and customized abayas. Our showroom is trusted by thousands of families for both wholesale shopping and premium retail selection.',
  'From luxurious Banarasi and Kanjivaram sarees to comfortable cotton dress materials and modern modest wear, we bring you designs from the country''s top weaving and fashion hubs. We believe in providing uncompromising fabric quality, brilliant colors, and timeless styles for every celebration.'
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
('ladies-suits', 'Ladies Suits', 'Starting from ₹1,200', 'Premium designer ladies suits, salwar kameez sets, and custom-stitched boutique suits designed for elegant daily wear and special occasions.', 'Layers', ARRAY['Custom stitching and custom fitting options', 'High-grade threads and durable sewing styles', 'Choice of matching churidar, salwar, or pants', 'Includes premium matching dupatta linings'], '/images/seemasarees-suits.png', 10),
('dress-materials', 'Dress Materials', 'Starting from ₹600', 'Unstitched premium dress materials in cotton, silk, georgette, and linen from India''s top design houses.', 'Scissors', ARRAY['Premium cotton, linen, silk, and georgette swatches', 'Ready to be custom tailored to your exact measurements', 'Includes matching top, bottom, and dupatta material', 'Guaranteed color fastness and fabric longevity'], '/images/seemasarees-materials.png', 20),
('sarees', 'Sarees Collection', 'Starting from ₹1,500', 'Stunning range of premium sarees, including Banarasi silk, Kanjivaram, Georgette, Organza, and designer party-wear collections.', 'Sparkles', ARRAY['Pure silks, organzas, and heavily worked borders', 'Perfect for brides, wedding guests, and festivals', 'Includes unstitched designer blouse piece', 'Rich zari work, thread embroidery, and prints'], '/images/seemasarees-sarees.png', 30),
('burqa', 'Burqas & Abayas', 'Starting from ₹1,000', 'Premium quality ready-to-wear and custom tailored burqas, abayas, and modest wear in breathable imported fabrics.', 'Shield', ARRAY['Imported premium Nida, Lexus, and crepe fabrics', 'Elegant stone work, lace borders, and minimal designs', 'Custom length sizing and sleeve fittings', 'Comfortable for everyday wear and travel'], '/images/seemasarees-burqa.png', 40),
('adhoc', 'Custom Work & Adhoc', 'On Demand', 'Tailoring services, matching accessories, personalized design adjustments, and boutique commissions.', 'Compass', ARRAY['Custom designer blouse and lehenga stitching', 'Matching dupattas, laces, and borders on demand', 'Quick alteration and adjustment consultations', 'Bespoke embroidery commissions'], '/images/seemasarees-materials.png', 50)
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
('gallery-1', '/images/seemasarees-suits.png', 'Designer Silk Ladies Suit with Hand Embroidery', 10),
('gallery-2', '/images/seemasarees-sarees.png', 'Exquisite Banarasi Kanjivaram Wedding Saree', 30),
('gallery-3', '/images/seemasarees-materials.png', 'Premium Unstitched Cotton Dress Materials', 50)
ON CONFLICT (id) DO UPDATE SET
  url = EXCLUDED.url,
  alt = EXCLUDED.alt,
  sort_order = EXCLUDED.sort_order;

-- Testimonials Seed
INSERT INTO testimonials (id, client_name, client_image, review_text, rating, sort_order) VALUES
(1, 'Aisha Khan', '/images/seemasarees-suits.png', 'The designer sarees and ladies suits selection is absolutely amazing. Highly recommended for wholesale and retail bridal shopping!', 5, 10)
ON CONFLICT (id) DO UPDATE SET
  client_name = EXCLUDED.client_name,
  client_image = EXCLUDED.client_image,
  review_text = EXCLUDED.review_text,
  rating = EXCLUDED.rating,
  sort_order = EXCLUDED.sort_order;

-- Services Seed
INSERT INTO services (id, title, price, description, icon, features, sort_order) VALUES
('custom-tailoring', 'Ladies Custom Stitching', 'Starting from ₹400', 'A professional boutique tailoring service for custom stitching ladies suits, designer blouses, and modest wear abayas.', 'Scissors', ARRAY['Boutique standard designer blouse cuts', 'Accurate custom suit measurements', 'Perfect dress material stitching'], 10)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  features = EXCLUDED.features,
  sort_order = EXCLUDED.sort_order;
