import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';

export default function Wishlist() {
  const { items, loading } = useWishlist();
  const { user } = useAuth();

  useEffect(() => { document.title = 'Wishlist | ThreadTheory'; }, []);

  const products = items.map(i => i.products).filter(Boolean);

  return (
    <div className="page-enter" style={{ paddingTop: 80, minHeight: '100vh', paddingBottom: 'var(--space-16)' }}>
      <div className="container">
        <div style={{ padding: 'var(--space-8) 0', borderBottom: '1px solid var(--clr-border)', marginBottom: 'var(--space-8)' }}>
          <span className="overline">ThreadTheory</span>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)' }}>My Wishlist</h1>
          <p className="text-muted text-sm">{products.length} items saved</p>
        </div>

        {!user ? (
          <div className="flex-col items-center justify-center" style={{ minHeight: 300, gap: 'var(--space-4)', display: 'flex', textAlign: 'center' }}>
            <Heart size={64} className="text-muted" />
            <h2 className="font-serif">Sign in to view your wishlist</h2>
            <Link to="/auth" className="btn btn-primary">Sign In</Link>
          </div>
        ) : loading ? (
          <div className="grid-products">
            {Array(6).fill(0).map((_, i) => (
              <div key={i}>
                <div className="skeleton" style={{ aspectRatio: '3/4', borderRadius: 'var(--radius-lg)' }} />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex-col items-center justify-center" style={{ minHeight: 300, gap: 'var(--space-4)', display: 'flex', textAlign: 'center' }}>
            <Heart size={64} className="text-muted" />
            <h2 className="font-serif">Your wishlist is empty</h2>
            <p className="text-muted">Save your favourite pieces here</p>
            <Link to="/shop" className="btn btn-primary">Browse Collection <ShoppingBag size={16} /></Link>
          </div>
        ) : (
          <div className="grid-products">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
