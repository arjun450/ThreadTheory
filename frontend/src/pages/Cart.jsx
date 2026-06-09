import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Cart.css';

const getPrimaryImage = (images) => images?.find(i => i.is_primary)?.url || images?.[0]?.url;

export default function Cart() {
  const { items, loading, subtotal, updateItem, removeItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;

  return (
    <div className="cart-page page-enter" style={{ paddingTop: 80 }}>
      <div className="container">
        <div className="cart-page-header">
          <span className="overline">ThreadTheory</span>
          <h1>Shopping Cart</h1>
        </div>

        {!user ? (
          <div className="cart-page-empty">
            <ShoppingBag size={64} className="text-muted" />
            <h2>Sign in to view your cart</h2>
            <Link to="/auth" className="btn btn-primary btn-lg">Sign In</Link>
          </div>
        ) : loading ? (
          <div className="cart-page-loading">{Array(3).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: 120, borderRadius: 'var(--radius-lg)' }} />)}</div>
        ) : items.length === 0 ? (
          <div className="cart-page-empty">
            <ShoppingBag size={64} className="text-muted" />
            <h2>Your cart is empty</h2>
            <p className="text-muted">Start adding some pieces you love</p>
            <Link to="/shop" className="btn btn-primary btn-lg" id="empty-cart-shop-btn">Start Shopping <ArrowRight size={16} /></Link>
          </div>
        ) : (
          <div className="cart-page-grid">
            {/* Items */}
            <div className="cart-items-col">
              {items.map(item => {
                const img = getPrimaryImage(item.products?.product_images);
                const price = item.products?.sale_price || item.products?.price || 0;
                return (
                  <motion.div key={item.id} className="cart-page-item" layout exit={{ opacity: 0, height: 0 }}>
                    <div className="cart-page-item-img">
                      {img ? <img src={img} alt={item.products?.name} /> : <div className="cart-item-img-placeholder" />}
                    </div>
                    <div className="cart-page-item-info">
                      <div className="cart-page-item-top">
                        <div>
                          <Link to={`/product/${item.products?.slug}`} className="cart-page-item-name">{item.products?.name}</Link>
                          <p className="cart-page-item-meta">
                            {item.product_variants?.size && `Size: ${item.product_variants.size}`}
                            {item.product_variants?.color && ` • ${item.product_variants.color}`}
                          </p>
                        </div>
                        <button className="cart-page-remove" onClick={() => removeItem(item.id)} id={`remove-${item.id}`}><Trash2 size={16} /></button>
                      </div>
                      <div className="cart-page-item-bottom">
                        <div className="qty-control">
                          <button className="qty-btn" onClick={() => updateItem(item.id, item.quantity - 1)} disabled={item.quantity <= 1} id={`dec-${item.id}`}><Minus size={13} /></button>
                          <span className="qty-value">{item.quantity}</span>
                          <button className="qty-btn" onClick={() => updateItem(item.id, item.quantity + 1)} id={`inc-${item.id}`}><Plus size={13} /></button>
                        </div>
                        <span className="cart-page-item-price">₹{(price * item.quantity).toLocaleString()}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Summary */}
            <aside className="cart-summary-col">
              <div className="cart-summary-card card">
                <h3 className="font-serif" style={{ fontSize: '1.3rem' }}>Order Summary</h3>
                <div className="cart-summary">
                  <div className="cart-summary-row"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
                  <div className="cart-summary-row">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? <span className="text-gold">Free</span> : `₹${shipping}`}</span>
                  </div>
                  {shipping > 0 && (
                    <div className="free-shipping-bar">
                      <Truck size={14} className="text-gold" />
                      <span>Add ₹{(999 - subtotal).toLocaleString()} more for free shipping</span>
                    </div>
                  )}
                  <div className="divider" style={{ margin: '0.5rem 0' }} />
                  <div className="cart-summary-row cart-total">
                    <span>Total</span><span>₹{total.toLocaleString()}</span>
                  </div>
                </div>
                <button className="btn btn-primary w-full btn-lg" onClick={() => navigate('/checkout')} id="checkout-from-cart-btn">
                  Proceed to Checkout <ArrowRight size={16} />
                </button>
                <Link to="/shop" className="btn btn-ghost w-full text-center" style={{ fontSize: '0.8rem' }}>Continue Shopping</Link>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
