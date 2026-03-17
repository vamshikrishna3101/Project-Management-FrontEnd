import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { getErrorMessage } from '../utils/helpers';

const Users = () => {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    api.get('/api/users')
      .then(r => setUsers(r.data))
      .catch(err => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await api.delete(`/api/users/${id}`);
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>;

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Users</h1>
          <p className="page-subtitle">{users.length} registered users</p>
        </div>
      </div>

      {error && <div className="alert alert-error">⚠ {error}</div>}

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>#{u.id}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 32, height: 32,
                      background: 'var(--accent)',
                      borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 700, color: 'white',
                      flexShrink: 0,
                    }}>
                      {u.name?.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontWeight: 500 }}>{u.name}</span>
                  </div>
                </td>
                <td style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                <td>
                  <span className={`badge ${
                    u.role === 'ADMIN'   ? 'badge-critical' :
                    u.role === 'MANAGER' ? 'badge-in_progress' :
                    'badge-todo'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(u.id)}
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">◉</div>
            <h3>No users found</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
