import React, { useEffect, useState } from 'react';
import auditService from '../services/auditService';
import { getErrorMessage } from '../utils/helpers';

const AuditLogs = () => {
  const [logs, setLogs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [filter, setFilter]   = useState('ALL');
  const [search, setSearch]   = useState('');

  useEffect(() => {
    auditService.getAllLogs()
      .then(data => setLogs(Array.isArray(data) ? data : []))
      .catch(err => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const filtered = logs.filter(log => {
    const matchesFilter = filter === 'ALL' || log.entityType === filter;
    const matchesSearch = search === '' ||
      log.details?.toLowerCase().includes(search.toLowerCase()) ||
      log.performedBy?.name?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getActionColor = (action) => {
    switch (action) {
      case 'CREATED': return 'var(--success)';
      case 'UPDATED': return 'var(--accent)';
      case 'DELETED': return 'var(--danger)';
      default:        return 'var(--text-muted)';
    }
  };

  const getActionBg = (action) => {
    switch (action) {
      case 'CREATED': return 'var(--success-dim)';
      case 'UPDATED': return 'var(--accent-dim)';
      case 'DELETED': return 'var(--danger-dim)';
      default:        return 'var(--bg-hover)';
    }
  };

  const getEntityIcon = (type) => {
    switch (type) {
      case 'PROJECT': return '◈';
      case 'TASK':    return '◎';
      case 'COMMENT': return '💬';
      case 'USER':    return '◉';
      default:        return '⬡';
    }
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>;

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Audit Logs</h1>
          <p className="page-subtitle">{logs.length} total activity records</p>
        </div>
      </div>

      {error && <div className="alert alert-error">⚠ {error}</div>}

      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card success">
          <div className="stat-label">Created</div>
          <div className="stat-value">{logs.filter(l => l.action === 'CREATED').length}</div>
        </div>
        <div className="stat-card accent">
          <div className="stat-label">Updated</div>
          <div className="stat-value">{logs.filter(l => l.action === 'UPDATED').length}</div>
        </div>
        <div className="stat-card danger">
          <div className="stat-label">Deleted</div>
          <div className="stat-value">{logs.filter(l => l.action === 'DELETED').length}</div>
        </div>
        <div className="stat-card warning">
          <div className="stat-label">Total</div>
          <div className="stat-value">{logs.length}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <input
          type="text" className="form-control"
          placeholder="Search logs..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 260 }}
        />
        <div style={{ display: 'flex', gap: 8 }}>
          {['ALL', 'PROJECT', 'TASK', 'COMMENT', 'USER'].map(f => (
            <button
              key={f} onClick={() => setFilter(f)} className="btn btn-sm"
              style={{
                background: filter === f ? 'var(--accent)' : 'var(--bg-card)',
                color: filter === f ? 'white' : 'var(--text-secondary)',
                border: `1px solid ${filter === f ? 'var(--accent)' : 'var(--border)'}`,
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Action</th>
              <th>Entity</th>
              <th>Details</th>
              <th>Performed By</th>
              <th>Date & Time</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(log => (
              <tr key={log.id}>
                <td>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center',
                    padding: '3px 10px', borderRadius: 999,
                    fontSize: 11, fontWeight: 600,
                    textTransform: 'uppercase', letterSpacing: '0.5px',
                    background: getActionBg(log.action),
                    color: getActionColor(log.action),
                  }}>
                    {log.action}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 16 }}>{getEntityIcon(log.entityType)}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{log.entityType}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>ID: {log.entityId}</div>
                    </div>
                  </div>
                </td>
                <td style={{
                  fontSize: 13, color: 'var(--text-secondary)',
                  maxWidth: 300, overflow: 'hidden',
                  textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {log.details}
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 28, height: 28, background: 'var(--accent)',
                      borderRadius: '50%', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: 11, fontWeight: 700,
                      color: 'white', flexShrink: 0,
                    }}>
                      {log.performedBy?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{log.performedBy?.name || '—'}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{log.performedBy?.role}</div>
                    </div>
                  </div>
                </td>
                <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {formatDateTime(log.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">⬡</div>
            <h3>No logs found</h3>
            <p>No activity recorded yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLogs;