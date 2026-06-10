import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, Star, ChevronLeft, Check, Truck, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { getProduct } from '../lib/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './ProductDetail.css';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [qty, setQty] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const { user } = useAuth();
  const toast = useToast();

  useEffect(() => {
    setLoading(true);
    getProduct(slug).then(data => {
      setProduct(data);
      document.title = `${data.name} | ThreadTheory`;
      const firstInStock = data.product_variants?.find(v => v.stock_qty > 0);
      const defaultVariant = firstInStock || data.product_variants?.[0];
      setSelectedVariant(defaultVariant);
      setSelectedSize(defaultVariant?.size ?? null);
      setSelectedColor(defaultVariant?.color ?? null);
    }).catch(() => navigate('/shop')).finally(() => setLoading(false));
  }, [slug, navigate]);

  if (loading) return <div style={{ minHeight: '100vh', paddingTop: 80 }} className="flex items-center justify-center"><div className="skeleton" style={{ width: 40, height: 40, borderRadius: '50%' }} /></div>;
  if (!product) return null;

  const images = product.product_images?.sort((a, b) => a.display_order - b.display_port) || [];
  const primaryImage = images.find(i => i.is_primary) || images[0];
  const displayImages = [primaryImage, ...images.filter(i => i !== primaryImage)].filter(Boolean);

  const sizes = [...new Set(product.product_variants?.map(v => v.size))];
  const colors = [...new Map(product.product_variants?.filter(v => v.color).map(v => [v.color, v])).values()];


  const getVariant = (size, color) => product.product_variants?.find(v =>
    (!size || v.size === size) && (!color || v.color === color)
  );

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    const v = getVariant(size, selectedColor);
    if (v) setSelectedVariant(v);
  };
  const handleColorSelect = (color) => {
    setSelectedColor(color);
    const v = getVariant(selectedSize, color);
    if (v) setSelectedVariant(v);
  };

  const isWished = isWishlisted(product.id);
  const inStock = selectedVariant?.stock_qty > 0;
  const hasDiscount = product.sale_price && product.sale_price < product.price;

  const avgRating = product.reviews?.length
    ? (product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length).toFixed(1)
    : null;

  const handleAddToCart = async () => {
    if (!user) { toast.info('Please sign in to add to cart'); navigate('/auth'); return; }
    if (!selectedVariant) { toast.error('Please select a size'); return; }
    if (!inStock) { toast.error('This variant is out of stock'); return; }
    setAddingToCart(true);
    try {
      await addItem(product.id, selectedVariant.id, qty);
      toast.success('Added to cart! 🛍️');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleWishlist = async () => {
    if (!user) { toast.info('Please sign in to save items'); return; }
    const result = await toggle(product.id);
    toast.success(result?.action === 'added' ? 'Saved to wishlist ♡' : 'Removed from wishlist');
  };

  return (
    <div className="product-detail page-enter" style={{ paddingTop: 80 }}>
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/shop">Shop</Link>
          {product.categories && <><span>/</span><Link to={`/shop?category=${product.categories.slug}`}>{product.categories.name}</Link></>}
          <span>/</span><span>{product.name}</span>
        </nav>

        <div className="product-detail-grid">
          {/* Images */}
          <div className="product-images">
            <div className="product-image-main">
              <motion.img
                key={selectedImg}
                src={displayImages[selectedImg]?.url}
                alt={product.name}
                className="product-main-img"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              {hasDiscount && <div className="product-sale-badge badge badge-gold">Sale</div>}
            </div>
            {displayImages.length > 1 && (
              <div className="product-image-thumbs">
                {displayImages.map((img, i) => (
                  <button key={i} className={`thumb-btn ${i === selectedImg ? 'active' : ''}`} onClick={() => setSelectedImg(i)} aria-label={`Image ${i+1}`} id={`img-thumb-${i}`}>
                    <img src={img.url} alt={product.name} className="thumb-img" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="product-info">
            {product.categories && (
              <Link to={`/shop?category=${product.categories.slug}`} className="product-category-tag">{product.categories.name}</Link>
            )}
            <h1 className="product-name">{product.name}</h1>

            {/* Rating */}
            {avgRating && (
              <div className="product-rating">
                <div className="stars">{Array(5).fill(0).map((_, i) => <Star key={i} size={14} fill={i < Math.round(avgRating) ? 'currentColor' : 'none'} className={i < Math.round(avgRating) ? 'star' : 'star-empty'} />)}</div>
                <span className="text-sm">{avgRating} ({product.reviews.length} reviews)</span>
              </div>
            )}

            {/* Price */}
            <div className="product-price-block">
              <span className={`price-current ${hasDiscount ? 'price-sale' : ''}`} style={{ fontSize: '1.6rem' }}>
                ₹{Number(product.sale_price || product.price).toLocaleString()}
              </span>
              {hasDiscount && <span className="price-original" style={{ fontSize: '1.1rem' }}>₹{Number(product.price).toLocaleString()}</span>}
            </div>

            {/* Description */}
            {product.description && <p className="product-description">{product.description}</p>}

            {/* Color selector */}
            {colors.length > 1 && (
              <div className="selector-group">
                <p className="selector-label">Color: <strong>{selectedColor}</strong></p>
                <div className="color-options">
                  {colors.map(v => (
                    <button key={v.color} className={`color-swatch ${selectedColor === v.color ? 'active' : ''}`} style={{ '--color': v.color_hex || '#888' }} onClick={() => handleColorSelect(v.color)} title={v.color} id={`color-${v.color}`} />
                  ))}
                </div>
              </div>
            )}

            {/* Size selector */}
            {sizes.length > 0 && (
              <div className="selector-group">
                <p className="selector-label">Size: <strong>{selectedSize || 'Select'}</strong></p>
                <div className="size-options">
                  {sizes.map(size => {
                    const v = getVariant(size, selectedColor);
                    const outOfStock = !v || v.stock_qty === 0;
                    return (
                      <button key={size} className={`size-option-btn ${selectedSize === size ? 'active' : ''} ${outOfStock ? 'out-of-stock' : ''}`} onClick={() => !outOfStock && handleSizeSelect(size)} disabled={outOfStock} id={`size-${size}`}>
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Stock */}
            {selectedVariant && (
              <p className={`stock-indicator ${inStock ? 'in-stock' : 'out-of-stock-text'}`}>
                {inStock ? <><Check size={14} /> In Stock ({selectedVariant.stock_qty} left)</> : 'Out of Stock'}
              </p>
            )}

            {/* Quantity */}
            {inStock && (
              <div className="qty-row">
                <p className="selector-label">Quantity</p>
                <div className="qty-control qty-control-lg">
                  <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="Decrease">−</button>
                  <span className="qty-value">{qty}</span>
                  <button className="qty-btn" onClick={() => setQty(q => Math.min(selectedVariant?.stock_qty || 10, q + 1))} aria-label="Increase">+</button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="product-actions">
              <button className="btn btn-primary btn-lg flex-1" onClick={handleAddToCart} disabled={addingToCart || !inStock} id="add-to-cart-btn">
                <ShoppingBag size={18} />
                {addingToCart ? 'Adding...' : inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
              <button className={`btn btn-outline btn-icon wishlist-btn ${isWished ? 'wished' : ''}`} onClick={handleWishlist} aria-label="Wishlist" id="wishlist-btn">
                <Heart size={18} fill={isWished ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="trust-badges">
              <div className="trust-badge"><Truck size={16} className="text-gold" /><span>Free shipping over ₹999</span></div>
              <div className="trust-badge"><RotateCcw size={16} className="text-gold" /><span>15-day easy returns</span></div>
            </div>

            {/* Material */}
            {product.material && (
              <div className="product-meta-list">
                <div className="product-meta-item"><span>Material</span><span>{product.material}</span></div>
                {product.care_instructions && <div className="product-meta-item"><span>Care</span><span>{product.care_instructions}</span></div>}
              </div>
            )}
          </div>
        </div>

        {/* Reviews */}
        {product.reviews?.length > 0 && (
          <section className="reviews-section" id="reviews">
            <div className="divider-gold" />
            <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>Customer Reviews</h2>
            <div className="reviews-grid">
              {product.reviews.map(r => (
                <div key={r.id} className="review-card card">
                  <div className="review-header">
                    <div className="stars">{Array(5).fill(0).map((_, i) => <Star key={i} size={12} fill={i < r.rating ? 'currentColor' : 'none'} className={i < r.rating ? 'star' : 'star-empty'} />)}</div>
                    <span className="text-xs text-muted">{new Date(r.created_at).toLocaleDateString('en-IN')}</span>
                  </div>
                  {r.title && <p className="review-title">{r.title}</p>}
                  {r.body && <p className="review-body">{r.body}</p>}
                  <p className="review-author">{r.profiles?.full_name || 'Anonymous'}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
