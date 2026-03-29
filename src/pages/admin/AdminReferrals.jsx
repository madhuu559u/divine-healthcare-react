import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ChevronDown,
  X,
  Clock,
  Eye,
  Users,
  User,
  Building2,
  Phone,
  Mail,
  FileText,
  Calendar,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  ClipboardList,
  Stethoscope,
  MapPin,
  CreditCard,
  StickyNote,
  UserCheck,
  ArrowRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';

/* ================================================================== */
/*  Constants                                                          */
/* ================================================================== */
const STATUS_OPTIONS = [
  { value: 'new',         label: 'New',         bg: '#dbeafe', color: '#1d4ed8' },
  { value: 'reviewing',   label: 'Reviewing',   bg: '#fef3c7', color: '#b45309' },
  { value: 'accepted',    label: 'Accepted',    bg: '#d1fae5', color: '#059669' },
  { value: 'in_progress', label: 'In Progress', bg: '#e0e7ff', color: '#4338ca' },
  { value: 'completed',   label: 'Completed',   bg: '#dcfce7', color: '#16a34a' },
  { value: 'declined',    label: 'Declined',    bg: '#fee2e2', color: '#dc2626' },
];

const URGENCY_OPTIONS = [
  { value: 'routine', label: 'Routine', bg: '#dbeafe', color: '#1d4ed8' },
  { value: 'urgent',  label: 'Urgent',  bg: '#fee2e2', color: '#dc2626' },
];

/* ================================================================== */
/*  Skeleton                                                           */
/* ================================================================== */
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

/* ================================================================== */
/*  Status Badge                                                       */
/* ================================================================== */
function StatusBadge({ status }) {
  const cfg = STATUS_OPTIONS.find((s) => s.value === status) || STATUS_OPTIONS[0];
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

/* ================================================================== */
/*  Urgency Badge                                                      */
/* ================================================================== */
function UrgencyBadge({ urgency }) {
  const cfg = URGENCY_OPTIONS.find((u) => u.value === urgency) || URGENCY_OPTIONS[0];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
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
      {urgency === 'urgent' && <AlertCircle size={12} />}
      {cfg.label}
    </span>
  );
}

