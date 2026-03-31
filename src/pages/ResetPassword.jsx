import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import { getErrorMessage } from '../utils/helpers';

const ResetPassword = () => {
  const [searchParams]    = useSearchParams();
  const navigate          = useNavigate();
  const [newPassword, setNewPassword]         = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');
  const token = searchParams.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) { setError('Passwords do not match'); return; }
    if (newPassword.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    setError('');
    try {
      await api.post('/api/auth/reset-password', { token, newPassword });
      setSuccess('Password reset successfully! Redirecting...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (!token) return (
    <div className="auth-page"><div className="auth-card">
      <div className="alert alert-error">⚠ Invalid reset link</div>
      <Link to="/forgot-password" className="btn btn-primary">Request New Link</Link>
    </div></div>
  );

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo"><span style={{ fontSize: 24 }}>⬡</span> PMS</div>
        <h1 className="auth-title">Reset Password</h1>
        <p className="auth-subtitle">Enter your new password below</p>

        {error   && <div className="alert alert-error">⚠ {error}</div>}
        {success && <div className="alert alert-success">✓ {success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">New Password</label>
            <input type="password" className="form-control" placeholder="Min. 6 characters"
              value={newPassword} onChange={e => setNewPassword(e.target.value)} required minLength={6} />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input type="password" className="form-control" placeholder="Confirm your password"
              value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn-auth" disabled={loading || !!success}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
        <div className="auth-footer"><Link to="/login">Back to Login</Link></div>
      </div>
    </div>
  );
};

export default ResetPassword;