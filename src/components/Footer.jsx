import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      padding: '16px 32px',
      borderTop: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: 12,
      color: 'var(--text-muted)',
    }}>
      <span>© 2025 PMS — Project Management System</span>
      <span>Built with React + Spring Boot</span>
    </footer>
  );
};

export default Footer;
