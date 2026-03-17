import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import projectService from '../services/projectService';
import { formatDate, truncate, getErrorMessage } from '../utils/helpers';

const Projects = () => {
  const [projects, setProjects]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [search, setSearch]       = useState('');
const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await projectService.getAllProjects();
      console.log('Projects response:', data);  // ✅ add this
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log('Projects error:', err.response);  // ✅ add this
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await projectService.deleteProject(id);
      setProjects(projects.filter(p => p.id !== id));
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const filtered = projects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>;

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Projects</h1>
          <p className="page-subtitle">{projects.length} total projects</p>
        </div>
        <Link to="/projects/create" className="btn btn-primary">+ New Project</Link>
      </div>

      {error && <div className="alert alert-error">⚠ {error}</div>}

      {/* Search */}
      <div style={{ marginBottom: 24 }}>
        <input
          type="text"
          className="form-control"
          placeholder="Search projects..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 360 }}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">◈</div>
          <h3>No projects found</h3>
          <p>Create your first project to get started</p>
        </div>
      ) : (
        <div className="card-grid">
          {filtered.map(project => (
            <div key={project.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700 }}>{project.name}</h3>
                <span className={`badge badge-${project.status?.toLowerCase()}`}>{project.status}</span>
              </div>

              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.6 }}>
                {truncate(project.description, 80) || 'No description'}
              </p>

              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                <span className={`badge badge-${project.priority?.toLowerCase()}`}>{project.priority}</span>
              </div>

              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>
                {formatDate(project.startDate)} → {formatDate(project.endDate)}
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <Link to={`/projects/${project.id}`} className="btn btn-secondary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                  View
                </Link>
                <button onClick={() => handleDelete(project.id)} className="btn btn-danger btn-sm">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
