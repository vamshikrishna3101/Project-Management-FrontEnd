import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import projectService from '../services/projectService';
import taskService from '../services/taskService';
import { formatDate, truncate } from '../utils/helpers';

const Dashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks]       = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [p, t] = await Promise.all([
          projectService.getAllProjects(),
          taskService.getMyTasks(),
        ]);
        // ✅ Ensure we always set an array
        setProjects(Array.isArray(p) ? p : []);
        setTasks(Array.isArray(t) ? t : []);
      } catch (err) {
        console.error(err);
        setProjects([]);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>;

  const activeProjects  = projects.filter(p => p.status === 'ACTIVE').length;
  const todoTasks       = tasks.filter(t => t.status === 'TODO').length;
  const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS').length;
  const doneTasks       = tasks.filter(t => t.status === 'DONE').length;

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Here's what's happening today</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/projects/create" className="btn btn-primary">+ New Project</Link>
          <Link to="/tasks/create" className="btn btn-secondary">+ New Task</Link>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card accent">
          <div className="stat-label">Total Projects</div>
          <div className="stat-value">{projects.length}</div>
        </div>
        <div className="stat-card success">
          <div className="stat-label">Active Projects</div>
          <div className="stat-value">{activeProjects}</div>
        </div>
        <div className="stat-card warning">
          <div className="stat-label">In Progress</div>
          <div className="stat-value">{inProgressTasks}</div>
        </div>
        <div className="stat-card danger">
          <div className="stat-label">Tasks To Do</div>
          <div className="stat-value">{todoTasks}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Recent Projects */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700 }}>Recent Projects</h2>
            <Link to="/projects" style={{ fontSize: 13, color: 'var(--accent)' }}>View all →</Link>
          </div>
          {projects.slice(0, 5).map(p => (
            <div key={p.id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '12px 0', borderBottom: '1px solid var(--border)',
            }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{formatDate(p.startDate)}</div>
              </div>
              <span className={`badge badge-${p.status?.toLowerCase()}`}>{p.status}</span>
            </div>
          ))}
          {projects.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">◈</div>
              <p>No projects yet</p>
            </div>
          )}
        </div>

        {/* My Tasks */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700 }}>My Tasks</h2>
            <Link to="/tasks" style={{ fontSize: 13, color: 'var(--accent)' }}>View all →</Link>
          </div>
          {tasks.slice(0, 5).map(t => (
            <div key={t.id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '12px 0', borderBottom: '1px solid var(--border)',
            }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{truncate(t.title, 35)}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                  Due: {formatDate(t.dueDate)}
                </div>
              </div>
              <span className={`badge badge-${t.status?.toLowerCase()}`}>{t.status?.replace('_', ' ')}</span>
            </div>
          ))}
          {tasks.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">◎</div>
              <p>No tasks assigned</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;