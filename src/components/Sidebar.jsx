import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/dashboard', label: 'Dashboard',  icon: '⬡' },
  { path: '/projects',  label: 'Projects',   icon: '◈' },
  { path: '/tasks',     label: 'Tasks',      icon: '◎' },
  { path: '/users',     label: 'Users',      icon: '◉', adminOnly: true },
  { path: '/audit',     label: 'Audit Logs', icon: '📋', adminOnly: true },
];

const Sidebar = () => {
  const { isAdmin } = useAuth();

  return (
    <aside style={{
      width: 'var(--sidebar-width)', height: '100vh',
      background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)',
      position: 'fixed', top: 0, left: 0,
      display: 'flex', flexDirection: 'column', zIndex: 200,
    }}>
      <div style={{
        padding: '20px 24px', borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{
          width: 32, height: 32, background: 'var(--accent)',
          borderRadius: 8, display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 16,
        }}>⬡</div>
        <div>
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 16, color: 'var(--text-primary)', letterSpacing: '-0.3px',
          }}>PMS</div>
          <div style={{
            fontSize: 10, color: 'var(--text-muted)',
            textTransform: 'uppercase', letterSpacing: '1px',
          }}>Project Manager</div>
        </div>
      </div>

      <nav style={{ padding: '16px 12px', flex: 1 }}>
        <div style={{
          fontSize: 10, fontWeight: 600, color: 'var(--text-muted)',
          textTransform: 'uppercase', letterSpacing: '1.5px',
          padding: '0 12px', marginBottom: 10,
        }}>
          Navigation
        </div>
        {navItems.map((item) => {
          if (item.adminOnly && !isAdmin()) return null;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 12px', borderRadius: 'var(--radius)',
                marginBottom: 4, fontSize: 14, fontWeight: 500,
                color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                background: isActive ? 'var(--accent-dim)' : 'transparent',
                transition: 'var(--transition)', textDecoration: 'none',
              })}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div style={{
        padding: '16px 24px', borderTop: '1px solid var(--border)',
        fontSize: 11, color: 'var(--text-muted)',
      }}>
        PMS v2.0.0
      </div>
    </aside>
  );
};

export default Sidebar;