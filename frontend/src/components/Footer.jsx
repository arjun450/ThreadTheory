import { Link } from 'react-router-dom';
import { Globe, Share2, Rss, Mail, MapPin, Phone } from 'lucide-react';
import './Footer.css';

const CATEGORIES = [
  { name: 'Dresses', slug: 'dresses' },
  { name: 'Tops & Blouses', slug: 'tops-blouses' },
  { name: 'Bottoms', slug: 'bottoms' },
  { name: 'Outerwear', slug: 'outerwear' },
  { name: 'Loungewear & Sets', slug: 'loungewear-sets' },
  { name: 'Accessories', slug: 'accessories' },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <img src="/logo.png" alt="ThreadTheory" className="footer-logo-img" />
              <span>ThreadTheory</span>
            </Link>
            <p className="footer-tagline">Curated women's fashion for the modern soul. Timeless elegance, contemporary spirit.</p>
            <div className="footer-social">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="social-link"><Globe size={18} /></a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter" className="social-link"><Share2 size={18} /></a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="Youtube" className="social-link"><Rss size={18} /></a>
            </div>
          </div>

          {/* Shop links */}
          <div className="footer-col">
            <h5 className="footer-col-title">Shop</h5>
            <ul className="footer-links">
              {CATEGORIES.map(cat => (
                <li key={cat.slug}>
                  <Link to={`/shop?category=${cat.slug}`} className="footer-link">{cat.name}</Link>
                </li>
              ))}
              <li><Link to="/shop" className="footer-link">View All</Link></li>
            </ul>
          </div>

          {/* Company links */}
          <div className="footer-col">
            <h5 className="footer-col-title">Company</h5>
            <ul className="footer-links">
              <li><Link to="/about" className="footer-link">About Us</Link></li>
              <li><Link to="/contact" className="footer-link">Contact</Link></li>
              <li><Link to="/about#story" className="footer-link">Our Story</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h5 className="footer-col-title">Contact</h5>
            <ul className="footer-contact-list">
              <li><Mail size={14} /><span>hello@threadtheory.in</span></li>
              <li><Phone size={14} /><span>+91 98765 43210</span></li>
              <li><MapPin size={14} /><span>Mumbai, Maharashtra, India</span></li>
            </ul>
            <div className="footer-newsletter">
              <p className="footer-newsletter-title">Stay in the loop</p>
              <form className="footer-form" onSubmit={e => e.preventDefault()}>
                <input type="email" placeholder="your@email.com" className="footer-email-input" id="footer-email-input" />
                <button type="submit" className="btn btn-primary btn-sm">Subscribe</button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p className="footer-copyright">© {new Date().getFullYear()} ThreadTheory. All rights reserved.</p>
          <div className="footer-legal">
            <a href="#" className="footer-legal-link">Privacy Policy</a>
            <a href="#" className="footer-legal-link">Terms of Service</a>
            <a href="#" className="footer-legal-link">Return Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
