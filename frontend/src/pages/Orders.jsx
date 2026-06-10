import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronDown, ChevronUp, X, MapPin, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getOrders, cancelOrder } from '../lib/api';

const STATUS_COLORS = {
  pending: 'badge-gold', confirmed: 'badge-gold', processing: 'badge-gold',
  shipped: 'badge-success', delivered: 'badge-success',
  cancelled: 'badge-error', refunded: 'badge-error',
};

const CANCELLABLE = ['pending', 'confirmed'];

export default function Orders() {
  const { user, getToken } = useAuth();
  const toast = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    document.title = 'My Orders | ThreadTheory';
    if (!user) return setLoading(false);
    getToken().then(token => getOrders(token)).then(setOrders).catch(console.error).finally(() => setLoading(false));
  }, [user, getToken]);

  const handleCancel = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    setCancelling(orderId);
    try {
      const token = await getToken();
      const updated = await cancelOrder(token, orderId);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: updated.status } : o));
      toast.success('Order cancelled successfully.');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCancelling(null);
    }
  };

  const toggleExpand = (id) => setExpanded(prev => prev === id ? null : id);

  return (
    <div className="page-enter" style={{ paddingTop: 80, minHeight: '100vh', paddingBottom: 'var(--space-16)' }}>
      <div className="container">
        <div style={{ padding: 'var(--space-8) 0', borderBottom: '1px solid var(--clr-border)', marginBottom: 'var(--space-8)' }}>
          <span className="overline">ThreadTheory</span>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)' }}>My Orders</h1>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {Array(3).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: 100, borderRadius: 'var(--radius-lg)' }} />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="flex-col items-center justify-center" style={{ minHeight: 300, gap: 'var(--space-4)', display: 'flex', textAlign: 'center' }}>
            <Package size={64} className="text-muted" />
            <h2 className="font-serif">No orders yet</h2>
            <Link to="/shop" className="btn btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {orders.map(order => (
              <div key={order.id} className="card" style={{ overflow: 'hidden' }}>
                {/* Order Header */}
                <div
                  style={{ padding: 'var(--space-5)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}
                  onClick={() => toggleExpand(order.id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                    <div>
                      <p className="text-muted text-xs" style={{ marginBottom: 2 }}>Order #{order.id.slice(0, 8).toUpperCase()}</p>
                      <p className="text-sm">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                    <span className={`badge ${STATUS_COLORS[order.status] || 'badge-gold'}`} style={{ textTransform: 'capitalize' }}>{order.status}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                    <span style={{ fontWeight: 600, fontSize: '1.05rem' }}>₹{Number(order.total).toLocaleString()}</span>
                    {expanded === order.id ? <ChevronUp size={18} className="text-muted" /> : <ChevronDown size={18} className="text-muted" />}
                  </div>
                </div>

                {/* Expandable Details */}
                <AnimatePresence>
                  {expanded === order.id && (
                    <motion.div
                      key="details"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{ borderTop: '1px solid var(--clr-border)', padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>

                        {/* Items */}
                        {order.order_items?.length > 0 && (
                          <div>
                            <p className="text-xs text-muted" style={{ textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-3)' }}>Items</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                              {order.order_items.map(item => {
                                const imgUrl = item.products?.product_images?.find(i => i.is_primary)?.url || item.products?.product_images?.[0]?.url;
                                return (
                                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                    {imgUrl ? (
                                      <img src={imgUrl} alt={item.product_name} style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 'var(--radius)', border: '1px solid var(--clr-border)' }} />
                                    ) : (
                                      <div style={{ width: 56, height: 56, background: 'var(--clr-surface-2)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Package size={20} className="text-muted" />
                                      </div>
                                    )}
                                    <div style={{ flex: 1 }}>
                                      <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>{item.product_name}</p>
                                      <p className="text-xs text-muted">{item.size}{item.color ? ` • ${item.color}` : ''} × {item.quantity}</p>
                                    </div>
                                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>₹{(item.unit_price * item.quantity).toLocaleString()}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Cost breakdown */}
                        <div style={{ background: 'var(--clr-surface-2)', borderRadius: 'var(--radius)', padding: 'var(--space-4)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                            <span className="text-sm text-muted">Subtotal</span><span className="text-sm">₹{Number(order.subtotal).toLocaleString()}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                            <span className="text-sm text-muted">Shipping</span>
                            <span className="text-sm">{order.shipping_cost === 0 ? <span className="text-gold">Free</span> : `₹${order.shipping_cost}`}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--clr-border)', paddingTop: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
                            <span style={{ fontWeight: 600 }}>Total</span><span style={{ fontWeight: 700 }}>₹{Number(order.total).toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Shipping + Payment info */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
                          {order.shipping_address && (
                            <div>
                              <p className="text-xs text-muted" style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 'var(--space-2)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                <MapPin size={12} /> Delivering To
                              </p>
                              <p className="text-sm">{order.shipping_address.full_name}</p>
                              <p className="text-xs text-muted">{order.shipping_address.line1}</p>
                              {order.shipping_address.line2 && <p className="text-xs text-muted">{order.shipping_address.line2}</p>}
                              <p className="text-xs text-muted">{order.shipping_address.city}, {order.shipping_address.state} — {order.shipping_address.zip}</p>
                            </div>
                          )}
                          <div>
                            <p className="text-xs text-muted" style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 'var(--space-2)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                              <CreditCard size={12} /> Payment
                            </p>
                            <p className="text-sm" style={{ textTransform: 'capitalize' }}>{order.payment_method === 'cod' ? 'Cash on Delivery' : order.payment_method}</p>
                          </div>
                        </div>

                        {/* Cancel button */}
                        {CANCELLABLE.includes(order.status) && (
                          <div>
                            <button
                              className="btn btn-outline"
                              style={{ color: 'var(--clr-error)', borderColor: 'var(--clr-error)', gap: 6 }}
                              onClick={(e) => { e.stopPropagation(); handleCancel(order.id); }}
                              disabled={cancelling === order.id}
                              id={`cancel-order-${order.id.slice(0, 8)}`}
                            >
                              <X size={14} />
                              {cancelling === order.id ? 'Cancelling...' : 'Cancel Order'}
                            </button>
                            <p className="text-xs text-muted" style={{ marginTop: 6 }}>Orders can be cancelled before they are shipped.</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
