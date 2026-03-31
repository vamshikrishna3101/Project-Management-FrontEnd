import React from 'react';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { user, logout } = useAuth();
  return (
    <nav style={{
      height: 'var(--navbar-height)', background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border)', display: 'flex',
      alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', position: 'sticky', top: 0, zIndex: 100,
    }}>
      <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
        Welcome back, <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{user?.name}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <ThemeToggle />
        <NotificationBell />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 12px', background: 'var(--bg-card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
          <div style={{ width: 28, height: 28, background: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'white' }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>{user?.name}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{user?.role}</div>
          </div>
        </div>
        <button onClick={logout} className="btn btn-secondary btn-sm">⬡ Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;