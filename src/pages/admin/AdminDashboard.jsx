import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText,
  Briefcase,
  Users,
  Mail,
  TrendingUp,
  TrendingDown,
  Clock,
  Plus,
  Eye,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

/* ------------------------------------------------------------------ */
/*  Skeleton placeholder                                              */
/* ------------------------------------------------------------------ */
function Skeleton({ width = '100%', height = 20, borderRadius = 8, style = {} }) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        background: 'linear-gradient(90deg, var(--bg-alt) 25%, var(--bg) 50%, var(--bg-alt) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        ...style,
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Stat Card                                                         */
/* ------------------------------------------------------------------ */
function StatCard({ label, count, icon: Icon, color, trend, loading, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      style={s.statCard}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p style={s.statLabel}>{label}</p>
          {loading ? (
            <Skeleton width={60} height={32} style={{ marginTop: 4 }} />
          ) : (
            <p style={s.statCount}>{count}</p>
          )}
        </div>
        <div style={{ ...s.statIconWrap, background: color + '18', color }}>
          <Icon size={22} />
        </div>
      </div>
      {trend !== undefined && !loading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8 }}>
          {trend >= 0 ? (
            <TrendingUp size={14} style={{ color: '#16a34a' }} />
          ) : (
            <TrendingDown size={14} style={{ color: '#dc2626' }} />
          )}
          <span style={{ fontSize: 12, color: trend >= 0 ? '#16a34a' : '#dc2626', fontWeight: 500 }}>
            {trend >= 0 ? '+' : ''}{trend}
          </span>
          <span style={{ fontSize: 12, color: 'var(--text-light-color)' }}>this week</span>
        </div>
      )}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Status Badge                                                      */
/* ------------------------------------------------------------------ */
function StatusBadge({ status }) {
  const map = {
    new: { bg: '#dbeafe', color: '#1d4ed8', label: 'New' },
    reviewing: { bg: '#fef3c7', color: '#b45309', label: 'Reviewing' },
    interview: { bg: '#e0e7ff', color: '#4338ca', label: 'Interview' },
    accepted: { bg: '#dcfce7', color: '#16a34a', label: 'Accepted' },
    rejected: { bg: '#fee2e2', color: '#dc2626', label: 'Rejected' },
    hired: { bg: '#dcfce7', color: '#16a34a', label: 'Hired' },
    read: { bg: '#f3f4f6', color: '#6b7280', label: 'Read' },
    replied: { bg: '#dbeafe', color: '#1d4ed8', label: 'Replied' },
    archived: { bg: '#f3f4f6', color: '#6b7280', label: 'Archived' },
    pending: { bg: '#fef3c7', color: '#b45309', label: 'Pending' },
    in_progress: { bg: '#e0e7ff', color: '#4338ca', label: 'In Progress' },
    completed: { bg: '#dcfce7', color: '#16a34a', label: 'Completed' },
  };
  const cfg = map[status] || map.new;
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '3px 10px',
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 600,
        background: cfg.bg,
        color: cfg.color,
        textTransform: 'capitalize',
        whiteSpace: 'nowrap',
      }}
    >
      {cfg.label}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                    */
