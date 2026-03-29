import { Link } from 'react-router-dom';

export default function Button({ children, to, href, variant = 'primary', size = 'md', className = '', onClick, type = 'button', disabled = false, loading = false }) {
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const sizes = {
    sm: 'px-5 py-2 text-sm',
    md: 'px-7 py-3 text-base',
    lg: 'px-9 py-4 text-lg'
  };

  const variants = {
    primary: 'text-white hover:shadow-lg hover:-translate-y-0.5',
    outline: 'border-2 hover:shadow-lg hover:-translate-y-0.5',
    accent: 'text-white hover:shadow-lg hover:-translate-y-0.5',
    ghost: 'hover:bg-opacity-10'
  };

  const styles = {
    primary: { background: 'var(--primary)', '--tw-ring-color': 'var(--primary)' },
    outline: { borderColor: 'var(--primary)', color: 'var(--primary)', '--tw-ring-color': 'var(--primary)' },
    accent: { background: 'var(--accent)', color: 'var(--primary-dark)', '--tw-ring-color': 'var(--accent)' },
    ghost: { color: 'var(--primary)' }
  };

  const cls = `${base} ${sizes[size]} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`;

  const content = loading ? (
    <>
      <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      Loading...
    </>
  ) : children;

  if (to) return <Link to={to} className={cls} style={styles[variant]}>{content}</Link>;
  if (href) return <a href={href} className={cls} style={styles[variant]} target="_blank" rel="noopener noreferrer">{content}</a>;
  return <button type={type} className={cls} style={styles[variant]} onClick={onClick} disabled={disabled || loading}>{content}</button>;
}
