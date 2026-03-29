import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_LINKS, COMPANY } from '../../utils/constants';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? 'shadow-lg' : ''}`}
      style={{ background: scrolled ? 'var(--white)' : 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)' }}>
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg transition-colors"
            style={{ background: 'var(--primary)' }}>D</div>
          <div>
            <span className="font-heading text-lg font-bold block leading-tight" style={{ color: 'var(--primary-dark)' }}>Divine</span>
            <span className="text-xs leading-tight" style={{ color: 'var(--text-light-color)' }}>Healthcare</span>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.path} to={link.path}
              className={({ isActive }) => `px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isActive ? 'text-white' : 'hover:bg-black/5'}`}
              style={({ isActive }) => isActive ? { background: 'var(--primary)', color: 'var(--white)' } : { color: 'var(--text-main)' }}
              end={link.path === '/'}>
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a href={`tel:${COMPANY.phone}`}
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:shadow-lg hover:-translate-y-0.5"
            style={{ background: 'var(--primary)' }}>
            <Phone size={16} /> {COMPANY.phone}
          </a>
          <button onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-xl transition-colors hover:bg-black/5" aria-label="Toggle menu">
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden border-t"
            style={{ background: 'var(--white)', borderColor: 'var(--bg-alt)' }}>
            <div className="p-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <NavLink key={link.path} to={link.path}
                  className={({ isActive }) => `block px-4 py-3 rounded-xl text-base font-medium transition-all ${isActive ? 'text-white' : ''}`}
                  style={({ isActive }) => isActive ? { background: 'var(--primary)', color: 'var(--white)' } : { color: 'var(--text-main)' }}
                  end={link.path === '/'}>
                  {link.label}
                </NavLink>
              ))}
              <a href={`tel:${COMPANY.phone}`}
                className="flex items-center justify-center gap-2 mt-3 px-5 py-3 rounded-xl text-white font-semibold"
                style={{ background: 'var(--primary)' }}>
                <Phone size={16} /> Call {COMPANY.phone}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
