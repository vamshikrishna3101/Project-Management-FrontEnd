import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import projectService from '../services/projectService';
import { getStatusOptions, getPriorityOptions, getErrorMessage } from '../utils/helpers';

const CreateProject = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', description: '', status: 'PLANNING',
    priority: 'MEDIUM', startDate: '', endDate: '',
  });
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
      const payload = {
        ...form,
        startDate: form.startDate || null,
        endDate:   form.endDate   || null,
      };
      await projectService.createProject(payload);
      navigate('/projects');
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
          <h1 className="page-title">Create Project</h1>
          <p className="page-subtitle">Set up a new project for your team</p>
        </div>
        <Link to="/projects" className="btn btn-secondary">← Back</Link>
      </div>

      <div style={{ maxWidth: 640 }}>
        <div className="card">
          {error && <div className="alert alert-error">⚠ {error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Project Name *</label>
              <input
                type="text" name="name" className="form-control"
                placeholder="My Awesome Project"
                value={form.name} onChange={handleChange} required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                name="description" className="form-control"
                placeholder="Describe the project..."
                value={form.description} onChange={handleChange}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select name="status" className="form-control" value={form.status} onChange={handleChange}>
                  {getStatusOptions().map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Priority</label>
                <select name="priority" className="form-control" value={form.priority} onChange={handleChange}>
                  {getPriorityOptions().map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Start Date</label>
                <input type="date" name="startDate" className="form-control" value={form.startDate} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">End Date</label>
                <input type="date" name="endDate" className="form-control" value={form.endDate} onChange={handleChange} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Creating...' : '+ Create Project'}
              </button>
              <Link to="/projects" className="btn btn-secondary">Cancel</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
