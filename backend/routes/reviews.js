const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const supabase = require('../supabase');

// Helper: enrich reviews with profile names (no direct FK between reviews and profiles)
const enrichWithProfiles = async (reviews) => {
  if (!reviews?.length) return reviews;
  const userIds = [...new Set(reviews.map(r => r.user_id))];
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url')
    .in('id', userIds);
  const map = Object.fromEntries((profiles || []).map(p => [p.id, p]));
  return reviews.map(r => ({ ...r, profiles: map[r.user_id] || null }));
};

// GET /api/reviews/:product_id
router.get('/:product_id', async (req, res) => {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('product_id', req.params.product_id)
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(await enrichWithProfiles(data));
});

// POST /api/reviews — requires auth
router.post('/', auth, async (req, res) => {
  const { product_id, rating, title, body } = req.body;
  if (!product_id || !rating) return res.status(400).json({ error: 'product_id and rating required' });
  const { data, error } = await supabase
    .from('reviews')
    .upsert(
      { user_id: req.user.id, product_id, rating: Number(rating), title, body },
      { onConflict: 'user_id,product_id' }
    )
    .select('*');
  if (error) return res.status(500).json({ error: error.message });
  const enriched = await enrichWithProfiles(data);
  res.status(201).json(enriched[0]);
});

// DELETE /api/reviews/:id — requires auth (own review only)
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
