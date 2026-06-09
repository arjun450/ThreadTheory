import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  useEffect(() => { document.title = 'Contact | ThreadTheory'; }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <div className="page-enter" style={{ paddingTop: 80, minHeight: '100vh', paddingBottom: 'var(--space-16)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', padding: 'var(--space-12) 0 var(--space-10)' }}>
          <span className="overline">Get in Touch</span>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', marginTop: 'var(--space-3)' }}>We'd Love to Hear From You</h1>
          <p className="lead" style={{ maxWidth: 480, margin: 'var(--space-4) auto 0' }}>Questions about an order, styling advice, or just want to say hello — we're here.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 'var(--space-12)', alignItems: 'flex-start' }}>
          {/* Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {[
              { icon: Mail, label: 'Email', value: 'hello@threadtheory.in', href: 'mailto:hello@threadtheory.in' },
              { icon: Phone, label: 'Phone', value: '+91 98765 43210', href: 'tel:+919876543210' },
              { icon: MapPin, label: 'Address', value: 'Mumbai, Maharashtra, India' },
            ].map(({ icon: Icon, label, value, href }) => (
              <motion.div key={label} className="card-glass" style={{ padding: 'var(--space-5)', display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start', borderRadius: 'var(--radius-lg)' }} whileHover={{ y: -2 }}>
                <div style={{ width: 44, height: 44, background: 'var(--clr-gold-muted)', border: '1px solid var(--clr-gold)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--clr-gold)', flexShrink: 0 }}>
                  <Icon size={18} />
                </div>
                <div>
                  <p style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--clr-gold)', marginBottom: 4 }}>{label}</p>
                  {href ? <a href={href} style={{ color: 'var(--clr-text-2)', fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'var(--clr-gold)'} onMouseLeave={e => e.target.style.color = 'var(--clr-text-2)'}>{value}</a> : <p style={{ color: 'var(--clr-text-2)', fontSize: '0.9rem' }}>{value}</p>}
                </div>
              </motion.div>
            ))}

            <div className="card-glass" style={{ padding: 'var(--space-5)', borderRadius: 'var(--radius-lg)' }}>
              <p style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--clr-gold)', marginBottom: 'var(--space-3)' }}>Store Hours</p>
              {[['Mon – Fri', '10:00 AM – 7:00 PM'], ['Saturday', '11:00 AM – 6:00 PM'], ['Sunday', 'Closed']].map(([day, time]) => (
                <div key={day} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--clr-border)', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--clr-text-2)' }}>{day}</span>
                  <span style={{ color: time === 'Closed' ? 'var(--clr-error)' : 'var(--clr-text)' }}>{time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <form className="card" style={{ padding: 'var(--space-8)', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }} onSubmit={handleSubmit} id="contact-form">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="contact-name">Name</label>
                <input className="form-input" id="contact-name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required placeholder="Your name" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="contact-email">Email</label>
                <input className="form-input" type="email" id="contact-email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required placeholder="your@email.com" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="contact-subject">Subject</label>
              <input className="form-input" id="contact-subject" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} required placeholder="How can we help?" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="contact-message">Message</label>
              <textarea className="form-input" id="contact-message" rows={6} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} required placeholder="Tell us more..." style={{ resize: 'vertical' }} />
            </div>
            {sent && <div className="toast success" style={{ position: 'static', animation: 'none' }}>✓ Message sent! We'll get back to you within 24 hours.</div>}
            <button type="submit" className="btn btn-primary btn-lg" id="contact-submit-btn">
              <Send size={16} /> Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
