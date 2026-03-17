import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OAuth2Callback = () => {
  const [searchParams]     = useSearchParams();
  const navigate           = useNavigate();
  const { loginWithToken } = useAuth();

  useEffect(() => {
    const token     = searchParams.get('token');
    const id        = searchParams.get('id');
    const name      = searchParams.get('name');
    const email     = searchParams.get('email');
    const role      = searchParams.get('role');
    const isNewUser = searchParams.get('isNewUser') === 'true'; // ✅

    if (token) {
      if (isNewUser) {
        // ✅ New user — redirect to role selection page
        navigate(`/select-role?token=${token}&id=${id}&name=${name}&email=${email}`);
      } else {
        // Existing user — login directly
        loginWithToken({ token, id, name, email, role });
        navigate('/dashboard');
      }
    } else {
      navigate('/login');
    }
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary)',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div className="spinner" style={{ margin: '0 auto 16px' }}></div>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          Signing you in with Google...
        </p>
      </div>
    </div>
  );
};

export default OAuth2Callback;