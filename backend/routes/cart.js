const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const supabase = require('../supabase');

// All cart routes require auth
router.use(auth);

// GET /api/cart
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('cart_items')
    .select(`
      id, quantity,
      products(id, name, slug, price, sale_price, product_images(url, is_primary)),
      product_variants(id, size, color, color_hex, stock_qty)
    `)
    .eq('user_id', req.user.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST /api/cart — add or update item
router.post('/', async (req, res) => {
  const { product_id, variant_id, quantity = 1 } = req.body;
  if (!product_id || !variant_id) return res.status(400).json({ error: 'product_id and variant_id required' });

  // Check stock
  const { data: variant } = await supabase
    .from('product_variants')
    .select('stock_qty')
    .eq('id', variant_id)
    .single();
  if (!variant || variant.stock_qty < quantity) return res.status(400).json({ error: 'Insufficient stock' });

  const { data, error } = await supabase
    .from('cart_items')
    .upsert({ user_id: req.user.id, product_id, variant_id, quantity }, { onConflict: 'user_id,variant_id' })
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
});

// PATCH /api/cart/:id — update quantity
router.patch('/:id', async (req, res) => {
  const { quantity } = req.body;
  if (!quantity || quantity < 1) return res.status(400).json({ error: 'Invalid quantity' });
  const { data, error } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .select();
  if (error) return res.status(500).json({ error: error.message });
  if (!data.length) return res.status(404).json({ error: 'Cart item not found' });
  res.json(data[0]);
});

// DELETE /api/cart/:id
router.delete('/:id', async (req, res) => {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', req.params.id)
    .eq('user_id', req.user.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// DELETE /api/cart — clear entire cart
router.delete('/', async (req, res) => {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', req.user.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

module.exports = router;
