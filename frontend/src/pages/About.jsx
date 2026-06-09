import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf, Heart, Sparkles } from 'lucide-react';
import './About.css';

const VALUES = [
  { icon: Leaf, title: 'Sustainable', desc: 'We source from ethical manufacturers who prioritise people and planet equally.' },
  { icon: Heart, title: 'Woman-First', desc: 'Every collection is designed around real women — diverse, powerful, and unique.' },
  { icon: Sparkles, title: 'Curated', desc: 'Our team handpicks each piece so you never have to sift through noise.' },
];

const TEAM = [
  { name: 'Ananya Mehta', role: 'Founder & Creative Director', img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80&fit=crop&crop=face' },
  { name: 'Priya Nair', role: 'Head of Curation', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80&fit=crop&crop=face' },
  { name: 'Rhea Kapoor', role: 'Brand & Marketing Lead', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80&fit=crop&crop=face' },
];

export default function About() {
  useEffect(() => { document.title = 'About Us | ThreadTheory'; }, []);

  return (
    <div className="about-page page-enter" style={{ paddingTop: 80 }}>
      {/* Hero */}
      <section className="about-hero">
        <img src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1400&q=80&fit=crop" alt="About ThreadTheory" className="about-hero-bg" />
        <div className="about-hero-overlay" />
        <motion.div className="container about-hero-content" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <span className="overline">Our Story</span>
          <h1 className="about-hero-title">Where Every Thread<br />Tells a Story</h1>
        </motion.div>
      </section>

      {/* Story */}
      <section className="section">
        <div className="container">
          <div className="about-story-grid">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="overline">The Beginning</span>
              <h2 style={{ marginBottom: 'var(--space-5)', marginTop: 'var(--space-3)' }}>Born from a Passion for Fashion</h2>
              <p className="lead" style={{ marginBottom: 'var(--space-5)' }}>ThreadTheory started as a dream to bring curated, high-quality women's fashion to every doorstep in India — without compromise on ethics, sustainability, or style.</p>
              <p style={{ color: 'var(--clr-text-2)', lineHeight: 1.8 }}>We believe that getting dressed should be a joyful ritual, not a chore. Every piece in our collection is thoughtfully selected to make you feel confident, elegant, and unmistakably you. From flowing dresses to structured outerwear, our curation spans every mood and moment of a modern woman's life.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <img src="https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&q=80&fit=crop" alt="Our Story" className="about-story-img" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section" style={{ background: 'var(--clr-bg-2)' }}>
        <div className="container">
          <div className="section-heading">
            <span className="overline">What We Stand For</span>
            <h2>Our Values</h2>
          </div>
          <div className="grid-3" style={{ gap: 'var(--space-8)' }}>
            {VALUES.map((v, i) => (
              <motion.div key={v.title} className="card-glass about-value-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="about-value-icon"><v.icon size={24} /></div>
                <h3 style={{ fontSize: '1.3rem' }}>{v.title}</h3>
                <p style={{ color: 'var(--clr-text-2)', fontSize: '0.9rem', lineHeight: 1.7 }}>{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <span className="overline">The Faces Behind ThreadTheory</span>
            <h2>Meet the Team</h2>
          </div>
          <div className="grid-3 about-team-grid">
            {TEAM.map((member, i) => (
              <motion.div key={member.name} className="about-team-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="about-team-img-wrap">
                  <img src={member.img} alt={member.name} className="about-team-img" />
                </div>
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 400 }}>{member.name}</h4>
                <p style={{ color: 'var(--clr-gold)', fontSize: '0.8rem', letterSpacing: '0.08em' }}>{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: 'var(--space-16) 0', textAlign: 'center', background: 'var(--clr-bg-2)' }}>
        <div className="container">
          <span className="overline">Ready to Explore?</span>
          <h2 style={{ margin: 'var(--space-4) 0' }}>Discover Your Next Favourite Piece</h2>
          <Link to="/shop" className="btn btn-primary btn-lg" id="about-shop-btn">Shop the Collection <ArrowRight size={18} /></Link>
        </div>
      </section>
    </div>
  );
}
