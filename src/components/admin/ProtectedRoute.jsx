import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../lib/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'var(--bg)',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 48,
              height: 48,
              border: '4px solid var(--bg-alt)',
              borderTopColor: 'var(--primary)',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 16px',
            }}
          />
          <p
            style={{
              color: 'var(--text-light-color)',
              fontSize: 14,
              fontFamily: 'var(--font-body)',
            }}
          >
            Verifying authentication...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Preserve the attempted URL so we can redirect back after login
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
