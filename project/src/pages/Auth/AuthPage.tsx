import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import './AuthPage.css';

export function AuthPage() {
  const { login, navigate } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email || 'demo@nourishai.com', password || 'demo');
  };

  const handleSocial = () => login('demo@nourishai.com', 'demo');

  return (
    <div className="auth-page">
      <div className="auth-bg" aria-hidden="true">
        {['🥑', '🍓', '🥗', '🍋', '🫐', '🥦', '🍊', '🥕'].map((e, i) => (
          <span key={i} className="auth-food-emoji" style={{ '--i': i } as React.CSSProperties}>{e}</span>
        ))}
      </div>

      <div className="auth-container animate-slide-up">
        <div className="auth-logo">
          <span className="auth-logo-icon">🌿</span>
          <h1 className="auth-logo-text">NourishAI</h1>
          <p className="auth-tagline">Eat Smart. Live Well. One Meal at a Time.</p>
        </div>

        <div className="auth-card card card-padding">
          <div className="auth-tabs">
            <button className={`auth-tab${isLogin ? ' active' : ''}`} onClick={() => setIsLogin(true)}>Sign In</button>
            <button className={`auth-tab${!isLogin ? ' active' : ''}`} onClick={() => setIsLogin(false)}>Sign Up</button>
          </div>

          <div className="auth-social">
            <button className="btn-social" onClick={handleSocial} aria-label="Continue with Google">
              <span className="social-icon">G</span> Continue with Google
            </button>
            <button className="btn-social" onClick={handleSocial} aria-label="Continue with Apple">
              <span className="social-icon">🍎</span> Continue with Apple
            </button>
          </div>

          <div className="auth-divider"><span>or</span></div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label" htmlFor="auth-email">Email</label>
              <input id="auth-email" type="email" className="form-input" placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="auth-password">Password</label>
              <input id="auth-password" type="password" className="form-input" placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)}
                autoComplete={isLogin ? 'current-password' : 'new-password'} />
            </div>
            <button type="submit" className="btn btn-primary btn-full btn-lg">
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <button className="auth-demo-btn" onClick={() => navigate('setup')}>
            👋 New here? Set up your profile →
          </button>
        </div>
      </div>
    </div>
  );
}
