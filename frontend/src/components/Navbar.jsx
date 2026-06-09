import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, Search, Menu, X, User, LogOut, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import './Navbar.css';

const CATEGORIES = [
  { name: 'Dresses', slug: 'dresses' },
  { name: 'Tops & Blouses', slug: 'tops-blouses' },
  { name: 'Bottoms', slug: 'bottoms' },
  { name: 'Outerwear', slug: 'outerwear' },
  { name: 'Loungewear & Sets', slug: 'loungewear-sets' },
  { name: 'Accessories', slug: 'accessories' },
];

export default function Navbar({ onCartOpen }) {
  const { user, signOut } = useAuth();
  const { itemCount } = useCart();
  const { items: wishlistItems } = useWishlist();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <>
      <header className={`navbar ${scrolled ? 'scrolled' : ''}`} id="navbar">
        <div className="container navbar-inner">
          {/* Logo */}
          <Link to="/" className="navbar-logo" onClick={() => setMobileOpen(false)}>
            <img src="/logo.png" alt="ThreadTheory" className="navbar-logo-img" />
            <span className="navbar-logo-text">ThreadTheory</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="navbar-nav" aria-label="Main navigation">
            <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} end>Home</NavLink>

            <div className="nav-dropdown" onMouseEnter={() => setShopOpen(true)} onMouseLeave={() => setShopOpen(false)}>
              <NavLink to="/shop" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Shop <ChevronDown size={14} />
              </NavLink>
              <AnimatePresence>
                {shopOpen && (
                  <motion.div className="dropdown-menu" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.2 }}>
                    <Link to="/shop" className="dropdown-item dropdown-item-all">All Products</Link>
                    <div className="dropdown-divider" />
                    {CATEGORIES.map(cat => (
                      <Link key={cat.slug} to={`/shop?category=${cat.slug}`} className="dropdown-item">{cat.name}</Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <NavLink to="/about" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>About</NavLink>
            <NavLink to="/contact" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Contact</NavLink>
          </nav>

          {/* Actions */}
          <div className="navbar-actions">
            <button className="nav-icon-btn" onClick={() => setSearchOpen(true)} aria-label="Search" id="nav-search-btn">
              <Search size={18} />
            </button>

            <Link to="/wishlist" className="nav-icon-btn" aria-label="Wishlist" id="nav-wishlist-btn">
              <Heart size={18} />
              {wishlistItems.length > 0 && <span className="nav-badge">{wishlistItems.length}</span>}
            </Link>

            <button className="nav-icon-btn" onClick={onCartOpen} aria-label="Cart" id="nav-cart-btn">
              <ShoppingBag size={18} />
              {itemCount > 0 && <span className="nav-badge">{itemCount}</span>}
            </button>

            {user ? (
              <div className="nav-user" onClick={() => setUserMenuOpen(o => !o)}>
                <button className="nav-icon-btn" aria-label="Account" id="nav-user-btn">
                  <User size={18} />
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div className="user-menu" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}>
                      <div className="user-menu-header">
                        <p className="text-sm">{user.email}</p>
                      </div>
                      <Link to="/account/orders" className="user-menu-item" onClick={() => setUserMenuOpen(false)}>My Orders</Link>
                      <Link to="/wishlist" className="user-menu-item" onClick={() => setUserMenuOpen(false)}>Wishlist</Link>
                      {user.user_metadata?.role === 'admin' && (
                        <Link to="/admin" className="user-menu-item" onClick={() => setUserMenuOpen(false)}>Admin Panel</Link>
                      )}
                      <div className="dropdown-divider" />
                      <button className="user-menu-item user-menu-signout" onClick={handleSignOut}>
                        <LogOut size={14} /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/auth" className="btn btn-outline btn-sm" id="nav-signin-btn">Sign In</Link>
            )}

            <button className="nav-hamburger" onClick={() => setMobileOpen(o => !o)} aria-label="Menu" id="nav-mobile-menu-btn">
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Search bar overlay */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div className="search-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <form className="search-form" onSubmit={handleSearch}>
                <Search size={18} className="search-icon" />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search for dresses, tops, accessories..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="search-input"
                  id="navbar-search-input"
                />
                <button type="button" className="search-close" onClick={() => setSearchOpen(false)}>
                  <X size={18} />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div className="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} />
            <motion.nav className="mobile-menu" initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'tween', duration: 0.3 }}>
              <div className="mobile-menu-header">
                <span className="navbar-logo-text">ThreadTheory</span>
                <button onClick={() => setMobileOpen(false)}><X size={20} /></button>
              </div>
              <div className="mobile-nav-links">
                <Link to="/" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>Home</Link>
                <Link to="/shop" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>All Products</Link>
                {CATEGORIES.map(cat => (
                  <Link key={cat.slug} to={`/shop?category=${cat.slug}`} className="mobile-nav-link mobile-nav-sub" onClick={() => setMobileOpen(false)}>
                    {cat.name}
                  </Link>
                ))}
                <Link to="/about" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>About</Link>
                <Link to="/contact" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>Contact</Link>
              </div>
              <div className="mobile-menu-footer">
                {user ? (
                  <>
                    <Link to="/account/orders" className="btn btn-outline w-full" onClick={() => setMobileOpen(false)}>My Orders</Link>
                    <button className="btn btn-ghost w-full" onClick={() => { handleSignOut(); setMobileOpen(false); }}>Sign Out</button>
                  </>
                ) : (
                  <Link to="/auth" className="btn btn-primary w-full" onClick={() => setMobileOpen(false)}>Sign In / Register</Link>
                )}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
