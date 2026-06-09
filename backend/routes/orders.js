const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const supabase = require('../supabase');

router.use(auth);

// GET /api/orders
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('orders')
    .select(`*, order_items(*, products(name, product_images(url, is_primary)))`)
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET /api/orders/:id
router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('orders')
    .select(`*, order_items(*, products(name, product_images(url, is_primary)), product_variants(size, color))`)
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .single();
  if (error) return res.status(404).json({ error: 'Order not found' });
  res.json(data);
});

// POST /api/orders — create from cart
router.post('/', async (req, res) => {
  const { shipping_address, payment_method = 'cod', notes } = req.body;
  if (!shipping_address) return res.status(400).json({ error: 'Shipping address required' });

  // Get cart
  const { data: cartItems, error: cartError } = await supabase
    .from('cart_items')
    .select(`quantity, products(id, name, price, sale_price), product_variants(id, size, color, stock_qty)`)
    .eq('user_id', req.user.id);
  if (cartError || !cartItems.length) return res.status(400).json({ error: 'Cart is empty' });

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.products.sale_price || item.products.price;
    return sum + price * item.quantity;
  }, 0);
  const shipping_cost = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping_cost;

  // Create order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({ user_id: req.user.id, subtotal, shipping_cost, total, shipping_address, payment_method, notes })
    .select()
    .single();
  if (orderError) return res.status(500).json({ error: orderError.message });

  // Create order items
  const orderItems = cartItems.map(item => ({
    order_id: order.id,
    product_id: item.products.id,
    variant_id: item.product_variants.id,
    product_name: item.products.name,
    size: item.product_variants.size,
    color: item.product_variants.color,
    quantity: item.quantity,
    unit_price: item.products.sale_price || item.products.price
  }));

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
  if (itemsError) return res.status(500).json({ error: itemsError.message });

  // Decrement stock
  for (const item of cartItems) {
    await supabase
      .from('product_variants')
      .update({ stock_qty: item.product_variants.stock_qty - item.quantity })
      .eq('id', item.product_variants.id);
  }

  // Clear cart
  await supabase.from('cart_items').delete().eq('user_id', req.user.id);

  res.status(201).json(order);
});

module.exports = router;
