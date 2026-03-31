import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from 'recharts';
import api from '../services/api';
import projectService from '../services/projectService';
import taskService from '../services/taskService';
import { formatDate, truncate } from '../utils/helpers';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6'];

const Dashboard = () => {
  const [stats, setStats]               = useState(null);
  const [projects, setProjects]         = useState([]);
  const [tasks, setTasks]               = useState([]);
  const [projectChart, setProjectChart] = useState([]);
  const [taskChart, setTaskChart]       = useState([]);
  const [priorityChart, setPriorityChart] = useState([]);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [s, p, t, pc, tc, prc] = await Promise.all([
          api.get('/api/dashboard/stats').then(r => r.data),
          projectService.getAllProjects(),
          taskService.getMyTasks(),
          api.get('/api/dashboard/project-status-chart').then(r => r.data),
          api.get('/api/dashboard/task-status-chart').then(r => r.data),
          api.get('/api/dashboard/task-priority-chart').then(r => r.data),
        ]);
        setStats(s);
        setProjects(Array.isArray(p) ? p : []);
        setTasks(Array.isArray(t) ? t : []);
        setProjectChart(Array.isArray(pc) ? pc : []);
        setTaskChart(Array.isArray(tc) ? tc : []);
        setPriorityChart(Array.isArray(prc) ? prc : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>;

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Overview of your workspace</p>
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
          <div className="stat-value">{stats?.totalProjects || 0}</div>
        </div>
        <div className="stat-card success">
          <div className="stat-label">Active Projects</div>
          <div className="stat-value">{stats?.activeProjects || 0}</div>
        </div>
        <div className="stat-card warning">
          <div className="stat-label">In Progress Tasks</div>
          <div className="stat-value">{stats?.inProgressTasks || 0}</div>
        </div>
        <div className="stat-card danger">
          <div className="stat-label">Critical Tasks</div>
          <div className="stat-value">{stats?.criticalTasks || 0}</div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>

        {/* Project Status Pie Chart */}
        <div className="card">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 20 }}>
            Project Status
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={projectChart} cx="50%" cy="50%" outerRadius={80}
                dataKey="value" nameKey="name" label={({ name, value }) => `${name}: ${value}`}>
                {projectChart.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Task Status Bar Chart */}
        <div className="card">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 20 }}>
            Task Status
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={taskChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
              <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {taskChart.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24, marginBottom: 24 }}>

        {/* Priority Pie Chart */}
        <div className="card">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 20 }}>
            Task Priority
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={priorityChart} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                dataKey="value" nameKey="name">
                {priorityChart.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

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
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                  {formatDate(p.startDate)}
                </div>
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
              <div style={{ fontSize: 14, fontWeight: 500 }}>{truncate(t.title, 40)}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                Due: {formatDate(t.dueDate)}
              </div>
            </div>
            <span className={`badge badge-${t.status?.toLowerCase()}`}>
              {t.status?.replace('_', ' ')}
            </span>
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
  );
};

export default Dashboard;