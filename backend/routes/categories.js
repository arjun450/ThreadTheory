const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

// GET /api/categories
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('display_order');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET /api/categories/:slug
router.get('/:slug', async (req, res) => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', req.params.slug)
    .single();
  if (error) return res.status(404).json({ error: 'Category not found' });
  res.json(data);
});

module.exports = router;
