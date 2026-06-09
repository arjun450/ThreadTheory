import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './ProductCard.css';

const getPrimaryImage = (images) => {
  if (!images?.length) return null;
  return images.find(i => i.is_primary)?.url || images[0]?.url;
};

const getSecondaryImage = (images) => {
  if (!images || images.length < 2) return null;
  return images.find(i => !i.is_primary)?.url || null;
};

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const { user } = useAuth();
  const toast = useToast();

  const primaryImg = getPrimaryImage(product?.product_images);
  const secondaryImg = getSecondaryImage(product?.product_images);
  const wishlisted = isWishlisted(product?.id);

  const displayPrice = product?.sale_price || product?.price;
  const hasDiscount = product?.sale_price && product.sale_price < product.price;
  const discountPct = hasDiscount ? Math.round((1 - product.sale_price / product.price) * 100) : 0;

  const availableSizes = [...new Set(product?.product_variants?.filter(v => v.stock_qty > 0).map(v => v.size))];
  const avgRating = product?.reviews?.length
    ? (product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length).toFixed(1)
    : null;

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!user) { toast.info('Sign in to save to wishlist'); return; }
    const result = await toggle(product.id);
    toast.success(result?.action === 'added' ? 'Added to wishlist ♡' : 'Removed from wishlist');
  };

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    if (!user) { toast.info('Sign in to add to cart'); return; }
    if (!product?.product_variants?.length) { toast.error('No variants available'); return; }
    const inStock = product.product_variants.find(v => v.stock_qty > 0);
    if (!inStock) { toast.error('Out of stock'); return; }
    try {
      await addItem(product.id, inStock.id, 1);
      toast.success('Added to cart!');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <motion.article
      className="product-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/product/${product?.slug}`} className="product-card-image-wrap">
        {primaryImg ? (
          <img src={primaryImg} alt={product?.name} className="product-card-img product-card-img-primary" loading="lazy" />
        ) : (
          <div className="product-card-placeholder" />
        )}
        {secondaryImg && (
          <img src={secondaryImg} alt={product?.name} className="product-card-img product-card-img-secondary" loading="lazy" />
        )}

        {/* Badges */}
        <div className="product-card-badges">
          {hasDiscount && <span className="badge badge-gold">-{discountPct}%</span>}
          {availableSizes.length === 0 && <span className="badge badge-error">Sold Out</span>}
        </div>

        {/* Wishlist */}
        <button
          className={`product-card-wishlist ${wishlisted ? 'active' : ''}`}
          onClick={handleWishlist}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          id={`wishlist-btn-${product?.id}`}
        >
          <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>

        {/* Quick add */}
        <button
          className="product-card-quick-add"
          onClick={handleQuickAdd}
          aria-label="Quick add to cart"
          id={`quick-add-btn-${product?.id}`}
        >
          <ShoppingBag size={14} />
          Quick Add
        </button>
      </Link>

      <div className="product-card-info">
        {product?.categories?.name && (
          <span className="product-card-category">{product.categories.name}</span>
        )}
        <Link to={`/product/${product?.slug}`}>
          <h3 className="product-card-name">{product?.name}</h3>
        </Link>

        {avgRating && (
          <div className="product-card-rating">
            <Star size={11} fill="currentColor" />
            <span>{avgRating}</span>
            <span className="text-muted">({product.reviews.length})</span>
          </div>
        )}

        <div className="product-card-price">
          <span className={`price-current ${hasDiscount ? 'price-sale' : ''}`}>
            ₹{Number(displayPrice).toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="price-original">₹{Number(product.price).toLocaleString()}</span>
          )}
        </div>

        {availableSizes.length > 0 && (
          <div className="product-card-sizes">
            {availableSizes.slice(0, 5).map(size => (
              <span key={size} className="size-chip">{size}</span>
            ))}
            {availableSizes.length > 5 && <span className="size-chip size-chip-more">+{availableSizes.length - 5}</span>}
          </div>
        )}
      </div>
    </motion.article>
  );
}
