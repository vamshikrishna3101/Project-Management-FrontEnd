import React, { useEffect, useState, useRef } from 'react';
import notificationService from '../services/notificationService';
import { formatDate } from '../utils/helpers';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount]     = useState(0);
  const [open, setOpen]                   = useState(false);
  const [loading, setLoading]             = useState(false);
  const dropdownRef                       = useRef(null);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchUnreadCount = async () => {
    try { const count = await notificationService.getUnreadCount(); setUnreadCount(count); }
    catch (err) { console.error(err); }
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try { const data = await notificationService.getAll(); setNotifications(Array.isArray(data) ? data : []); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleOpen = () => { setOpen(!open); if (!open) fetchNotifications(); };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) { console.error(err); }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      const deleted = notifications.find(n => n.id === id);
      setNotifications(notifications.filter(n => n.id !== id));
      if (deleted && !deleted.read) setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) { console.error(err); }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'TASK_ASSIGNED': return '📋'; case 'TASK_UPDATED': return '✏️';
      case 'PROJECT_CREATED': return '📁'; case 'PROJECT_UPDATED': return '🔄';
      case 'COMMENT_ADDED': return '💬'; case 'PROJECT_MEMBER_ADDED': return '👤';
      default: return '🔔';
    }
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      <button onClick={handleOpen} style={{
        position: 'relative', background: open ? 'var(--bg-hover)' : 'var(--bg-card)',
        border: '1px solid var(--border)', borderRadius: 'var(--radius)',
        padding: '8px 12px', cursor: 'pointer', color: 'var(--text-primary)',
        fontSize: 18, display: 'flex', alignItems: 'center', transition: 'var(--transition)',
      }}>
        🔔
        {unreadCount > 0 && (
          <span style={{ position: 'absolute', top: -4, right: -4, background: 'var(--danger)', color: 'white', borderRadius: '50%', width: 18, height: 18, fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 8, width: 360, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', zIndex: 1000, overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>
              Notifications {unreadCount > 0 && <span style={{ marginLeft: 8, background: 'var(--accent-dim)', color: 'var(--accent)', padding: '2px 8px', borderRadius: 999, fontSize: 11 }}>{unreadCount} new</span>}
            </div>
            {unreadCount > 0 && <button onClick={handleMarkAllAsRead} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: 12, cursor: 'pointer', fontWeight: 500 }}>Mark all read</button>}
          </div>
          <div style={{ maxHeight: 400, overflowY: 'auto' }}>
            {loading ? <div className="loading-spinner" style={{ padding: 40 }}><div className="spinner"></div></div>
              : notifications.length === 0 ? <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)', fontSize: 14 }}><div style={{ fontSize: 32, marginBottom: 8 }}>🔔</div>No notifications yet</div>
              : notifications.map(n => (
                <div key={n.id} style={{ display: 'flex', gap: 12, padding: '14px 20px', borderBottom: '1px solid var(--border)', background: n.read ? 'transparent' : 'rgba(99,102,241,0.05)', cursor: 'pointer', transition: 'var(--transition)' }} onClick={() => !n.read && handleMarkAsRead(n.id)}>
                  <div style={{ fontSize: 20, flexShrink: 0 }}>{getTypeIcon(n.type)}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, color: n.read ? 'var(--text-secondary)' : 'var(--text-primary)', margin: '0 0 4px', lineHeight: 1.5 }}>{n.message}</p>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{formatDate(n.createdAt)}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flexShrink: 0 }}>
                    {!n.read && <div style={{ width: 8, height: 8, background: 'var(--accent)', borderRadius: '50%', marginTop: 4 }} />}
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(n.id); }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 14, padding: 2 }}>✕</button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;