/* ================================================================== */
/*  Status Dropdown                                                    */
/* ================================================================== */
function StatusDropdown({ current, onChange, disabled }) {
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <select
        value={current}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        style={{
          padding: '6px 32px 6px 12px',
          borderRadius: 8,
          border: '1.5px solid var(--bg-alt)',
          background: 'var(--white)',
          color: 'var(--text-main)',
          fontSize: 13,
          fontWeight: 500,
          cursor: 'pointer',
          outline: 'none',
          appearance: 'none',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        style={{
          position: 'absolute',
          right: 10,
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--text-light-color)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

/* ================================================================== */
/*  Info Row (label + value pair for detail)                           */
/* ================================================================== */
function InfoRow({ icon: Icon, label, value, href }) {
  if (!value) return null;
  const content = href ? (
    <a href={href} style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: 14, wordBreak: 'break-word' }}>
      {value}
    </a>
  ) : (
    <span style={{ fontSize: 14, color: 'var(--text-main)', wordBreak: 'break-word' }}>{value}</span>
  );
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '6px 0' }}>
      {Icon && <Icon size={15} style={{ color: 'var(--text-light-color)', marginTop: 2, flexShrink: 0 }} />}
      <div style={{ flex: 1 }}>
        <span style={s.metaLabel}>{label}</span>
        {content}
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Referral Detail Panel                                              */
/* ================================================================== */
function ReferralDetail({ referral, onClose, onStatusChange, onNoteSave, onMarkReviewed, reviewerName }) {
  const [adminNotes, setAdminNotes] = useState(referral?.admin_notes || '');
  const [savingNote, setSavingNote] = useState(false);

  useEffect(() => {
    setAdminNotes(referral?.admin_notes || '');
  }, [referral]);

  if (!referral) return null;

  const handleSaveNotes = async () => {
    setSavingNote(true);
    await onNoteSave(referral.id, adminNotes);
    setSavingNote(false);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const formatShortDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ duration: 0.25 }}
      style={s.detailPanel}
    >
      {/* Header */}
      <div style={s.detailHeader}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--text-main)', fontFamily: "'Lora', serif" }}>
          Referral Details
        </h3>
        <button onClick={onClose} style={s.closeBtn}>
          <X size={18} />
        </button>
      </div>

      <div style={s.detailBody}>
        {/* Status & urgency */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <StatusDropdown
            current={referral.status || 'new'}
            onChange={(val) => onStatusChange(referral.id, val)}
          />
          <UrgencyBadge urgency={referral.urgency || 'routine'} />
          {!referral.reviewed_by && (
            <button
              onClick={() => onMarkReviewed(referral.id)}
              style={{ ...s.secondaryBtn, fontSize: 12, padding: '5px 12px' }}
            >
              <UserCheck size={13} /> Mark Reviewed
            </button>
          )}
        </div>
        {referral.reviewed_by && (
          <p style={{ fontSize: 12, color: 'var(--text-light-color)', margin: '4px 0 0' }}>
            Reviewed by: {referral.reviewed_by}
          </p>
        )}

        {/* Referrer Info */}
        <div style={s.detailSection}>
          <h4 style={s.sectionTitle}>
            <Building2 size={15} /> Referrer Information
          </h4>
          <div style={s.infoCard}>
            <InfoRow icon={User} label="Name" value={referral.referrer_name} />
            <InfoRow icon={Building2} label="Organization" value={referral.referrer_org} />
            <InfoRow icon={FileText} label="Title" value={referral.referrer_title} />
            <InfoRow icon={Phone} label="Phone" value={referral.referrer_phone} href={referral.referrer_phone ? `tel:${referral.referrer_phone}` : null} />
            <InfoRow icon={Mail} label="Email" value={referral.referrer_email} href={referral.referrer_email ? `mailto:${referral.referrer_email}` : null} />
            <InfoRow icon={FileText} label="Fax" value={referral.referrer_fax} />
          </div>
        </div>

        {/* Patient Info */}
        <div style={s.detailSection}>
          <h4 style={s.sectionTitle}>
            <User size={15} /> Patient Information
          </h4>
          <div style={s.infoCard}>
            <InfoRow icon={User} label="Patient Name" value={referral.patient_name} />
            <InfoRow icon={Calendar} label="Date of Birth" value={formatShortDate(referral.patient_dob)} />
            <InfoRow icon={MapPin} label="Address" value={referral.patient_address} />
            <InfoRow icon={Phone} label="Phone" value={referral.patient_phone} href={referral.patient_phone ? `tel:${referral.patient_phone}` : null} />
            <InfoRow icon={CreditCard} label="Insurance Type" value={referral.insurance_type} />
            <InfoRow icon={CreditCard} label="Medicaid ID" value={referral.medicaid_id} />
          </div>
        </div>

        {/* Service Details */}
        <div style={s.detailSection}>
          <h4 style={s.sectionTitle}>
            <Stethoscope size={15} /> Service Details
          </h4>
          <div style={s.infoCard}>
            <InfoRow icon={ClipboardList} label="Service Requested" value={referral.service_requested} />
            <InfoRow icon={Calendar} label="Requested Start Date" value={formatShortDate(referral.start_date)} />
            <InfoRow icon={AlertCircle} label="Urgency" value={referral.urgency} />
            <InfoRow icon={Clock} label="Preferred Schedule" value={referral.preferred_schedule} />
          </div>
          {referral.clinical_notes && (
            <div style={{ marginTop: 10 }}>
              <span style={{ ...s.metaLabel, display: 'block', marginBottom: 4 }}>Clinical Notes</span>
              <div style={s.notesBlock}>{referral.clinical_notes}</div>
            </div>
          )}
        </div>

        {/* Timestamps */}
        <div style={s.detailSection}>
          <h4 style={s.sectionTitle}>
            <Clock size={15} /> Timeline
          </h4>
          <div style={s.infoCard}>
            <InfoRow icon={Clock} label="Submitted" value={formatDate(referral.created_at)} />
            <InfoRow icon={RefreshCw} label="Last Updated" value={formatDate(referral.updated_at)} />
          </div>
        </div>

        {/* Admin Notes */}
        <div style={s.detailSection}>
          <h4 style={s.sectionTitle}>
            <StickyNote size={15} /> Admin Notes
          </h4>
          <textarea
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="Add private notes about this referral..."
            rows={4}
            style={{ ...s.input, resize: 'vertical', minHeight: 80 }}
          />
          <button
            onClick={handleSaveNotes}
            disabled={savingNote}
            style={{ ...s.primaryBtn, marginTop: 8, fontSize: 13, padding: '8px 16px' }}
          >
            {savingNote ? 'Saving...' : 'Save Notes'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ================================================================== */
/*  Main Component                                                     */
/* ================================================================== */
export default function AdminReferrals() {
  const { user } = useAuth();
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedReferral, setSelectedReferral] = useState(null);

  /* -- Fetch referrals -- */
  const fetchReferrals = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('referrals')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setReferrals(data || []);
    } catch (err) {
      console.error('Fetch referrals error:', err);
      toast.error('Failed to load referrals');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReferrals();
  }, [fetchReferrals]);

  /* -- Select referral -- */
  const handleSelect = (ref) => {
    setSelectedReferral(ref);
  };

  /* -- Change status -- */
  const handleStatusChange = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from('referrals')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
      setReferrals((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus, updated_at: new Date().toISOString() } : r))
      );
      setSelectedReferral((prev) =>
        prev?.id === id ? { ...prev, status: newStatus, updated_at: new Date().toISOString() } : prev
      );
      toast.success(`Status updated to "${newStatus.replace('_', ' ')}"`);
    } catch (err) {
      console.error('Status change error:', err);
      toast.error('Failed to update status');
    }
  };

  /* -- Save admin notes -- */
  const handleNoteSave = async (id, notes) => {
    try {
      const { error } = await supabase
        .from('referrals')
        .update({ admin_notes: notes, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
      setReferrals((prev) =>
        prev.map((r) => (r.id === id ? { ...r, admin_notes: notes, updated_at: new Date().toISOString() } : r))
      );
      setSelectedReferral((prev) =>
        prev?.id === id ? { ...prev, admin_notes: notes, updated_at: new Date().toISOString() } : prev
      );
      toast.success('Notes saved');
    } catch (err) {
      console.error('Save notes error:', err);
      toast.error('Failed to save notes');
    }
  };

  /* -- Mark as reviewed -- */
  const handleMarkReviewed = async (id) => {
    const reviewerName = user?.email || 'Admin';
    try {
      const { error } = await supabase
        .from('referrals')
        .update({ reviewed_by: reviewerName, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
      setReferrals((prev) =>
        prev.map((r) => (r.id === id ? { ...r, reviewed_by: reviewerName, updated_at: new Date().toISOString() } : r))
      );
      setSelectedReferral((prev) =>
        prev?.id === id ? { ...prev, reviewed_by: reviewerName, updated_at: new Date().toISOString() } : prev
      );
      toast.success('Marked as reviewed');
    } catch (err) {
      console.error('Mark reviewed error:', err);
      toast.error('Failed to mark as reviewed');
    }
  };

  /* -- Filtering -- */
  const filtered = referrals.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      r.referrer_name?.toLowerCase().includes(q) ||
      r.patient_name?.toLowerCase().includes(q) ||
      r.referrer_org?.toLowerCase().includes(q) ||
      r.referrer_email?.toLowerCase().includes(q);
    const matchStatus = filterStatus === 'all' || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  /* -- Date formatter -- */
  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now - d;
    const diffH = Math.floor(diffMs / 3600000);
    if (diffH < 1) return 'Just now';
    if (diffH < 24) return `${diffH}h ago`;
    if (diffH < 48) return 'Yesterday';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  /* -- Counts -- */
  const newCount = referrals.filter((r) => r.status === 'new').length;
  const totalCount = referrals.length;

  return (
    <div>
      {/* Page header */}
      <div style={s.pageHeader}>
        <div>
          <h1 style={s.pageTitle}>
            <Users size={24} style={{ color: 'var(--primary)' }} />
            Referrals
            {newCount > 0 && (
              <span style={s.newBadge}>{newCount} new</span>
            )}
          </h1>
          <p style={s.pageSubtitle}>
            Manage patient referrals. {totalCount} total referral{totalCount !== 1 ? 's' : ''}.
          </p>
        </div>
        <button onClick={fetchReferrals} style={s.secondaryBtn} disabled={loading}>
          <RefreshCw size={15} className={loading ? 'spin' : ''} /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div style={s.filterBar}>
        <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: 400 }}>
          <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light-color)' }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by referrer, patient, or organization..."
            style={{ ...s.input, paddingLeft: 38 }}
          />
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <button
            onClick={() => setFilterStatus('all')}
            style={{
              ...s.filterChip,
              ...(filterStatus === 'all' ? s.filterChipActive : {}),
            }}
          >
            All ({referrals.length})
          </button>
          {STATUS_OPTIONS.map((opt) => {
            const count = referrals.filter((r) => r.status === opt.value).length;
            return (
              <button
                key={opt.value}
                onClick={() => setFilterStatus(opt.value)}
                style={{
                  ...s.filterChip,
                  ...(filterStatus === opt.value ? s.filterChipActive : {}),
                }}
              >
                {opt.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Content: Table + Detail */}
      <div style={s.contentGrid} className="admin-referrals-grid">
        {/* Referrals table */}
        <div style={s.card}>
          <div style={s.tableWrap}>
            {loading ? (
              <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} height={60} borderRadius={10} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div style={s.emptyState}>
                <Users size={40} style={{ color: 'var(--bg-alt)', marginBottom: 12 }} />
                <p style={{ fontSize: 15, color: 'var(--text-light-color)', margin: 0 }}>
                  {search || filterStatus !== 'all' ? 'No referrals match your filters.' : 'No referrals received yet.'}
                </p>
              </div>
            ) : (
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={s.th}>Patient Name</th>
                    <th style={s.th}>Referrer</th>
                    <th style={s.th}>Service</th>
                    <th style={s.th}>Urgency</th>
                    <th style={s.th}>Date</th>
                    <th style={s.th}>Status</th>
                    <th style={s.th}></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((ref) => {
                    const isSelected = selectedReferral?.id === ref.id;
                    const isNew = ref.status === 'new';
                    return (
                      <tr
                        key={ref.id}
                        onClick={() => handleSelect(ref)}
                        style={{
                          ...s.tr,
                          cursor: 'pointer',
                          background: isSelected
                            ? 'color-mix(in srgb, var(--primary) 6%, transparent)'
                            : isNew
                            ? 'color-mix(in srgb, var(--primary) 3%, transparent)'
                            : 'transparent',
                        }}
                      >
                        <td style={{ ...s.td, fontWeight: isNew ? 600 : 400 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={s.avatarSm}>
                              {ref.patient_name?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                            {ref.patient_name || '-'}
                          </div>
                        </td>
                        <td style={s.td}>
                          <div>
                            <span style={{ fontSize: 14, color: 'var(--text-main)', fontWeight: 500 }}>
                              {ref.referrer_name || '-'}
                            </span>
                            {ref.referrer_org && (
                              <span style={{ display: 'block', fontSize: 12, color: 'var(--text-light-color)', marginTop: 1 }}>
                                {ref.referrer_org}
                              </span>
                            )}
                          </div>
                        </td>
                        <td style={s.td}>
                          {ref.service_requested ? (
                            <span style={{
                              padding: '2px 8px',
                              borderRadius: 12,
                              fontSize: 12,
                              background: 'var(--bg-alt)',
                              color: 'var(--text-main)',
                              fontWeight: 500,
                              whiteSpace: 'nowrap',
                            }}>
                              {ref.service_requested}
                            </span>
                          ) : '-'}
                        </td>
                        <td style={s.td}>
                          <UrgencyBadge urgency={ref.urgency || 'routine'} />
                        </td>
                        <td style={s.td}>
                          <span style={{ fontSize: 13, color: 'var(--text-light-color)', whiteSpace: 'nowrap' }}>
                            <Clock size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                            {formatDate(ref.created_at)}
                          </span>
                        </td>
                        <td style={s.td}>
                          <StatusBadge status={ref.status || 'new'} />
                        </td>
                        <td style={{ ...s.td, width: 36, paddingLeft: 0 }}>
                          <Eye size={15} style={{ color: 'var(--text-light-color)' }} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Detail panel */}
        <AnimatePresence>
          {selectedReferral && (
            <ReferralDetail
              referral={selectedReferral}
              onClose={() => setSelectedReferral(null)}
              onStatusChange={handleStatusChange}
              onNoteSave={handleNoteSave}
              onMarkReviewed={handleMarkReviewed}
              reviewerName={user?.email || 'Admin'}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Keyframes + responsive */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
        @media (max-width: 1080px) {
          .admin-referrals-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

/* ================================================================== */
/*  Styles                                                             */
/* ================================================================== */
const s = {
  pageHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: 'var(--text-main)',
    fontFamily: "'Lora', serif",
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  pageSubtitle: {
    fontSize: 14,
    color: 'var(--text-light-color)',
    margin: '4px 0 0',
  },
  newBadge: {
    padding: '3px 10px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
    background: '#dbeafe',
    color: '#1d4ed8',
    fontFamily: "'Inter', sans-serif",
  },
  filterBar: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  filterChip: {
    padding: '7px 14px',
    borderRadius: 20,
    border: '1.5px solid var(--bg-alt)',
    background: 'var(--white)',
    color: 'var(--text-light-color)',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
  },
  filterChipActive: {
    borderColor: 'var(--primary)',
    background: 'color-mix(in srgb, var(--primary) 10%, transparent)',
    color: 'var(--primary-dark)',
    fontWeight: 600,
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 420px',
    gap: 20,
    alignItems: 'start',
  },
  card: {
    background: 'var(--white)',
    borderRadius: 16,
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    overflow: 'hidden',
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
    padding: '12px 14px',
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--text-light-color)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    whiteSpace: 'nowrap',
    borderBottom: '1px solid var(--bg-alt)',
    background: 'var(--bg)',
  },
  tr: {
    transition: 'background 0.15s ease',
  },
  td: {
    padding: '11px 14px',
    color: 'var(--text-main)',
    borderBottom: '1px solid var(--bg-alt)',
    verticalAlign: 'middle',
  },
  avatarSm: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    background: 'var(--accent)',
    color: 'var(--text-main)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    fontWeight: 700,
    flexShrink: 0,
  },
  emptyState: {
    padding: 48,
    textAlign: 'center',
  },
  /* Detail panel */
  detailPanel: {
    background: 'var(--white)',
    borderRadius: 16,
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    overflow: 'hidden',
    position: 'sticky',
    top: 80,
    maxHeight: 'calc(100vh - 100px)',
    overflowY: 'auto',
  },
  detailHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    borderBottom: '1px solid var(--bg-alt)',
    position: 'sticky',
    top: 0,
    background: 'var(--white)',
    zIndex: 2,
  },
  detailBody: {
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  detailSection: {
    marginTop: 4,
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--text-main)',
    margin: '0 0 10px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  infoCard: {
    padding: '8px 14px',
    borderRadius: 12,
    background: 'var(--bg)',
  },
  metaLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: 'var(--text-light-color)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    display: 'block',
    marginBottom: 2,
  },
  notesBlock: {
    padding: 14,
    borderRadius: 12,
    background: 'var(--bg)',
    fontSize: 14,
    color: 'var(--text-main)',
    lineHeight: 1.6,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-light-color)',
    cursor: 'pointer',
    padding: 4,
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 10,
    border: '1.5px solid var(--bg-alt)',
    background: 'var(--white)',
    color: 'var(--text-main)',
    fontSize: 14,
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    boxSizing: 'border-box',
    fontFamily: "'Inter', sans-serif",
  },
  primaryBtn: {
    display: 'inline-flex',
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
    whiteSpace: 'nowrap',
  },
  secondaryBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 16px',
    borderRadius: 10,
    border: '1.5px solid var(--bg-alt)',
    background: 'var(--white)',
    color: 'var(--text-main)',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
  },
};
