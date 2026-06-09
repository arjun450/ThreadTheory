import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { getFeaturedProducts, getCategories } from '../lib/api';
import './Home.css';

const HERO_SLIDES = [
  {
    title: 'Threads of\nTimeless Grace',
    subtitle: 'New Collection — Summer 2026',
    cta: 'Explore Collection',
    href: '/shop',
    gradient: 'linear-gradient(135deg, rgba(10,10,10,0.7) 0%, rgba(10,10,10,0.3) 100%)',
    bg: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1400&q=80&fit=crop',
  },
  {
    title: 'Curated for\nthe Modern Woman',
    subtitle: 'Discover pieces that tell your story',
    cta: 'Shop Dresses',
    href: '/shop?category=dresses',
    gradient: 'linear-gradient(135deg, rgba(10,10,10,0.6) 0%, rgba(10,10,10,0.2) 100%)',
    bg: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400&q=80&fit=crop',
  },
  {
    title: 'Effortless\nElegance',
    subtitle: 'New arrivals in Tops & Blouses',
    cta: 'Shop Tops',
    href: '/shop?category=tops-blouses',
    gradient: 'linear-gradient(135deg, rgba(10,10,10,0.5) 0%, rgba(10,10,10,0.2) 100%)',
    bg: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1400&q=80&fit=crop',
  },
];

const TESTIMONIALS = [
  { name: 'Aanya Sharma', text: 'ThreadTheory has completely elevated my wardrobe. Every piece feels luxurious and the quality is unmatched.', rating: 5, location: 'Mumbai' },
  { name: 'Priya Krishnan', text: 'I love how every piece is curated with such care. The dresses are absolutely stunning in person.', rating: 5, location: 'Bangalore' },
  { name: 'Meera Patel', text: 'The quality of fabric and stitching is exceptional. I receive compliments every time I wear ThreadTheory.', rating: 5, location: 'Delhi' },
];

