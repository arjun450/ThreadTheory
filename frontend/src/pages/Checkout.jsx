import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { createOrder } from '../lib/api';
import './Checkout.css';

const STEPS = ['Information', 'Shipping', 'Review'];

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { user, getToken } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const [info, setInfo] = useState({ full_name: '', email: user?.email || '', phone: '' });
  const [address, setAddress] = useState({ line1: '', line2: '', city: '', state: '', zip: '', country: 'India' });
  const [payment, setPayment] = useState('cod');

  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;

  const handleInfo = e => setInfo(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleAddr = e => setAddress(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleNext = (e) => { e.preventDefault(); setStep(s => s + 1); };

  const handleOrder = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = await getToken();
      await createOrder(token, {
        shipping_address: { ...info, ...address },
        payment_method: payment,
      });
      await clearCart();
      navigate('/account/orders');
      toast.success('Order placed successfully! 🎉');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const getPrimaryImage = (images) => images?.find(i => i.is_primary)?.url || images?.[0]?.url;

  return (
    <div className="checkout-page page-enter" style={{ paddingTop: 80 }}>
      <div className="container">
        <div className="checkout-grid">
          {/* Left: Form */}
          <div className="checkout-form-col">
            {/* Steps indicator */}
            <div className="checkout-steps">
              {STEPS.map((s, i) => (
                <div key={s} className="checkout-step-wrapper">
                  <div className={`checkout-step ${i < step ? 'done' : i === step ? 'active' : ''}`}>
                    <div className="step-circle">{i < step ? <Check size={12} /> : i + 1}</div>
                    <span className="step-label">{s}</span>
                  </div>
                  {i < STEPS.length - 1 && <div className={`step-connector ${i < step ? 'done' : ''}`} />}
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.form key="info" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onSubmit={handleNext} className="checkout-section" id="info-form">
                  <h2 className="font-serif checkout-section-title">Contact Information</h2>
                  <div className="form-group">
                    <label className="form-label" htmlFor="full_name">Full Name</label>
                    <input className="form-input" name="full_name" id="full_name" value={info.full_name} onChange={handleInfo} required placeholder="Jane Doe" />
                  </div>
                  <div className="checkout-row">
                    <div className="form-group">
                      <label className="form-label" htmlFor="email">Email</label>
                      <input className="form-input" type="email" name="email" id="email" value={info.email} onChange={handleInfo} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="phone">Phone</label>
                      <input className="form-input" type="tel" name="phone" id="phone" value={info.phone} onChange={handleInfo} required placeholder="+91 00000 00000" />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary w-full btn-lg" id="info-next-btn">Continue to Shipping <ChevronRight size={16} /></button>
                </motion.form>
              )}

              {step === 1 && (
                <motion.form key="shipping" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onSubmit={handleNext} className="checkout-section" id="shipping-form">
                  <h2 className="font-serif checkout-section-title">Shipping Address</h2>
                  <div className="form-group">
                    <label className="form-label" htmlFor="line1">Address Line 1</label>
                    <input className="form-input" name="line1" id="line1" value={address.line1} onChange={handleAddr} required placeholder="Flat / House No, Street" />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="line2">Address Line 2 (optional)</label>
                    <input className="form-input" name="line2" id="line2" value={address.line2} onChange={handleAddr} placeholder="Area, Landmark" />
                  </div>
                  <div className="checkout-row">
                    <div className="form-group">
                      <label className="form-label" htmlFor="city">City</label>
                      <input className="form-input" name="city" id="city" value={address.city} onChange={handleAddr} required placeholder="Mumbai" />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="state">State</label>
                      <input className="form-input" name="state" id="state" value={address.state} onChange={handleAddr} required placeholder="Maharashtra" />
                    </div>
                  </div>
                  <div className="checkout-row">
                    <div className="form-group">
                      <label className="form-label" htmlFor="zip">PIN Code</label>
                      <input className="form-input" name="zip" id="zip" value={address.zip} onChange={handleAddr} required placeholder="400001" />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="country">Country</label>
                      <input className="form-input" name="country" id="country" value={address.country} onChange={handleAddr} required />
                    </div>
                  </div>
                  <div className="checkout-nav">
                    <button type="button" className="btn btn-ghost" onClick={() => setStep(0)}>← Back</button>
                    <button type="submit" className="btn btn-primary btn-lg" id="shipping-next-btn">Review Order <ChevronRight size={16} /></button>
                  </div>
                </motion.form>
              )}

              {step === 2 && (
                <motion.form key="review" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onSubmit={handleOrder} className="checkout-section" id="review-form">
                  <h2 className="font-serif checkout-section-title">Review Your Order</h2>
                  <div className="review-summary">
                    <div className="review-block">
                      <p className="review-block-title">Delivering To</p>
                      <p>{info.full_name} • {info.phone}</p>
                      <p>{address.line1}{address.line2 ? `, ${address.line2}` : ''}</p>
                      <p>{address.city}, {address.state} — {address.zip}</p>
                    </div>
                    <div className="review-block">
                      <p className="review-block-title">Payment Method</p>
                      <div className="payment-options">
                        {[{ value: 'cod', label: 'Cash on Delivery' }, { value: 'upi', label: 'UPI / NetBanking' }].map(opt => (
                          <label key={opt.value} className={`payment-option ${payment === opt.value ? 'active' : ''}`}>
                            <input type="radio" name="payment" value={opt.value} checked={payment === opt.value} onChange={e => setPayment(e.target.value)} />
                            {opt.label}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="checkout-nav">
                    <button type="button" className="btn btn-ghost" onClick={() => setStep(1)}>← Back</button>
                    <button type="submit" className="btn btn-primary btn-lg" disabled={submitting} id="place-order-btn">
                      {submitting ? 'Placing Order...' : `Place Order — ₹${total.toLocaleString()}`}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Order summary */}
          <aside className="checkout-summary-col">
            <div className="card checkout-summary-card">
              <h3 className="font-serif" style={{ fontSize: '1.2rem' }}>Your Order</h3>
              <div className="checkout-order-items">
                {items.map(item => {
                  const img = getPrimaryImage(item.products?.product_images);
                  const price = item.products?.sale_price || item.products?.price || 0;
                  return (
                    <div key={item.id} className="checkout-order-item">
                      <div className="checkout-item-img">{img && <img src={img} alt={item.products?.name} />}<span className="checkout-item-qty">{item.quantity}</span></div>
                      <div className="checkout-item-info">
                        <p className="checkout-item-name">{item.products?.name}</p>
                        <p className="checkout-item-meta text-muted text-xs">{item.product_variants?.size} {item.product_variants?.color && `• ${item.product_variants.color}`}</p>
                      </div>
                      <span className="checkout-item-price">₹{(price * item.quantity).toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>
              <div className="divider" style={{ margin: '0.5rem 0' }} />
              <div className="cart-summary">
                <div className="cart-summary-row"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
                <div className="cart-summary-row"><span>Shipping</span><span>{shipping === 0 ? <span className="text-gold">Free</span> : `₹${shipping}`}</span></div>
                <div className="cart-summary-row cart-total"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
