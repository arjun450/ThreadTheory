const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const supabase = require('../supabase');

// GET /api/reviews/:product_id
router.get('/:product_id', async (req, res) => {
  const { data, error } = await supabase
    .from('reviews')
    .select(`*, profiles(full_name, avatar_url)`)
    .eq('product_id', req.params.product_id)
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST /api/reviews — requires auth
router.post('/', auth, async (req, res) => {
  const { product_id, rating, title, body } = req.body;
  if (!product_id || !rating) return res.status(400).json({ error: 'product_id and rating required' });
  const { data, error } = await supabase
    .from('reviews')
    .upsert({ user_id: req.user.id, product_id, rating, title, body }, { onConflict: 'user_id,product_id' })
    .select(`*, profiles(full_name, avatar_url)`);
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
});

// DELETE /api/reviews/:id — requires auth (own review)
router.delete('/:id', auth, async (req, res) => {
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', req.params.id)
    .eq('user_id', req.user.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

module.exports = router;
