const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

// GET /api/products — list with filters
router.get('/', async (req, res) => {
  const { category, min_price, max_price, size, color, featured, search, sort = 'created_at', order = 'desc', page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;

  let query = supabase
    .from('products')
    .select(`
      *,
      categories(id, name, slug),
      product_images(url, is_primary, display_order),
      product_variants(id, size, color, color_hex, stock_qty)
    `, { count: 'exact' })
    .eq('is_active', true)
    .order(sort, { ascending: order === 'asc' })
    .range(offset, offset + Number(limit) - 1);

  if (category) query = query.eq('categories.slug', category);
  if (min_price) query = query.gte('price', min_price);
  if (max_price) query = query.lte('price', max_price);
  if (featured === 'true') query = query.eq('is_featured', true);
  if (search) query = query.ilike('name', `%${search}%`);

  const { data, error, count } = await query;
  if (error) return res.status(500).json({ error: error.message });

  let products = data;
  if (category) {
    products = data.filter(p => p.categories?.slug === category);
  }
  if (size) {
    products = products.filter(p =>
      p.product_variants?.some(v => v.size === size && v.stock_qty > 0)
    );
  }
  if (color) {
    products = products.filter(p =>
      p.product_variants?.some(v => v.color?.toLowerCase() === color.toLowerCase())
    );
  }

  res.json({ products, total: count, page: Number(page), limit: Number(limit) });
});

// GET /api/products/featured
router.get('/featured', async (req, res) => {
  const { data, error } = await supabase
    .from('products')
    .select(`*, categories(name, slug), product_images(url, is_primary)`)
    .eq('is_active', true)
    .eq('is_featured', true)
    .limit(8);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET /api/products/:slug
router.get('/:slug', async (req, res) => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories(id, name, slug),
      product_images(id, url, alt_text, is_primary, display_order),
      product_variants(id, size, color, color_hex, stock_qty, sku),
      reviews(id, rating, title, body, created_at, profiles(full_name, avatar_url))
    `)
    .eq('slug', req.params.slug)
    .eq('is_active', true)
    .single();
  if (error) return res.status(404).json({ error: 'Product not found' });
  res.json(data);
});

module.exports = router;
