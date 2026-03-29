import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Users,
  Mail,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Jobs', path: '/admin/jobs', icon: Briefcase },
  { label: 'Applications', path: '/admin/applications', icon: FileText },
  { label: 'Referrals', path: '/admin/referrals', icon: Users },
  { label: 'Messages', path: '/admin/messages', icon: Mail },
  { label: 'Settings', path: '/admin/settings', icon: Settings },
];

const SIDEBAR_WIDTH = 264;

export default function AdminLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="admin-layout">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="admin-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'admin-sidebar--open' : ''}`}>
        {/* Sidebar header / branding */}
        <div className="admin-sidebar__header">
          <div className="admin-sidebar__brand">
            <div className="admin-logo-circle">D</div>
            <div>
              <div className="admin-logo-title">Divine</div>
              <div className="admin-logo-sub">Healthcare Admin</div>
            </div>
          </div>
          <button
            className="admin-sidebar__close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="admin-nav">
          {NAV_ITEMS.map(({ label, path, icon: Icon, end }) => (
            <NavLink
              key={path}
              to={path}
              end={end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `admin-nav__link ${isActive ? 'admin-nav__link--active' : ''}`
              }
            >
              <Icon size={19} style={{ flexShrink: 0 }} />
              <span>{label}</span>
              <ChevronRight
                size={14}
                style={{ marginLeft: 'auto', opacity: 0.4 }}
              />
            </NavLink>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="admin-sidebar__footer">
          <div className="admin-user-info">
            <div className="admin-avatar">
              {user?.email?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="admin-user-text">
              <span className="admin-user-email">{user?.email || 'Admin'}</span>
              <span className="admin-user-role">Administrator</span>
            </div>
          </div>
          <button onClick={handleSignOut} className="admin-signout-sidebar">
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="admin-main">
        {/* Top header bar */}
        <header className="admin-topbar">
          <button
            className="admin-hamburger"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu size={22} />
          </button>

          <h2 className="admin-topbar__title">Divine Healthcare Admin</h2>

          <div className="admin-topbar__right">
            <span className="admin-topbar__email">{user?.email}</span>
            <button onClick={handleSignOut} className="admin-signout-header">
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>

      <style>{layoutCSS}</style>
    </div>
  );
}

const layoutCSS = `
  .admin-layout {
    display: flex;
    min-height: 100vh;
    background: var(--bg);
    font-family: 'Inter', sans-serif;
  }

  /* ---- Overlay ---- */
  .admin-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.35);
    z-index: 90;
  }

  /* ---- Sidebar ---- */
  .admin-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: ${SIDEBAR_WIDTH}px;
    background: var(--white);
    border-right: 1px solid var(--bg-alt);
    display: flex;
    flex-direction: column;
    z-index: 100;
    transition: transform 0.3s ease;
    transform: translateX(-100%);
  }
  .admin-sidebar--open {
    transform: translateX(0);
  }

  .admin-sidebar__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 16px 16px;
    border-bottom: 1px solid var(--bg-alt);
  }
  .admin-sidebar__brand {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .admin-logo-circle {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: var(--primary);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 17px;
    font-weight: 700;
    font-family: 'Lora', serif;
    flex-shrink: 0;
  }
  .admin-logo-title {
    font-size: 16px;
    font-weight: 700;
    color: var(--primary-dark);
    font-family: 'Lora', serif;
    line-height: 1.2;
  }
  .admin-logo-sub {
    font-size: 11px;
    color: var(--text-light-color);
    line-height: 1.2;
  }
  .admin-sidebar__close {
    background: none;
    border: none;
    color: var(--text-light-color);
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
  }

  /* ---- Navigation ---- */
  .admin-nav {
    flex: 1;
    overflow-y: auto;
    padding: 12px 10px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .admin-nav__link {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 14px;
    border-radius: 10px;
    color: var(--text-light-color);
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    transition: background 0.2s ease, color 0.2s ease;
  }
  .admin-nav__link:hover {
    background: var(--bg-alt);
  }
  .admin-nav__link--active {
    background: color-mix(in srgb, var(--primary) 12%, transparent);
    color: var(--primary-dark);
    font-weight: 600;
  }

  /* ---- Sidebar footer ---- */
  .admin-sidebar__footer {
    border-top: 1px solid var(--bg-alt);
    padding: 14px 16px;
  }
  .admin-user-info {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
  }
  .admin-avatar {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: var(--accent);
    color: var(--text-main);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 600;
    flex-shrink: 0;
  }
  .admin-user-text {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .admin-user-email {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-main);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .admin-user-role {
    font-size: 11px;
    color: var(--text-light-color);
  }
  .admin-signout-sidebar {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 9px 14px;
    border-radius: 10px;
    border: 1px solid var(--bg-alt);
    background: none;
    color: var(--text-light-color);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s ease, color 0.2s ease;
    font-family: 'Inter', sans-serif;
  }
  .admin-signout-sidebar:hover {
    background: var(--bg-alt);
    color: var(--text-main);
  }

  /* ---- Main wrapper ---- */
  .admin-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    margin-left: 0;
  }

  /* ---- Top bar ---- */
  .admin-topbar {
    position: sticky;
    top: 0;
    z-index: 30;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 20px;
    background: var(--white);
    border-bottom: 1px solid var(--bg-alt);
    backdrop-filter: blur(10px);
  }
  .admin-hamburger {
    background: none;
    border: none;
    color: var(--text-main);
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
  }
  .admin-topbar__title {
    flex: 1;
    font-size: 16px;
    font-weight: 700;
    color: var(--primary-dark);
    font-family: 'Lora', serif;
    margin: 0;
  }
  .admin-topbar__right {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .admin-topbar__email {
    font-size: 13px;
    color: var(--text-light-color);
  }
  .admin-signout-header {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 7px 14px;
    border-radius: 8px;
    border: 1px solid var(--bg-alt);
    background: none;
    color: var(--text-light-color);
    font-size: 13px;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    transition: background 0.2s ease, color 0.2s ease;
  }
  .admin-signout-header:hover {
    background: var(--bg-alt);
    color: var(--text-main);
  }

  /* ---- Content ---- */
  .admin-content {
    flex: 1;
    padding: 24px;
    max-width: 1280px;
    width: 100%;
    margin: 0 auto;
    box-sizing: border-box;
  }

  /* ---- Desktop (>= 769px) ---- */
  @media (min-width: 769px) {
    .admin-sidebar {
      transform: translateX(0);
    }
    .admin-sidebar__close {
      display: none;
    }
    .admin-overlay {
      display: none;
    }
    .admin-main {
      margin-left: ${SIDEBAR_WIDTH}px;
    }
    .admin-hamburger {
      display: none;
    }
  }

  /* ---- Mobile (<= 768px) ---- */
  @media (max-width: 768px) {
    .admin-topbar__email {
      display: none;
    }
    .admin-signout-header span {
      display: none;
    }
    .admin-content {
      padding: 16px;
    }
  }
`;