const CATEGORY_SHOWCASE = [
  { name: 'Dresses', slug: 'dresses', img: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=600&q=80&fit=crop', span: 'large' },
  { name: 'Tops & Blouses', slug: 'tops-blouses', img: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600&q=80&fit=crop', span: 'small' },
  { name: 'Outerwear', slug: 'outerwear', img: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&q=80&fit=crop', span: 'small' },
  { name: 'Accessories', slug: 'accessories', img: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&q=80&fit=crop', span: 'small' },
  { name: 'Bottoms', slug: 'bottoms', img: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&q=80&fit=crop', span: 'small' },
];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [heroSlide, setHeroSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const heroInterval = useRef(null);

  useEffect(() => {
    document.title = 'ThreadTheory | Premium Women\'s Boutique';
    Promise.all([getFeaturedProducts(), getCategories()])
      .then(([products, cats]) => { setFeaturedProducts(products); setCategories(cats); })
      .catch(console.error)
      .finally(() => setLoading(false));

    heroInterval.current = setInterval(() => setHeroSlide(s => (s + 1) % HERO_SLIDES.length), 5500);
    return () => clearInterval(heroInterval.current);
  }, []);

  const goSlide = (idx) => {
    setHeroSlide(idx);
    clearInterval(heroInterval.current);
    heroInterval.current = setInterval(() => setHeroSlide(s => (s + 1) % HERO_SLIDES.length), 5500);
  };

  const slide = HERO_SLIDES[heroSlide];

  return (
    <div className="home page-enter">
      {/* ---- HERO ---- */}
      <section className="hero" aria-label="Hero banner" id="hero">
        {HERO_SLIDES.map((s, i) => (
          <div key={i} className={`hero-slide ${i === heroSlide ? 'active' : ''}`}>
            <img src={s.bg} alt="" className="hero-bg" loading={i === 0 ? 'eager' : 'lazy'} />
            <div className="hero-overlay" style={{ background: s.gradient }} />
          </div>
        ))}

        <div className="container hero-content">
          <motion.div key={heroSlide} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="hero-text">
            <p className="overline">{slide.subtitle}</p>
            <h1 className="hero-heading">{slide.title}</h1>
            <Link to={slide.href} className="btn btn-primary btn-lg hero-cta" id="hero-cta-btn">
              {slide.cta} <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>

        {/* Slide controls */}
        <div className="hero-controls">
          <button className="hero-arrow" onClick={() => goSlide((heroSlide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)} aria-label="Previous slide" id="hero-prev-btn"><ChevronLeft size={20} /></button>
          <div className="hero-dots">
            {HERO_SLIDES.map((_, i) => (
              <button key={i} className={`hero-dot ${i === heroSlide ? 'active' : ''}`} onClick={() => goSlide(i)} aria-label={`Go to slide ${i+1}`} id={`hero-dot-${i}`} />
            ))}
          </div>
          <button className="hero-arrow" onClick={() => goSlide((heroSlide + 1) % HERO_SLIDES.length)} aria-label="Next slide" id="hero-next-btn"><ChevronRight size={20} /></button>
        </div>

        {/* Scroll indicator */}
        <div className="hero-scroll-indicator">
          <div className="scroll-line" />
          <span>Scroll</span>
        </div>
      </section>

      {/* ---- MARQUEE ---- */}
      <div className="marquee-bar">
        <div className="marquee-inner">
          {Array(3).fill(['Free shipping over ₹999', 'New arrivals every week', 'Easy returns within 15 days', 'Curated women\'s fashion', 'Premium quality fabrics']).flat().map((text, i) => (
            <span key={i} className="marquee-item"><Star size={10} fill="currentColor" />{text}</span>
          ))}
        </div>
      </div>

      {/* ---- CATEGORIES SHOWCASE ---- */}
      <section className="section" id="categories-section">
        <div className="container">
          <div className="section-heading">
            <span className="overline">Browse by Category</span>
            <h2>Shop the Collection</h2>
            <p>Explore our curated range of women's fashion across every style and occasion</p>
          </div>
          <div className="category-grid">
            {(categories.length ? categories.slice(0, 5) : CATEGORY_SHOWCASE).map((cat, i) => (
              <Link key={cat.slug || i} to={`/shop?category=${cat.slug}`} className={`category-card ${i === 0 ? 'category-card-large' : ''}`} id={`cat-card-${cat.slug}`}>
                <img
                  src={cat.image_url || CATEGORY_SHOWCASE[i % CATEGORY_SHOWCASE.length]?.img}
                  alt={cat.name}
                  className="category-card-img"
                  loading="lazy"
                />
                <div className="category-card-overlay" />
                <div className="category-card-content">
                  <h3 className="category-card-name">{cat.name}</h3>
                  <span className="category-card-link">Shop Now <ArrowRight size={14} /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---- FEATURED PRODUCTS ---- */}
      <section className="section section-featured" id="featured-section">
        <div className="container">
          <div className="section-heading">
            <span className="overline"><Sparkles size={12} style={{display:'inline',marginRight:6}} />Featured Picks</span>
            <h2>This Season's Favourites</h2>
            <p>Hand-selected pieces our team absolutely loves</p>
          </div>

          {loading ? (
            <div className="grid-products">
              {Array(8).fill(0).map((_, i) => (
                <div key={i} className="product-card-skeleton">
                  <div className="skeleton" style={{aspectRatio:'3/4',borderRadius:'var(--radius-lg)'}} />
                  <div style={{padding:'1rem',display:'flex',flexDirection:'column',gap:'0.5rem'}}>
                    <div className="skeleton" style={{height:12,width:'40%',borderRadius:4}} />
                    <div className="skeleton" style={{height:16,width:'80%',borderRadius:4}} />
                    <div className="skeleton" style={{height:14,width:'30%',borderRadius:4}} />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid-products">
              {featuredProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="text-center" style={{padding:'var(--space-16) 0',color:'var(--clr-text-2)'}}>
              <p>New arrivals coming soon. Check back shortly!</p>
              <Link to="/shop" className="btn btn-outline" style={{marginTop:'var(--space-4)'}}>Browse All Products →</Link>
            </div>
          )}

          <div className="text-center" style={{ marginTop: 'var(--space-12)' }}>
            <Link to="/shop" className="btn btn-outline btn-lg" id="view-all-btn">
              View All Products <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ---- BRAND STORY ---- */}
      <section className="section brand-story" id="brand-story">
        <div className="container">
          <div className="brand-story-grid">
            <motion.div className="brand-story-images" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80&fit=crop" alt="ThreadTheory Story" className="brand-img brand-img-main" loading="lazy" />
              <img src="https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=400&q=80&fit=crop" alt="ThreadTheory" className="brand-img brand-img-accent" loading="lazy" />
            </motion.div>
            <motion.div className="brand-story-content" initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <span className="overline">Our Story</span>
              <h2>Where Every Thread Tells a Story</h2>
              <p className="lead">ThreadTheory was born from a simple belief — every woman deserves clothing that makes her feel extraordinary. We curate pieces that blend timeless elegance with contemporary spirit.</p>
              <p className="brand-story-body">Each garment is thoughtfully selected for quality of fabric, craftsmanship, and that ineffable quality of making you feel like the best version of yourself. We work with artisans and ethical manufacturers to bring you fashion that you'll treasure for years.</p>
              <Link to="/about" className="btn btn-outline" id="about-btn">Read Our Story <ArrowRight size={16} /></Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ---- TESTIMONIALS ---- */}
      <section className="section testimonials-section" id="testimonials">
        <div className="container">
          <div className="section-heading">
            <span className="overline">What Our Customers Say</span>
            <h2>Loved by Women Everywhere</h2>
          </div>
          <div className="grid-3 testimonials-grid">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={i} className="testimonial-card card-glass" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}>
                <div className="stars">
                  {Array(t.rating).fill(0).map((_, j) => <Star key={j} size={14} fill="currentColor" className="star" />)}
                </div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <span className="testimonial-name">{t.name}</span>
                  <span className="testimonial-location">{t.location}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- CTA BANNER ---- */}
      <section className="cta-banner" id="cta-banner">
        <div className="cta-banner-bg" />
        <div className="container cta-banner-content">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="overline">Limited Time</span>
            <h2>Free Shipping on Orders Over ₹999</h2>
            <p className="lead">Shop our latest collection and enjoy complimentary delivery straight to your door.</p>
            <Link to="/shop" className="btn btn-primary btn-lg" id="cta-shop-btn">Shop Now <ArrowRight size={18} /></Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
