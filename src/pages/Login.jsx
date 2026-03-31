import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/helpers';

const Login = () => {
  const navigate  = useNavigate();
  const { login } = useAuth();
  const [form, setForm]       = useState({ email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo"><span style={{ fontSize: 24 }}>⬡</span> PMS</div>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to your account to continue</p>

        {error && <div className="alert alert-error">⚠ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" name="email" className="form-control"
              placeholder="you@example.com" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" name="password" className="form-control"
              placeholder="••••••••" value={form.password} onChange={handleChange} required />
          </div>

          {/* Forgot Password link */}
          <div style={{ textAlign: 'right', marginBottom: 16, marginTop: -8 }}>
            <Link to="/forgot-password" style={{ fontSize: 13, color: 'var(--accent)' }}>
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="btn-auth" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>OR</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

        <button onClick={handleGoogleLogin} style={{
          width: '100%', padding: '12px', background: 'white', color: '#333',
          border: '1px solid #ddd', borderRadius: 'var(--radius)',
          fontSize: 14, fontWeight: 600, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        }}
          onMouseOver={e => e.currentTarget.style.background = '#f5f5f5'}
          onMouseOut={e => e.currentTarget.style.background = 'white'}
        >
          <img src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google" style={{ width: 20, height: 20 }} />
          Continue with Google
        </button>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Create one</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;