import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getOrders } from '../lib/api';

const STATUS_COLORS = {
  pending: 'badge-gold', confirmed: 'badge-gold', processing: 'badge-gold',
  shipped: 'badge-success', delivered: 'badge-success',
  cancelled: 'badge-error', refunded: 'badge-error',
};

export default function Orders() {
  const { user, getToken } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'My Orders | ThreadTheory';
    if (!user) return setLoading(false);
    getToken().then(token => getOrders(token)).then(setOrders).catch(console.error).finally(() => setLoading(false));
  }, [user, getToken]);

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
              <div key={order.id} className="card" style={{ padding: 'var(--space-5)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                  <div>
                    <p className="text-muted text-xs" style={{ marginBottom: 4 }}>Order #{order.id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-sm">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <span className={`badge ${STATUS_COLORS[order.status] || 'badge-gold'}`} style={{ textTransform: 'capitalize' }}>{order.status}</span>
                    <span style={{ fontWeight: 600 }}>₹{Number(order.total).toLocaleString()}</span>
                  </div>
                </div>
                {order.order_items?.length > 0 && (
                  <div style={{ marginTop: 'var(--space-3)', display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                    {order.order_items.map(item => (
                      <span key={item.id} className="text-xs text-muted">{item.product_name} (×{item.quantity}){item !== order.order_items[order.order_items.length - 1] ? ', ' : ''}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