/* ------------------------------------------------------------------ */
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalApplications: 0,
    newApplications: 0,
    activeJobs: 0,
    pendingReferrals: 0,
    unreadMessages: 0,
  });
  const [recentApps, setRecentApps] = useState([]);
  const [recentReferrals, setRecentReferrals] = useState([]);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fire all queries in parallel
      const [
        { count: totalApplications },
        { count: newApplications },
        { count: activeJobs },
        { count: pendingReferrals },
        { count: unreadMessages },
        { data: appsData },
        { data: referralsData },
      ] = await Promise.all([
        supabase.from('applications').select('*', { count: 'exact', head: true }),
        supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'new'),
        supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('referrals').select('*', { count: 'exact', head: true }).eq('status', 'new'),
        supabase.from('contact_submissions').select('*', { count: 'exact', head: true }).eq('status', 'new'),
        supabase
          .from('applications')
          .select('id, reference_number, first_name, last_name, position, status, created_at')
          .order('created_at', { ascending: false })
          .limit(10),
        supabase
          .from('referrals')
          .select('id, referrer_name, patient_name, service_requested, urgency, status, created_at')
          .order('created_at', { ascending: false })
          .limit(5),
      ]);

      setStats({
        totalApplications: totalApplications ?? 0,
        newApplications: newApplications ?? 0,
        activeJobs: activeJobs ?? 0,
        pendingReferrals: pendingReferrals ?? 0,
        unreadMessages: unreadMessages ?? 0,
      });
      setRecentApps(appsData || []);
      setRecentReferrals(referralsData || []);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div>
      {/* Page header */}
      <div style={s.pageHeader}>
        <div>
          <h1 style={s.pageTitle}>Dashboard</h1>
          <p style={s.pageSubtitle}>Welcome back. Here is an overview of your operations.</p>
        </div>
        <button style={s.refreshBtn} onClick={fetchData} title="Refresh data">
          <RefreshCw size={16} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={s.errorBanner}>
          {error}
          <button onClick={fetchData} style={{ ...s.linkBtn, marginLeft: 12, color: '#dc2626' }}>
            Retry
          </button>
        </div>
      )}

      {/* Stat cards */}
      <div style={s.statsGrid}>
        <StatCard
          label="Total Applications"
          count={stats.totalApplications}
          icon={FileText}
          color="var(--primary)"
          loading={loading}
          delay={0}
        />
        <StatCard
          label="New Applications"
          count={stats.newApplications}
          icon={Clock}
          color="#f59e0b"
          loading={loading}
          delay={0.05}
        />
        <StatCard
          label="Active Jobs"
          count={stats.activeJobs}
          icon={Briefcase}
          color="#0ea5e9"
          loading={loading}
          delay={0.1}
        />
        <StatCard
          label="Pending Referrals"
          count={stats.pendingReferrals}
          icon={Users}
          color="#8b5cf6"
          loading={loading}
          delay={0.15}
        />
        <StatCard
          label="Unread Messages"
          count={stats.unreadMessages}
          icon={Mail}
          color="#ef4444"
          loading={loading}
          delay={0.2}
        />
      </div>

      {/* Quick actions */}
      <div style={s.quickActions}>
        <button style={s.actionBtn} onClick={() => navigate('/admin/jobs')}>
          <Plus size={16} /> Post New Job
        </button>
        <button style={{ ...s.actionBtn, ...s.actionBtnOutline }} onClick={() => navigate('/admin/applications')}>
          <Eye size={16} /> View Applications
        </button>
      </div>

      {/* Two-column grid: Recent Applications + Recent Referrals */}
      <div style={s.twoCol}>
        {/* Recent Applications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          style={s.card}
        >
          <div style={s.cardHeader}>
            <h2 style={s.cardTitle}>Recent Applications</h2>
            <button style={s.linkBtn} onClick={() => navigate('/admin/applications')}>
              View All <ArrowRight size={14} />
            </button>
          </div>
          <div style={s.tableWrap}>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16 }}>
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} height={18} />
                ))}
              </div>
            ) : recentApps.length === 0 ? (
              <p style={s.emptyMsg}>No applications yet.</p>
            ) : (
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={s.th}>Ref #</th>
                    <th style={s.th}>Name</th>
                    <th style={s.th}>Position</th>
                    <th style={s.th}>Date</th>
                    <th style={s.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentApps.map((app) => (
                    <tr key={app.id} style={s.tr}>
                      <td style={s.td}>
                        <span style={{ fontFamily: 'monospace', fontSize: 13, color: 'var(--primary-dark)' }}>
                          {app.reference_number || '-'}
                        </span>
                      </td>
                      <td style={s.td}>
                        {app.first_name} {app.last_name}
                      </td>
                      <td style={s.td}>{app.position || '-'}</td>
                      <td style={s.td}>{formatDate(app.created_at)}</td>
                      <td style={s.td}>
                        <StatusBadge status={app.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>

        {/* Recent Referrals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          style={s.card}
        >
          <div style={s.cardHeader}>
            <h2 style={s.cardTitle}>Recent Referrals</h2>
            <button style={s.linkBtn} onClick={() => navigate('/admin/referrals')}>
              View All <ArrowRight size={14} />
            </button>
          </div>
          <div style={s.tableWrap}>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16 }}>
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} height={18} />
                ))}
              </div>
            ) : recentReferrals.length === 0 ? (
              <p style={s.emptyMsg}>No referrals yet.</p>
            ) : (
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={s.th}>Referrer</th>
                    <th style={s.th}>Patient</th>
                    <th style={s.th}>Service</th>
                    <th style={s.th}>Urgency</th>
                    <th style={s.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentReferrals.map((ref) => (
                    <tr key={ref.id} style={s.tr}>
                      <td style={s.td}>{ref.referrer_name || '-'}</td>
                      <td style={s.td}>{ref.patient_name || '-'}</td>
                      <td style={s.td}>{ref.service_requested || '-'}</td>
                      <td style={s.td}>
                        <span
                          style={{
                            padding: '2px 8px',
                            borderRadius: 12,
                            fontSize: 11,
                            fontWeight: 600,
                            background:
                              ref.urgency === 'urgent'
                                ? '#fee2e2'
                                : ref.urgency === 'routine'
                                ? '#dcfce7'
                                : '#fef3c7',
                            color:
                              ref.urgency === 'urgent'
                                ? '#dc2626'
                                : ref.urgency === 'routine'
                                ? '#16a34a'
                                : '#b45309',
                            textTransform: 'capitalize',
                          }}
                        >
                          {ref.urgency || 'N/A'}
                        </span>
                      </td>
                      <td style={s.td}>
                        <StatusBadge status={ref.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>
      </div>

      {/* Shimmer keyframes */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Styles                                                            */
/* ------------------------------------------------------------------ */
const s = {
  pageHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 28,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: 'var(--text-main)',
    fontFamily: "'Lora', serif",
    margin: 0,
  },
  pageSubtitle: {
    fontSize: 14,
    color: 'var(--text-light-color)',
    margin: '4px 0 0',
  },
  refreshBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 16px',
    borderRadius: 10,
    border: '1px solid var(--bg-alt)',
    background: 'var(--white)',
    color: 'var(--text-light-color)',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
    transition: 'background 0.2s ease, color 0.2s ease',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    background: 'var(--white)',
    borderRadius: 16,
    padding: 20,
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    cursor: 'default',
  },
  statLabel: {
    fontSize: 13,
    fontWeight: 500,
    color: 'var(--text-light-color)',
    margin: 0,
  },
  statCount: {
    fontSize: 28,
    fontWeight: 700,
    color: 'var(--text-main)',
    margin: '4px 0 0',
    lineHeight: 1.2,
  },
  statIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  quickActions: {
    display: 'flex',
    gap: 12,
    marginBottom: 28,
    flexWrap: 'wrap',
  },
  actionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 20px',
    borderRadius: 10,
    border: 'none',
    background: 'var(--primary)',
    color: '#fff',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
    transition: 'opacity 0.2s ease',
  },
  actionBtnOutline: {
    background: 'var(--white)',
    color: 'var(--primary)',
    border: '1.5px solid var(--primary)',
  },
  twoCol: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: 20,
  },
  card: {
    background: 'var(--white)',
    borderRadius: 16,
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    overflow: 'hidden',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    borderBottom: '1px solid var(--bg-alt)',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: 'var(--text-main)',
    margin: 0,
    fontFamily: "'Lora', serif",
  },
  linkBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    background: 'none',
    border: 'none',
    color: 'var(--primary)',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
    padding: 0,
  },
  tableWrap: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 14,
  },
  th: {
    textAlign: 'left',
    padding: '10px 16px',
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--text-light-color)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    whiteSpace: 'nowrap',
    borderBottom: '1px solid var(--bg-alt)',
  },
  tr: {
    transition: 'background 0.15s ease',
  },
  td: {
    padding: '10px 16px',
    color: 'var(--text-main)',
    borderBottom: '1px solid var(--bg-alt)',
    whiteSpace: 'nowrap',
  },
  emptyMsg: {
    padding: 32,
    textAlign: 'center',
    color: 'var(--text-light-color)',
    fontSize: 14,
  },
  errorBanner: {
    padding: '12px 20px',
    borderRadius: 12,
    background: '#fef2f2',
    color: '#dc2626',
    fontSize: 14,
    marginBottom: 20,
    display: 'flex',
    alignItems: 'center',
  },
};
