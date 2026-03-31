import React, { useEffect, useState } from 'react';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light') {
      setIsDark(false);
      applyLightTheme();
    }
  }, []);

  const applyLightTheme = () => {
    document.documentElement.style.setProperty('--bg-primary',    '#f8fafc');
    document.documentElement.style.setProperty('--bg-secondary',  '#ffffff');
    document.documentElement.style.setProperty('--bg-card',       '#ffffff');
    document.documentElement.style.setProperty('--bg-hover',      '#f1f5f9');
    document.documentElement.style.setProperty('--border',        '#e2e8f0');
    document.documentElement.style.setProperty('--border-light',  '#cbd5e1');
    document.documentElement.style.setProperty('--text-primary',  '#0f172a');
    document.documentElement.style.setProperty('--text-secondary','#475569');
    document.documentElement.style.setProperty('--text-muted',    '#94a3b8');
  };

  const applyDarkTheme = () => {
    document.documentElement.style.setProperty('--bg-primary',    '#0a0f1e');
    document.documentElement.style.setProperty('--bg-secondary',  '#0f172a');
    document.documentElement.style.setProperty('--bg-card',       '#111827');
    document.documentElement.style.setProperty('--bg-hover',      '#1e293b');
    document.documentElement.style.setProperty('--border',        '#1e293b');
    document.documentElement.style.setProperty('--border-light',  '#334155');
    document.documentElement.style.setProperty('--text-primary',  '#f1f5f9');
    document.documentElement.style.setProperty('--text-secondary','#94a3b8');
    document.documentElement.style.setProperty('--text-muted',    '#475569');
  };

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    if (newTheme) {
      applyDarkTheme();
    } else {
      applyLightTheme();
    }
  };

  return (
    <button
      onClick={toggleTheme}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '8px 12px',
        cursor: 'pointer',
        color: 'var(--text-primary)',
        fontSize: 16,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        transition: 'var(--transition)',
      }}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
};

export default ThemeToggle;