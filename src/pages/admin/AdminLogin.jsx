import { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { LogIn, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function AdminLogin() {
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  const from = location.state?.from?.pathname || '/admin';

  // If already authenticated, redirect away from login
  if (user) {
    return <Navigate to={from} replace />;
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setAuthError('');
    try {
      await signIn(data.email, data.password);
      navigate(from, { replace: true });
    } catch (err) {
      if (err.message?.includes('Invalid login credentials')) {
        setAuthError('Invalid email or password. Please try again.');
      } else if (err.message?.includes('Email not confirmed')) {
        setAuthError('Your email has not been confirmed. Please check your inbox.');
      } else {
        setAuthError(err.message || 'An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div style={styles.wrapper}>
      {/* Decorative blobs */}
      <div style={{ ...styles.blob, ...styles.blob1 }} />
      <div style={{ ...styles.blob, ...styles.blob2 }} />

      <div style={styles.card}>
        {/* Branding */}
        <div style={styles.brandSection}>
          <div style={styles.logoCircle}>D</div>
          <h1 style={styles.brandTitle}>Divine Healthcare</h1>
          <p style={styles.brandSubtitle}>Admin Portal</p>
        </div>

        {/* Divider */}
        <div style={styles.divider} />

        {/* Error message */}
        {authError && (
          <div style={styles.errorBanner}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{authError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              {...register('email')}
              type="email"
              placeholder="admin@divinehomehealth.care"
              autoComplete="email"
              style={styles.input}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--primary)';
                e.target.style.boxShadow = '0 0 0 3px color-mix(in srgb, var(--primary) 20%, transparent)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--bg-alt)';
                e.target.style.boxShadow = 'none';
              }}
            />
            {errors.email && (
              <p style={styles.fieldError}>{errors.email.message}</p>
            )}
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.passwordWrapper}>
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                autoComplete="current-password"
                style={{ ...styles.input, paddingRight: 44 }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--primary)';
                  e.target.style.boxShadow = '0 0 0 3px color-mix(in srgb, var(--primary) 20%, transparent)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--bg-alt)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p style={styles.fieldError}>{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              ...styles.submitButton,
              opacity: isSubmitting ? 0.7 : 1,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
            }}
          >
            {isSubmitting ? (
              <>
                <div style={styles.buttonSpinner} />
                Signing in...
              </>
            ) : (
              <>
                <LogIn size={18} />
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <p style={styles.footerText}>
          Protected area. Authorized personnel only.
        </p>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: 20,
    background: 'var(--bg)',
    fontFamily: "'Inter', sans-serif",
    position: 'relative',
    overflow: 'hidden',
  },
  blob: {
    position: 'absolute',
    borderRadius: '50%',
    filter: 'blur(80px)',
    opacity: 0.12,
    pointerEvents: 'none',
  },
  blob1: {
    width: 400,
    height: 400,
    top: -100,
    right: -100,
    background: 'var(--primary)',
  },
  blob2: {
    width: 300,
    height: 300,
    bottom: -50,
    left: -80,
    background: 'var(--accent)',
  },
  card: {
    width: '100%',
    maxWidth: 420,
    background: 'var(--white)',
    borderRadius: 24,
    padding: '40px 32px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)',
    position: 'relative',
    zIndex: 1,
  },
  brandSection: {
    textAlign: 'center',
    marginBottom: 24,
  },
  logoCircle: {
    width: 56,
    height: 56,
    borderRadius: '50%',
    background: 'var(--primary)',
    color: '#fff',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 24,
    fontWeight: 700,
    fontFamily: "'Lora', serif",
    marginBottom: 12,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: 'var(--primary-dark)',
    fontFamily: "'Lora', serif",
    margin: 0,
    lineHeight: 1.3,
  },
  brandSubtitle: {
    fontSize: 14,
    color: 'var(--text-light-color)',
    margin: '4px 0 0',
  },
  divider: {
    height: 1,
    background: 'var(--bg-alt)',
    margin: '0 0 24px',
  },
  errorBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '12px 16px',
    borderRadius: 12,
    background: '#fef2f2',
    color: '#dc2626',
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 1.4,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: 500,
    color: 'var(--text-main)',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: 12,
    border: '1.5px solid var(--bg-alt)',
    background: 'var(--white)',
    color: 'var(--text-main)',
    fontSize: 14,
    outline: 'none',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
    boxSizing: 'border-box',
    fontFamily: "'Inter', sans-serif",
  },
  passwordWrapper: {
    position: 'relative',
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: 'var(--text-light-color)',
    cursor: 'pointer',
    padding: 4,
    display: 'flex',
    alignItems: 'center',
  },
  fieldError: {
    color: '#dc2626',
    fontSize: 12,
    margin: 0,
  },
  submitButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    padding: '13px 24px',
    borderRadius: 12,
    border: 'none',
    background: 'var(--primary)',
    color: '#fff',
    fontSize: 15,
    fontWeight: 600,
    fontFamily: "'Inter', sans-serif",
    transition: 'opacity 0.2s ease, transform 0.15s ease',
    marginTop: 4,
  },
  buttonSpinner: {
    width: 18,
    height: 18,
    border: '2.5px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    color: 'var(--text-light-color)',
    marginTop: 24,
    marginBottom: 0,
  },
};
