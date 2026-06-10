const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const supabase = require('../supabase');

router.use(auth, adminOnly);

// ---- PRODUCTS ----
router.get('/products', async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  const { data, error, count } = await supabase
    .from('products')
    .select(`*, categories(name, slug), product_images(url, is_primary), product_variants(*)`, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + Number(limit) - 1);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ products: data, total: count });
});

router.post('/products', async (req, res) => {
  const { name, description, price, sale_price, category_id, material, care_instructions, is_featured, images, variants } = req.body;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const { data: product, error } = await supabase
    .from('products')
    .insert({ name, slug, description, price, sale_price, category_id, material, care_instructions, is_featured: is_featured || false })
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });

  if (images?.length) {
    await supabase.from('product_images').insert(images.map((img, i) => ({
      product_id: product.id, url: img.url, alt_text: img.alt_text || name, is_primary: i === 0, display_order: i
    })));
  }
  if (variants?.length) {
    await supabase.from('product_variants').insert(variants.map(v => ({ ...v, product_id: product.id })));
  }
  res.status(201).json(product);
});

router.patch('/products/:id', async (req, res) => {
  const { images, variants, ...fields } = req.body;
  const { data, error } = await supabase
    .from('products')
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.delete('/products/:id', async (req, res) => {
  const { error } = await supabase.from('products').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// ---- ORDERS ----
router.get('/orders', async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  let query = supabase
    .from('orders')
    .select(`*, order_items(*)`, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + Number(limit) - 1);
  if (status) query = query.eq('status', status);
  const { data, error, count } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json({ orders: data, total: count });
});

router.patch('/orders/:id/status', async (req, res) => {
  const { status } = req.body;
  const { data, error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// ---- DASHBOARD STATS ----
router.get('/stats', async (req, res) => {
  const [{ count: totalProducts }, { count: totalOrders }, { count: totalUsers }] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
  ]);
  const { data: revenueData } = await supabase.from('orders').select('total').eq('status', 'delivered');
  const totalRevenue = revenueData?.reduce((sum, o) => sum + Number(o.total), 0) || 0;
  res.json({ totalProducts, totalOrders, totalUsers, totalRevenue });
});

module.exports = router;
