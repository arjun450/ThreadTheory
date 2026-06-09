import { AnimatePresence, motion } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './CartDrawer.css';

const getPrimaryImage = (images) => {
  if (!images?.length) return null;
  return images.find(i => i.is_primary)?.url || images[0]?.url;
};

export default function CartDrawer({ open, onClose }) {
  const { items, loading, subtotal, updateItem, removeItem } = useCart();
  const { user } = useAuth();
  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} style={{ zIndex: 149 }} />
          <motion.aside
            className="cart-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.32 }}
            aria-label="Shopping cart"
            id="cart-drawer"
          >
            {/* Header */}
            <div className="cart-header">
              <div className="flex items-center gap-2">
                <ShoppingBag size={18} className="text-gold" />
                <h2 className="cart-title">Your Cart</h2>
                {items.length > 0 && <span className="badge badge-gold">{items.length}</span>}
              </div>
              <button className="nav-icon-btn" onClick={onClose} aria-label="Close cart" id="close-cart-btn"><X size={20} /></button>
            </div>

            <div className="cart-body">
              {!user ? (
                <div className="cart-empty">
                  <ShoppingBag size={48} className="text-muted" />
                  <p>Sign in to view your cart</p>
                  <Link to="/auth" className="btn btn-primary" onClick={onClose}>Sign In</Link>
                </div>
              ) : loading ? (
                <div className="cart-loading">
                  {[1,2,3].map(i => <div key={i} className="cart-item-skeleton skeleton" />)}
                </div>
              ) : items.length === 0 ? (
                <div className="cart-empty">
                  <ShoppingBag size={48} className="text-muted" />
                  <p>Your cart is empty</p>
                  <Link to="/shop" className="btn btn-primary" onClick={onClose}>Start Shopping</Link>
                </div>
              ) : (
                <ul className="cart-items-list">
                  {items.map(item => {
                    const img = getPrimaryImage(item.products?.product_images);
                    const price = item.products?.sale_price || item.products?.price || 0;
                    return (
                      <li key={item.id} className="cart-item">
                        <div className="cart-item-img-wrap">
                          {img ? <img src={img} alt={item.products?.name} className="cart-item-img" /> : <div className="cart-item-img-placeholder" />}
                        </div>
                        <div className="cart-item-info">
                          <Link to={`/product/${item.products?.slug}`} className="cart-item-name" onClick={onClose}>
                            {item.products?.name}
                          </Link>
                          <div className="cart-item-meta">
                            {item.product_variants?.size && <span>Size: {item.product_variants.size}</span>}
                            {item.product_variants?.color && <span>• {item.product_variants.color}</span>}
                          </div>
                          <div className="cart-item-controls">
                            <div className="qty-control">
                              <button onClick={() => updateItem(item.id, item.quantity - 1)} disabled={item.quantity <= 1} aria-label="Decrease qty" className="qty-btn" id={`qty-dec-${item.id}`}><Minus size={12} /></button>
                              <span className="qty-value">{item.quantity}</span>
                              <button onClick={() => updateItem(item.id, item.quantity + 1)} aria-label="Increase qty" className="qty-btn" id={`qty-inc-${item.id}`}><Plus size={12} /></button>
                            </div>
                            <span className="cart-item-price">₹{(price * item.quantity).toLocaleString()}</span>
                          </div>
                        </div>
                        <button className="cart-item-remove" onClick={() => removeItem(item.id)} aria-label="Remove item" id={`remove-item-${item.id}`}><Trash2 size={14} /></button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {user && items.length > 0 && (
              <div className="cart-footer">
                <div className="cart-summary">
                  <div className="cart-summary-row">
                    <span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="cart-summary-row">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? <span className="text-gold">Free</span> : `₹${shipping}`}</span>
                  </div>
                  {shipping > 0 && <p className="cart-free-shipping-msg">Add ₹{(999 - subtotal).toLocaleString()} more for free shipping</p>}
                  <div className="cart-summary-row cart-total">
                    <span>Total</span><span>₹{total.toLocaleString()}</span>
                  </div>
                </div>
                <Link to="/checkout" className="btn btn-primary w-full btn-lg" onClick={onClose} id="checkout-btn">
                  Proceed to Checkout
                </Link>
                <Link to="/cart" className="btn btn-ghost w-full text-center" onClick={onClose} id="view-cart-btn" style={{fontSize:'0.8rem', letterSpacing:'0.06em'}}>
                  View Full Cart
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
