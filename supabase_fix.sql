-- ============================================================
-- ThreadTheory — Demo Data: Categories + Products + Images
-- Run this in Supabase SQL Editor
-- ============================================================

-- STEP 1: Categories
INSERT INTO categories (name, slug, description) VALUES
  ('Casual Shirts', 'casual-shirts', 'Versatile shirts for everyday wear'),
  ('T-Shirts',      't-shirts',      'Comfortable tees for any occasion'),
  ('Trousers',      'trousers',      'Elegant trousers for work and leisure'),
  ('Dresses',       'dresses',       'Beautiful dresses for every occasion'),
  ('Outerwear',     'outerwear',     'Jackets and coats for all seasons')
ON CONFLICT (slug) DO NOTHING;

-- STEP 2: Products
INSERT INTO products (name, slug, description, price, sale_price, category_id, material, care_instructions, is_featured, is_active) VALUES

-- Casual Shirts
('Oxford Button-Down Shirt',
 'oxford-button-down-shirt',
 'A timeless Oxford shirt crafted from premium cotton. Perfect for both casual and semi-formal settings with a relaxed yet polished look.',
 2499, 1999,
 (SELECT id FROM categories WHERE slug = 'casual-shirts'),
 '100% Premium Cotton', 'Machine wash cold, tumble dry low', true, true),

('Linen Summer Shirt',
 'linen-summer-shirt',
 'Stay cool and stylish in this breathable linen shirt. The perfect companion for warm Indian summers and breezy evenings.',
 3299, NULL,
 (SELECT id FROM categories WHERE slug = 'casual-shirts'),
 '100% Linen', 'Hand wash or dry clean recommended', true, true),

('Slim Fit Poplin Shirt',
 'slim-fit-poplin-shirt',
 'A crisp poplin shirt with a modern slim fit. Effortlessly transitions from the office to an evening out.',
 1999, 1499,
 (SELECT id FROM categories WHERE slug = 'casual-shirts'),
 '100% Cotton Poplin', 'Machine wash cold, hang dry', false, true),

-- T-Shirts
('Essential Crew Neck Tee',
 'essential-crew-neck-tee',
 'The perfect everyday tee. Made from heavyweight combed cotton for a premium feel that holds its shape wash after wash.',
 899, NULL,
 (SELECT id FROM categories WHERE slug = 't-shirts'),
 '100% Combed Cotton', 'Machine wash cold, lay flat to dry', true, true),

('Oversized Graphic Tee',
 'oversized-graphic-tee',
 'A bold oversized tee featuring exclusive ThreadTheory artwork. A limited-edition street-style essential.',
 1299, 999,
 (SELECT id FROM categories WHERE slug = 't-shirts'),
 'Cotton Jersey', 'Machine wash cold, inside out', true, true),

('Pique Polo T-Shirt',
 'pique-polo-tshirt',
 'Classic polo with a modern twist. Smart enough for casual Fridays, comfortable enough for weekends.',
 1599, NULL,
 (SELECT id FROM categories WHERE slug = 't-shirts'),
 '100% Pique Cotton', 'Machine wash cold', false, true),

-- Trousers
('Slim Chino Trousers',
 'slim-chino-trousers',
 'Versatile chinos that go from boardroom to brunch. Tailored slim fit with just the right amount of stretch.',
 3499, 2799,
 (SELECT id FROM categories WHERE slug = 'trousers'),
 'Cotton Twill with Stretch', 'Machine wash cold', true, true),

('Wide Leg Linen Trousers',
 'wide-leg-linen-trousers',
 'On-trend wide leg silhouette in breathable linen. The sophisticated choice for the modern wardrobe.',
 4299, NULL,
 (SELECT id FROM categories WHERE slug = 'trousers'),
 '55% Linen, 45% Cotton', 'Hand wash or dry clean only', false, true),

('Comfort Jogger Pants',
 'comfort-jogger-pants',
 'Premium joggers that blur the line between comfort and style. Perfect for work-from-home or weekend outings.',
 2199, 1799,
 (SELECT id FROM categories WHERE slug = 'trousers'),
 'French Terry Cotton', 'Machine wash warm, tumble dry low', false, true),

-- Dresses
('Floral Wrap Dress',
 'floral-wrap-dress',
 'A flattering wrap silhouette in vibrant floral print. Effortlessly elegant for brunches, events or a day out.',
 3999, 2999,
 (SELECT id FROM categories WHERE slug = 'dresses'),
 'Viscose Georgette', 'Dry clean recommended', true, true),

