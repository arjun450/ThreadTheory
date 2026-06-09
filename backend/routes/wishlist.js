const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const supabase = require('../supabase');

router.use(auth);

// GET /api/wishlist
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('wishlist_items')
    .select(`id, product_id, products(id, name, slug, price, sale_price, product_images(url, is_primary), product_variants(size, color, stock_qty))`)
    .eq('user_id', req.user.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST /api/wishlist — toggle
router.post('/', async (req, res) => {
  const { product_id } = req.body;
  if (!product_id) return res.status(400).json({ error: 'product_id required' });

  const { data: existing } = await supabase
    .from('wishlist_items')
    .select('id')
    .eq('user_id', req.user.id)
    .eq('product_id', product_id)
    .single();

  if (existing) {
    await supabase.from('wishlist_items').delete().eq('id', existing.id);
    return res.json({ action: 'removed' });
  }
  await supabase.from('wishlist_items').insert({ user_id: req.user.id, product_id });
  res.status(201).json({ action: 'added' });
});

// DELETE /api/wishlist/:id
router.delete('/:id', async (req, res) => {
  const { error } = await supabase
    .from('wishlist_items')
    .delete()
    .eq('id', req.params.id)
    .eq('user_id', req.user.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

module.exports = router;
