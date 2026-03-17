import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const SelectRole = () => {
  const [searchParams]     = useSearchParams();
  const navigate           = useNavigate();
  const { loginWithToken } = useAuth();

  const [role, setRole]       = useState('MEMBER');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const token = searchParams.get('token');
  const id    = searchParams.get('id');
  const name  = searchParams.get('name');
  const email = searchParams.get('email');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // ✅ First login with token so api.js attaches it to requests
      loginWithToken({ token, id, name, email, role });

      // ✅ Update role in backend
      await api.put(`/api/users/${id}`,
        { name, role },  // send both name and role
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ Navigate to dashboard
      navigate('/dashboard');

    } catch (err) {
      console.error('Error updating role:', err);
      console.error('Error response:', err.response?.data);
      setError(err.response?.data?.message || 'Failed to update role. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <span style={{ fontSize: 24 }}>⬡</span> PMS
        </div>

        <h1 className="auth-title">One more step!</h1>
        <p className="auth-subtitle">
          Welcome <strong>{name}</strong>! Please select your role to continue.
        </p>

        {error && <div className="alert alert-error">⚠ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Select Role</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
              {[
                { value: 'MEMBER',  label: 'Member',  desc: 'Work on assigned tasks' },
                { value: 'MANAGER', label: 'Manager', desc: 'Create projects and assign tasks' },
                { value: 'ADMIN',   label: 'Admin',   desc: 'Full access to everything' },
              ].map(r => (
                <div
                  key={r.value}
                  onClick={() => setRole(r.value)}
                  style={{
                    padding: '14px 16px',
                    border: `2px solid ${role === r.value ? 'var(--accent)' : 'var(--border)'}`,
                    borderRadius: 'var(--radius)',
                    cursor: 'pointer',
                    background: role === r.value ? 'var(--accent-dim)' : 'var(--bg-secondary)',
                    transition: 'var(--transition)',
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <div>
                      <div style={{
                        fontSize: 14, fontWeight: 600,
                        color: role === r.value ? 'var(--accent)' : 'var(--text-primary)',
                      }}>
                        {r.label}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                        {r.desc}
                      </div>
                    </div>
                    <div style={{
                      width: 18, height: 18,
                      borderRadius: '50%',
                      border: `2px solid ${role === r.value ? 'var(--accent)' : 'var(--border)'}`,
                      background: role === r.value ? 'var(--accent)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {role === r.value && (
                        <div style={{
                          width: 6, height: 6,
                          borderRadius: '50%',
                          background: 'white',
                        }} />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="btn-auth"
            disabled={loading}
            style={{ marginTop: 8 }}
          >
            {loading ? 'Saving...' : 'Continue →'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SelectRole;