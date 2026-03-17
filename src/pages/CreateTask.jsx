import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import taskService from '../services/taskService';
import projectService from '../services/projectService';
import { getTaskStatusOptions, getPriorityOptions, getErrorMessage } from '../utils/helpers';
import api from '../services/api';

const CreateTask = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', status: 'TODO',
    priority: 'MEDIUM', dueDate: '', projectId: '', assigneeId: '',
  });
  const [projects, setProjects] = useState([]);
  const [users, setUsers]       = useState([]);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [p, u] = await Promise.all([
          projectService.getAllProjects(),
          api.get('/api/users').then(r => r.data),
        ]);
        setProjects(Array.isArray(p) ? p : []);  // ✅ fixed
        setUsers(Array.isArray(u) ? u : []);      // ✅ fixed
      } catch (err) {
        console.error(err);
        setProjects([]);
        setUsers([]);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = {
        ...form,
        projectId:  form.projectId  ? Number(form.projectId)  : null,
        assigneeId: form.assigneeId ? Number(form.assigneeId) : null,
        dueDate:    form.dueDate    || null,
      };
      await taskService.createTask(payload);
      navigate('/tasks');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Create Task</h1>
          <p className="page-subtitle">Add a new task to a project</p>
        </div>
        <Link to="/tasks" className="btn btn-secondary">← Back</Link>
      </div>

      <div style={{ maxWidth: 640 }}>
        <div className="card">
          {error && <div className="alert alert-error">⚠ {error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Task Title *</label>
              <input
                type="text" name="title" className="form-control"
                placeholder="What needs to be done?"
                value={form.title} onChange={handleChange} required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                name="description" className="form-control"
                placeholder="Describe the task in detail..."
                value={form.description} onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Project *</label>
              <select name="projectId" className="form-control" value={form.projectId} onChange={handleChange} required>
                <option value="">— Select Project —</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Assign To</label>
              <select name="assigneeId" className="form-control" value={form.assigneeId} onChange={handleChange}>
                <option value="">— Unassigned —</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select name="status" className="form-control" value={form.status} onChange={handleChange}>
                  {getTaskStatusOptions().map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Priority</label>
                <select name="priority" className="form-control" value={form.priority} onChange={handleChange}>
                  {getPriorityOptions().map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input
                type="date" name="dueDate" className="form-control"
                value={form.dueDate} onChange={handleChange}
              />
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Creating...' : '+ Create Task'}
              </button>
              <Link to="/tasks" className="btn btn-secondary">Cancel</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTask;