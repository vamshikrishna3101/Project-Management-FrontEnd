import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage, getRoleOptions } from '../utils/helpers';

const Register = () => {
  const navigate      = useNavigate();
  const { register }  = useAuth();

  const [form, setForm]       = useState({ name: '', email: '', password: '', role: 'MEMBER' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(form.name, form.email, form.password, form.role);
      navigate('/dashboard');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // ✅ Google signup
  const handleGoogleSignup = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <span style={{ fontSize: 24 }}>⬡</span> PMS
        </div>

        <h1 className="auth-title">Create account</h1>
        <p className="auth-subtitle">Get started with your free account</p>

        {error && <div className="alert alert-error">⚠ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text" name="name" className="form-control"
              placeholder="John Doe"
              value={form.name} onChange={handleChange} required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email" name="email" className="form-control"
              placeholder="you@example.com"
              value={form.email} onChange={handleChange} required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password" name="password" className="form-control"
              placeholder="Min. 6 characters"
              value={form.password} onChange={handleChange}
              required minLength={6}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Role</label>
            <select name="role" className="form-control"
              value={form.role} onChange={handleChange}>
              {getRoleOptions().map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn-auth" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        {/* ✅ Divider */}
        <div style={{
          display: 'flex', alignItems: 'center',
          gap: 12, margin: '20px 0',
        }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>OR</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

        {/* ✅ Google Button */}
        <button
          type="button"
          onClick={handleGoogleSignup}
          style={{
            width: '100%', padding: '12px',
            background: 'white', color: '#333',
            border: '1px solid #ddd',
            borderRadius: 'var(--radius)',
            fontSize: 14, fontWeight: 600,
            cursor: 'pointer',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 10,
            transition: 'var(--transition)',
          }}
          onMouseOver={e => e.currentTarget.style.background = '#f5f5f5'}
          onMouseOut={e => e.currentTarget.style.background = 'white'}
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google"
            style={{ width: 20, height: 20 }}
          />
          Sign up with Google
        </button>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;