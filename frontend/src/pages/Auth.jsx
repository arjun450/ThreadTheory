import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './Auth.css';

export default function Auth() {
  const [mode, setMode] = useState('login'); // login | register
  const [showPassword, setShowPassword] = useState(false);
  useEffect(() => { document.title = 'Sign In | ThreadTheory'; }, []);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', fullName: '' });
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        await signIn(form.email, form.password);
        toast.success('Welcome back!');
      } else {
        await signUp(form.email, form.password, form.fullName);
        toast.success('Account created! Check your email to verify.');
      }
      navigate('/');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="auth-page page-enter">
      <div className="auth-visual">
        <img src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80&fit=crop" alt="ThreadTheory" className="auth-bg" />
        <div className="auth-visual-overlay" />
        <div className="auth-visual-content">
          <Link to="/" className="auth-logo">ThreadTheory</Link>
          <h2 className="auth-tagline">Curated for the<br/>Modern Woman</h2>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-form-container">
          <div className="auth-tabs">
            <button className={`auth-tab ${mode === 'login' ? 'active' : ''}`} onClick={() => setMode('login')} id="login-tab">Sign In</button>
            <button className={`auth-tab ${mode === 'register' ? 'active' : ''}`} onClick={() => setMode('register')} id="register-tab">Create Account</button>
          </div>

          <motion.form key={mode} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} onSubmit={handleSubmit} className="auth-fields" id={`${mode}-form`}>
            {mode === 'register' && (
              <div className="form-group">
                <label className="form-label" htmlFor="fullName">Full Name</label>
                <div className="input-icon-wrap">
                  <User size={16} className="input-icon" />
                  <input type="text" name="fullName" id="fullName" className="form-input input-with-icon" placeholder="Your full name" value={form.fullName} onChange={handleChange} required />
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="email">Email</label>
              <div className="input-icon-wrap">
                <Mail size={16} className="input-icon" />
                <input type="email" name="email" id="email" className="form-input input-with-icon" placeholder="your@email.com" value={form.email} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <div className="input-icon-wrap">
                <Lock size={16} className="input-icon" />
                <input type={showPassword ? 'text' : 'password'} name="password" id="password" className="form-input input-with-icon input-with-icon-right" placeholder="••••••••" value={form.password} onChange={handleChange} required minLength={6} />
                <button type="button" className="input-icon-right" onClick={() => setShowPassword(s => !s)} aria-label="Toggle password">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full btn-lg" disabled={loading} id="auth-submit-btn">
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </motion.form>

          <div className="auth-divider"><span>or</span></div>

          <button className="btn btn-outline w-full google-btn" onClick={handleGoogle} id="google-auth-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <p className="auth-footer-text">
            {mode === 'login'
              ? <>Don't have an account? <button className="auth-link" onClick={() => setMode('register')}>Create one</button></>
              : <>Already have an account? <button className="auth-link" onClick={() => setMode('login')}>Sign in</button></>
            }
          </p>
        </div>
      </div>
    </div>
  );
}
