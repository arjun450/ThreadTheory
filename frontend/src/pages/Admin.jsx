import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Package, Users, ShoppingBag, DollarSign, X, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { adminGetStats, adminGetProducts, adminDeleteProduct, adminGetOrders, adminUpdateOrderStatus, adminCreateProduct, adminUpdateProduct } from '../lib/api';
import './Admin.css';

const TABS = ['Overview', 'Products', 'Orders'];

export default function Admin() {
  const { user, getToken } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productModal, setProductModal] = useState(null); // null | 'new' | product

  const load = async () => {
    const token = await getToken();
    setLoading(true);
    try {
      const [s, p, o] = await Promise.all([adminGetStats(token), adminGetProducts(token), adminGetOrders(token)]);
      setStats(s);
      setProducts(p.products || []);
      setOrders(o.orders || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Admin Panel | ThreadTheory';
    if (user) load();
  }, [user]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    const token = await getToken();
    try {
      await adminDeleteProduct(token, id);
      toast.success('Product deleted');
      load();
    } catch (err) { toast.error(err.message); }
  };

  const handleStatusChange = async (orderId, status) => {
    const token = await getToken();
    try {
      await adminUpdateOrderStatus(token, orderId, status);
      toast.success(`Order marked as ${status}`);
      load();
    } catch (err) { toast.error(err.message); }
  };

  return (
    <div className="admin-page page-enter" style={{ paddingTop: 80, minHeight: '100vh', paddingBottom: 'var(--space-16)' }}>
      <div className="container">
        <div className="admin-header">
          <div>
            <span className="overline">ThreadTheory</span>
            <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginTop: 'var(--space-2)' }}>Admin Panel</h1>
          </div>
          {activeTab === 1 && (
            <button className="btn btn-primary" onClick={() => setProductModal('new')} id="add-product-btn">
              <Plus size={16} /> Add Product
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          {TABS.map((tab, i) => (
            <button key={tab} className={`admin-tab ${activeTab === i ? 'active' : ''}`} onClick={() => setActiveTab(i)} id={`admin-tab-${tab.toLowerCase()}`}>{tab}</button>
          ))}
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)' }}>
            {Array(4).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: 100, borderRadius: 'var(--radius-lg)' }} />)}
          </div>
        ) : (
          <>
            {/* OVERVIEW */}
            {activeTab === 0 && stats && (
              <div>
                <div className="admin-stats-grid">
                  {[
                    { icon: ShoppingBag, label: 'Products', value: stats.totalProducts },
                    { icon: Package, label: 'Orders', value: stats.totalOrders },
                    { icon: Users, label: 'Customers', value: stats.totalUsers },
                    { icon: DollarSign, label: 'Revenue', value: `₹${Number(stats.totalRevenue).toLocaleString()}` },
                  ].map(s => (
                    <div key={s.label} className="card admin-stat-card">
                      <div className="admin-stat-icon"><s.icon size={20} /></div>
                      <div>
                        <p className="admin-stat-value">{s.value}</p>
                        <p className="admin-stat-label">{s.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="admin-welcome-msg card-glass" style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', marginTop: 'var(--space-6)' }}>
                  <h3 className="font-serif" style={{ marginBottom: 'var(--space-2)' }}>Welcome to the Admin Panel</h3>
                  <p className="text-muted">Manage your products, track orders, and monitor store performance from here. Use the Products tab to add or edit your catalog.</p>
                </div>
              </div>
            )}

            {/* PRODUCTS */}
            {activeTab === 1 && (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr><th>Product</th><th>Category</th><th>Price</th><th>Status</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                            {p.product_images?.[0]?.url && <img src={p.product_images[0].url} alt={p.name} style={{ width: 40, height: 50, objectFit: 'cover', borderRadius: 4 }} />}
                            <span style={{ fontWeight: 500 }}>{p.name}</span>
                          </div>
                        </td>
                        <td className="text-muted text-sm">{p.categories?.name || '—'}</td>
                        <td>
                          {p.sale_price ? (
                            <><span className="text-gold">₹{p.sale_price.toLocaleString()}</span> <span className="price-original text-xs">₹{p.price.toLocaleString()}</span></>
                          ) : `₹${Number(p.price).toLocaleString()}`}
                        </td>
                        <td><span className={`badge ${p.is_active ? 'badge-success' : 'badge-error'}`}>{p.is_active ? 'Active' : 'Hidden'}</span></td>
                        <td>
                          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                            <button className="btn btn-outline btn-sm" onClick={() => setProductModal(p)} id={`edit-${p.id}`}><Pencil size={13} /></button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)} id={`del-${p.id}`}><Trash2 size={13} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {products.length === 0 && <p className="text-muted text-center" style={{ padding: 'var(--space-8)' }}>No products yet. Add your first product!</p>}
              </div>
            )}

            {/* ORDERS */}
            {activeTab === 2 && (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr><th>Order ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th><th>Update</th></tr>
                  </thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o.id}>
                        <td className="text-xs text-muted">#{o.id.slice(0, 8).toUpperCase()}</td>
                        <td>{o.profiles?.full_name || o.shipping_address?.full_name || '—'}</td>
                        <td>₹{Number(o.total).toLocaleString()}</td>
                        <td><span className={`badge ${['delivered','shipped'].includes(o.status) ? 'badge-success' : ['cancelled','refunded'].includes(o.status) ? 'badge-error' : 'badge-gold'}`} style={{ textTransform: 'capitalize' }}>{o.status}</span></td>
                        <td className="text-sm text-muted">{new Date(o.created_at).toLocaleDateString('en-IN')}</td>
                        <td>
                          <select className="form-select" style={{ width: 'auto', fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}
                            value={o.status} onChange={e => handleStatusChange(o.id, e.target.value)} id={`order-status-${o.id}`}>
                            {['pending','confirmed','processing','shipped','delivered','cancelled'].map(s => (
                              <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {orders.length === 0 && <p className="text-muted text-center" style={{ padding: 'var(--space-8)' }}>No orders yet.</p>}
              </div>
            )}
          </>
        )}
      </div>

      {/* Product Modal */}
      {productModal && <ProductModal product={productModal === 'new' ? null : productModal} onClose={() => setProductModal(null)} onSave={() => { setProductModal(null); load(); }} getToken={getToken} toast={toast} />}
    </div>
  );
}

function ProductModal({ product, onClose, onSave, getToken, toast }) {
  const isNew = !product;
  const [form, setForm] = useState({
    name: product?.name || '', description: product?.description || '',
    price: product?.price || '', sale_price: product?.sale_price || '',
    category_id: product?.category_id || '', material: product?.material || '',
    care_instructions: product?.care_instructions || '', is_featured: product?.is_featured || false,
    is_active: product?.is_active ?? true,
  });
  const [saving, setSaving] = useState(false);

  const handle = e => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(f => ({ ...f, [e.target.name]: v }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = await getToken();
      if (isNew) await adminCreateProduct(token, form);
      else await adminUpdateProduct(token, product.id, form);
      toast.success(isNew ? 'Product created!' : 'Product updated!');
      onSave();
    } catch (err) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  return (
    <>
      <div className="overlay" onClick={onClose} style={{ zIndex: 149 }} />
      <div className="admin-modal" id="product-modal">
        <div className="admin-modal-header">
          <h3 className="font-serif">{isNew ? 'Add Product' : 'Edit Product'}</h3>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={handleSave} className="admin-modal-body">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Product Name *</label>
              <input className="form-input" name="name" value={form.name} onChange={handle} required />
            </div>
            <div className="form-group">
              <label className="form-label">Price (₹) *</label>
              <input className="form-input" type="number" name="price" value={form.price} onChange={handle} required />
            </div>
            <div className="form-group">
              <label className="form-label">Sale Price (₹)</label>
              <input className="form-input" type="number" name="sale_price" value={form.sale_price} onChange={handle} />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Description</label>
              <textarea className="form-input" name="description" rows={3} value={form.description} onChange={handle} style={{ resize: 'vertical' }} />
            </div>
            <div className="form-group">
              <label className="form-label">Material</label>
              <input className="form-input" name="material" value={form.material} onChange={handle} />
            </div>
            <div className="form-group">
              <label className="form-label">Care Instructions</label>
              <input className="form-input" name="care_instructions" value={form.care_instructions} onChange={handle} />
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-4)', gridColumn: 'span 2' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer', fontSize: '0.875rem' }}>
                <input type="checkbox" name="is_featured" checked={form.is_featured} onChange={handle} /> Featured Product
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer', fontSize: '0.875rem' }}>
                <input type="checkbox" name="is_active" checked={form.is_active} onChange={handle} /> Active (visible in shop)
              </label>
            </div>
          </div>
          <div className="admin-modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving} id="save-product-btn">{saving ? 'Saving...' : 'Save Product'}</button>
          </div>
        </form>
      </div>
    </>
  );
}