('Linen Shirt Dress',
 'linen-shirt-dress',
 'The ultimate summer dress. Relaxed linen construction with a shirt-style collar for understated chic.',
 4499, NULL,
 (SELECT id FROM categories WHERE slug = 'dresses'),
 '100% Linen', 'Hand wash cold, hang dry', true, true),

-- Outerwear
('Premium Wool Blazer',
 'premium-wool-blazer',
 'A structured blazer in premium wool blend. The cornerstone of a sophisticated wardrobe — for meetings and evenings alike.',
 7999, 6499,
 (SELECT id FROM categories WHERE slug = 'outerwear'),
 'Wool Blend', 'Dry clean only', true, true),

('Quilted Bomber Jacket',
 'quilted-bomber-jacket',
 'Stay warm in style with this lightweight quilted bomber. The perfect transitional layer for cooler evenings.',
 5499, 4299,
 (SELECT id FROM categories WHERE slug = 'outerwear'),
 'Nylon Shell, Polyester Fill', 'Machine wash cold, gentle cycle', true, true)

ON CONFLICT (slug) DO NOTHING;

-- STEP 3: Product Images (Unsplash)
INSERT INTO product_images (product_id, url, alt_text, is_primary, display_order) VALUES
((SELECT id FROM products WHERE slug='oxford-button-down-shirt'), 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80', 'Oxford Button-Down Shirt', true, 0),
((SELECT id FROM products WHERE slug='linen-summer-shirt'),       'https://images.unsplash.com/photo-1563389952560-d5c9f8ad7aa6?w=800&q=80', 'Linen Summer Shirt', true, 0),
((SELECT id FROM products WHERE slug='slim-fit-poplin-shirt'),    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80', 'Slim Fit Poplin Shirt', true, 0),
((SELECT id FROM products WHERE slug='essential-crew-neck-tee'),  'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80', 'Essential Crew Neck Tee', true, 0),
((SELECT id FROM products WHERE slug='oversized-graphic-tee'),    'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80', 'Oversized Graphic Tee', true, 0),
((SELECT id FROM products WHERE slug='pique-polo-tshirt'),        'https://images.unsplash.com/photo-1571455786673-9d9d6c194f90?w=800&q=80', 'Pique Polo T-Shirt', true, 0),
((SELECT id FROM products WHERE slug='slim-chino-trousers'),      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80', 'Slim Chino Trousers', true, 0),
((SELECT id FROM products WHERE slug='wide-leg-linen-trousers'),  'https://images.unsplash.com/photo-1594938298603-c8148c4b4657?w=800&q=80', 'Wide Leg Linen Trousers', true, 0),
((SELECT id FROM products WHERE slug='comfort-jogger-pants'),     'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&q=80', 'Comfort Jogger Pants', true, 0),
((SELECT id FROM products WHERE slug='floral-wrap-dress'),        'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80', 'Floral Wrap Dress', true, 0),
((SELECT id FROM products WHERE slug='linen-shirt-dress'),        'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80', 'Linen Shirt Dress', true, 0),
((SELECT id FROM products WHERE slug='premium-wool-blazer'),      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80', 'Premium Wool Blazer', true, 0),
((SELECT id FROM products WHERE slug='quilted-bomber-jacket'),    'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80', 'Quilted Bomber Jacket', true, 0)

ON CONFLICT DO NOTHING;

-- STEP 4: Size variants for all products
DO $$
DECLARE
  prod RECORD;
  sizes TEXT[] := ARRAY['XS','S','M','L','XL','XXL'];
  colors TEXT[] := ARRAY['Black','White','Navy'];
  s TEXT;
  c TEXT;
  i INT := 0;
BEGIN
  FOR prod IN SELECT id, slug FROM products LOOP
    FOREACH s IN ARRAY sizes LOOP
      FOREACH c IN ARRAY colors LOOP
        i := i + 1;
        INSERT INTO product_variants (product_id, size, color, stock_qty, sku)
        VALUES (prod.id, s, c, floor(random() * 30 + 5)::int,
                UPPER(LEFT(prod.slug, 8)) || '-' || s || '-' || LEFT(c,1) || i)
        ON CONFLICT (sku) DO NOTHING;
      END LOOP;
    END LOOP;
  END LOOP;
END $$;
