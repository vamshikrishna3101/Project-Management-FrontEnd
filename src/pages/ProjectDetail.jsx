import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import projectService from '../services/projectService';
import taskService from '../services/taskService';
import CommentSection from '../components/CommentSection';
import { formatDate, getErrorMessage } from '../utils/helpers';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject]               = useState(null);
  const [tasks, setTasks]                   = useState([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [p, t] = await Promise.all([
          projectService.getProjectById(id),
          taskService.getTasksByProject(id),
        ]);
        setProject(p);
        setTasks(Array.isArray(t) ? t : []);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await projectService.deleteProject(id);
      navigate('/projects');
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>;
  if (error)   return <div className="page-wrapper"><div className="alert alert-error">⚠ {error}</div></div>;
  if (!project) return null;

  const inProgressCount = tasks.filter(t => t.status === 'IN_PROGRESS').length;
  const doneCount       = tasks.filter(t => t.status === 'DONE').length;

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">{project.name}</h1>
          <p className="page-subtitle">Project Details</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/projects" className="btn btn-secondary">← Back</Link>
          <button onClick={handleDelete} className="btn btn-danger">Delete</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 24 }}>
        <div className="card">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
            Project Info
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Status</span>
              <span className={`badge badge-${project.status?.toLowerCase()}`}>{project.status}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Priority</span>
              <span className={`badge badge-${project.priority?.toLowerCase()}`}>{project.priority}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Start Date</span>
              <span style={{ fontSize: 13 }}>{formatDate(project.startDate)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>End Date</span>
              <span style={{ fontSize: 13 }}>{formatDate(project.endDate)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Owner</span>
              <span style={{ fontSize: 13 }}>{project.owner?.name || '—'}</span>
            </div>
          </div>
          {project.description && (
            <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 8 }}>Description</div>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                {project.description}
              </p>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="stat-card accent">
            <div className="stat-label">Total Tasks</div>
            <div className="stat-value">{tasks.length}</div>
          </div>
          <div className="stat-card warning">
            <div className="stat-label">In Progress</div>
            <div className="stat-value">{inProgressCount}</div>
          </div>
          <div className="stat-card success">
            <div className="stat-label">Done</div>
            <div className="stat-value">{doneCount}</div>
          </div>
        </div>
      </div>

      {/* Tasks */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700 }}>Tasks</h2>
        <Link to="/tasks/create" className="btn btn-primary btn-sm">+ Add Task</Link>
      </div>

      <div className="table-wrapper" style={{ marginBottom: 32 }}>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Assignee</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Due Date</th>
              <th>Comments</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(t => (
              <tr key={t.id}>
                <td style={{ fontWeight: 500 }}>{t.title}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{t.assignee?.name || 'Unassigned'}</td>
                <td>
                  <span className={`badge badge-${t.status?.toLowerCase()}`}>
                    {t.status?.replace('_', ' ')}
                  </span>
                </td>
                <td>
                  <span className={`badge badge-${t.priority?.toLowerCase()}`}>{t.priority}</span>
                </td>
                <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{formatDate(t.dueDate)}</td>
                <td>
                  <button
                    onClick={() => setSelectedTaskId(selectedTaskId === t.id ? null : t.id)}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: 12 }}
                  >
                    {selectedTaskId === t.id ? 'Hide' : '💬 Comments'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {tasks.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">◎</div>
            <h3>No tasks yet</h3>
          </div>
        )}
      </div>

      {/* Comment Section */}
      {selectedTaskId && (
        <div className="card">
          <div style={{ marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              Comments for:{' '}
              <strong style={{ color: 'var(--text-primary)' }}>
                {tasks.find(t => t.id === selectedTaskId)?.title}
              </strong>
            </span>
          </div>
          <CommentSection taskId={selectedTaskId} />
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;