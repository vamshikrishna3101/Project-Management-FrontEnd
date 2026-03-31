import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { getErrorMessage } from '../utils/helpers';

const ForgotPassword = () => {
  const [email, setEmail]     = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError]     = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await api.post('/api/auth/forgot-password', { email });
      setSuccess('Password reset link sent! Check your email.');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo"><span style={{ fontSize: 24 }}>⬡</span> PMS</div>
        <h1 className="auth-title">Forgot Password?</h1>
        <p className="auth-subtitle">Enter your email and we'll send you a reset link</p>

        {error   && <div className="alert alert-error">⚠ {error}</div>}
        {success && <div className="alert alert-success">✓ {success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-control" placeholder="you@example.com"
              value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <button type="submit" className="btn-auth" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="auth-footer">
          Remember your password? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;