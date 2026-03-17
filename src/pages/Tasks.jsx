import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import taskService from '../services/taskService';
import { formatDate, truncate, getErrorMessage } from '../utils/helpers';

const Tasks = () => {
  const [tasks, setTasks]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [filter, setFilter]   = useState('ALL');

  useEffect(() => {
    taskService.getMyTasks()
      .then(data => setTasks(Array.isArray(data) ? data : []))  // ✅ fixed here
      .catch(err => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await taskService.deleteTask(id);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const updated = await taskService.updateTaskStatus(id, status);
      setTasks(tasks.map(t => t.id === id ? updated : t));
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const filtered = filter === 'ALL' ? tasks : tasks.filter(t => t.status === filter);

  if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>;

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Tasks</h1>
          <p className="page-subtitle">{tasks.length} tasks assigned to you</p>
        </div>
        <Link to="/tasks/create" className="btn btn-primary">+ New Task</Link>
      </div>

      {error && <div className="alert alert-error">⚠ {error}</div>}

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {['ALL', 'TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className="btn btn-sm"
            style={{
              background: filter === s ? 'var(--accent)' : 'var(--bg-card)',
              color: filter === s ? 'white' : 'var(--text-secondary)',
              border: `1px solid ${filter === s ? 'var(--accent)' : 'var(--border)'}`,
            }}
          >
            {s.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Project</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Due Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(t => (
              <tr key={t.id}>
                <td style={{ fontWeight: 500 }}>{truncate(t.title, 40)}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{t.project?.name || '—'}</td>
                <td>
                  <select
                    value={t.status}
                    onChange={e => handleStatusChange(t.id, e.target.value)}
                    style={{
                      background: 'var(--bg-hover)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '4px 8px',
                      fontSize: 12,
                      cursor: 'pointer',
                    }}
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="IN_REVIEW">In Review</option>
                    <option value="DONE">Done</option>
                  </select>
                </td>
                <td>
                  <span className={`badge badge-${t.priority?.toLowerCase()}`}>
                    {t.priority}
                  </span>
                </td>
                <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                  {formatDate(t.dueDate)}
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">◎</div>
            <h3>No tasks found</h3>
            <p>Create a new task or change your filter</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;