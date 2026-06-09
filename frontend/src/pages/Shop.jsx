import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { getProducts, getCategories } from '../lib/api';
import './Shop.css';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];
const SORT_OPTIONS = [
  { label: 'Newest', value: 'created_at:desc' },
  { label: 'Price: Low to High', value: 'price:asc' },
  { label: 'Price: High to Low', value: 'price:desc' },
  { label: 'Name A–Z', value: 'name:asc' },
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(1);

  // Filters from URL
  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const size = searchParams.get('size') || '';
  const minPrice = searchParams.get('min_price') || '';
  const maxPrice = searchParams.get('max_price') || '';
  const sort = searchParams.get('sort') || 'created_at:desc';

  const [sortField, sortOrder] = sort.split(':');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20, sort: sortField, order: sortOrder };
      if (category) params.category = category;
      if (search) params.search = search;
      if (size) params.size = size;
      if (minPrice) params.min_price = minPrice;
      if (maxPrice) params.max_price = maxPrice;
      const data = await getProducts(params);
      setProducts(data.products || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [category, search, size, minPrice, maxPrice, sortField, sortOrder, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => {
    document.title = `Shop${category ? ` — ${category}` : ''} | ThreadTheory`;
  }, [category]);

  const setFilter = (key, value) => {
    setPage(1);
    setSearchParams(prev => {
      const p = new URLSearchParams(prev);
      if (value) p.set(key, value); else p.delete(key);
      return p;
    });
  };

  const clearFilters = () => {
    setPage(1);
    setSearchParams({});
  };

  const activeFilterCount = [category, size, minPrice, maxPrice].filter(Boolean).length;

  const catLabel = categories.find(c => c.slug === category)?.name;

  return (
    <div className="shop-page page-enter" style={{ paddingTop: '80px' }}>
      {/* Page header */}
      <div className="shop-header">
        <div className="container">
          <div className="shop-header-content">
            <div>
              <span className="overline">ThreadTheory</span>
              <h1 className="shop-title">{search ? `Results for "${search}"` : catLabel || 'All Products'}</h1>
              <p className="text-muted text-sm">{loading ? '—' : `${total} items`}</p>
            </div>
            <div className="shop-controls">
              <button className={`filter-toggle-btn ${filterOpen ? 'active' : ''}`} onClick={() => setFilterOpen(o => !o)} id="filter-toggle-btn">
                <SlidersHorizontal size={16} />
                Filters
                {activeFilterCount > 0 && <span className="filter-badge">{activeFilterCount}</span>}
              </button>
              <div className="sort-select-wrap">
                <select
                  className="form-select sort-select"
                  value={sort}
                  onChange={e => setFilter('sort', e.target.value)}
                  id="sort-select"
                >
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Active filters */}
          {activeFilterCount > 0 && (
            <div className="active-filters">
              {category && <FilterChip label={catLabel || category} onRemove={() => setFilter('category', '')} />}
              {size && <FilterChip label={`Size: ${size}`} onRemove={() => setFilter('size', '')} />}
              {minPrice && <FilterChip label={`Min ₹${minPrice}`} onRemove={() => setFilter('min_price', '')} />}
              {maxPrice && <FilterChip label={`Max ₹${maxPrice}`} onRemove={() => setFilter('max_price', '')} />}
              <button className="clear-filters-btn" onClick={clearFilters}>Clear All</button>
            </div>
          )}
        </div>
      </div>

      <div className="container shop-body">
        {/* Sidebar Filters */}
        <AnimatePresence>
          {filterOpen && (
            <motion.aside
              className="filter-sidebar"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25 }}
              id="filter-sidebar"
            >
              <FilterSection title="Category">
                <div className="filter-options">
                  <button className={`filter-option ${!category ? 'active' : ''}`} onClick={() => setFilter('category', '')} id="filter-cat-all">All</button>
                  {categories.map(cat => (
                    <button key={cat.slug} className={`filter-option ${category === cat.slug ? 'active' : ''}`} onClick={() => setFilter('category', cat.slug)} id={`filter-cat-${cat.slug}`}>{cat.name}</button>
                  ))}
                </div>
              </FilterSection>

              <FilterSection title="Size">
                <div className="filter-options filter-sizes">
                  {SIZES.map(s => (
                    <button key={s} className={`filter-size-btn ${size === s ? 'active' : ''}`} onClick={() => setFilter('size', size === s ? '' : s)} id={`filter-size-${s}`}>{s}</button>
                  ))}
                </div>
              </FilterSection>

              <FilterSection title="Price Range">
                <div className="price-range-inputs">
                  <div className="form-group">
                    <input type="number" className="form-input" placeholder="Min ₹" value={minPrice} onChange={e => setFilter('min_price', e.target.value)} id="filter-min-price" />
                  </div>
                  <span className="price-range-sep">–</span>
                  <div className="form-group">
                    <input type="number" className="form-input" placeholder="Max ₹" value={maxPrice} onChange={e => setFilter('max_price', e.target.value)} id="filter-max-price" />
                  </div>
                </div>
              </FilterSection>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Products grid */}
        <main className={`shop-products ${filterOpen ? 'with-sidebar' : ''}`}>
          {loading ? (
            <div className="grid-products">
              {Array(12).fill(0).map((_, i) => (
                <div key={i}>
                  <div className="skeleton" style={{ aspectRatio: '3/4', borderRadius: 'var(--radius-lg)' }} />
                  <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div className="skeleton" style={{ height: 12, width: '40%', borderRadius: 4 }} />
                    <div className="skeleton" style={{ height: 16, width: '80%', borderRadius: 4 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="shop-empty">
              <p>No products found.</p>
              <button className="btn btn-outline" onClick={clearFilters}>Clear Filters</button>
            </div>
          ) : (
            <div className="grid-products">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}

          {/* Pagination */}
          {total > 20 && (
            <div className="pagination">
              <button className="btn btn-outline btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)} id="prev-page-btn">← Prev</button>
              <span className="text-muted text-sm">Page {page} of {Math.ceil(total / 20)}</span>
              <button className="btn btn-outline btn-sm" disabled={page >= Math.ceil(total / 20)} onClick={() => setPage(p => p + 1)} id="next-page-btn">Next →</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function FilterChip({ label, onRemove }) {
  return (
    <div className="filter-chip">
      {label}
      <button onClick={onRemove} aria-label="Remove filter"><X size={12} /></button>
    </div>
  );
}

function FilterSection({ title, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="filter-section">
      <button className="filter-section-header" onClick={() => setOpen(o => !o)}>
        <span>{title}</span>
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {open && <div className="filter-section-body">{children}</div>}
    </div>
  );
}
