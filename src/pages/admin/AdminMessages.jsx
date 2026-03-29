import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  MailOpen,
  Search,
  Filter,
  ChevronDown,
  X,
  Clock,
  MessageSquare,
  Send,
  Archive,
  Eye,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */
const STATUS_OPTIONS = [
  { value: 'new', label: 'New', bg: '#dbeafe', color: '#1d4ed8' },
  { value: 'read', label: 'Read', bg: '#f3f4f6', color: '#6b7280' },
  { value: 'replied', label: 'Replied', bg: '#dcfce7', color: '#16a34a' },
  { value: 'archived', label: 'Archived', bg: '#fef3c7', color: '#b45309' },
];

/* ------------------------------------------------------------------ */
/*  Skeleton                                                           */
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
/*  Status Badge                                                       */
/* ------------------------------------------------------------------ */
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

/* ------------------------------------------------------------------ */
/*  Status Dropdown                                                    */
/* ------------------------------------------------------------------ */
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

/* ------------------------------------------------------------------ */
/*  Message Detail Panel                                               */
/* ------------------------------------------------------------------ */
function MessageDetail({ message, onClose, onStatusChange, onNoteSave }) {
  const [adminNote, setAdminNote] = useState(message?.admin_notes || '');
  const [savingNote, setSavingNote] = useState(false);

  useEffect(() => {
    setAdminNote(message?.admin_notes || '');
  }, [message]);

  if (!message) return null;

  const handleSaveNote = async () => {
    setSavingNote(true);
    await onNoteSave(message.id, adminNote);
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

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ duration: 0.25 }}
      style={s.detailPanel}
    >
      {/* Detail header */}
      <div style={s.detailHeader}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--text-main)', fontFamily: "'Lora', serif" }}>
          Message Details
        </h3>
        <button onClick={onClose} style={s.closeBtn}>
          <X size={18} />
        </button>
      </div>

      <div style={s.detailBody}>
        {/* Sender info */}
        <div style={s.detailSection}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={s.avatarLg}>
              {message.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: 'var(--text-main)' }}>
                {message.name}
              </p>
              <p style={{ margin: '2px 0 0', fontSize: 13, color: 'var(--text-light-color)' }}>
                {message.email}
              </p>
            </div>
          </div>

          <div style={s.metaGrid}>
            {message.phone && (
              <div style={s.metaItem}>
                <span style={s.metaLabel}>Phone</span>
                <a href={`tel:${message.phone}`} style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: 14 }}>
                  {message.phone}
                </a>
              </div>
            )}
            {message.service && (
              <div style={s.metaItem}>
                <span style={s.metaLabel}>Service</span>
                <span style={{ fontSize: 14, color: 'var(--text-main)', textTransform: 'capitalize' }}>
                  {message.service?.replace(/-/g, ' ')}
                </span>
              </div>
            )}
            <div style={s.metaItem}>
              <span style={s.metaLabel}>Received</span>
              <span style={{ fontSize: 14, color: 'var(--text-main)' }}>{formatDate(message.created_at)}</span>
            </div>
            <div style={s.metaItem}>
              <span style={s.metaLabel}>Status</span>
              <StatusDropdown
                current={message.status || 'new'}
                onChange={(val) => onStatusChange(message.id, val)}
              />
            </div>
          </div>
        </div>

        {/* Message body */}
        <div style={s.detailSection}>
          <h4 style={s.sectionTitle}>
            <MessageSquare size={15} /> Message
          </h4>
          <div style={s.messageBody}>{message.message}</div>
        </div>

        {/* Admin notes */}
        <div style={s.detailSection}>
          <h4 style={s.sectionTitle}>
            <Send size={15} /> Admin Notes
          </h4>
          <textarea
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            placeholder="Add private notes about this message..."
            rows={4}
            style={{ ...s.input, resize: 'vertical', minHeight: 80 }}
          />
          <button
            onClick={handleSaveNote}
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

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */
export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState(null);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      console.error('Fetch messages error:', err);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  /* -- Mark as read on view -- */
  const handleSelect = async (msg) => {
    setSelectedMessage(msg);
    if (msg.status === 'new') {
      try {
        await supabase
          .from('contact_submissions')
          .update({ status: 'read' })
          .eq('id', msg.id);
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, status: 'read' } : m))
        );
        // update selected too
        setSelectedMessage((prev) => (prev?.id === msg.id ? { ...prev, status: 'read' } : prev));
      } catch (err) {
        console.error('Mark read error:', err);
      }
    }
  };

  /* -- Change status -- */
  const handleStatusChange = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ status: newStatus })
        .eq('id', id);
      if (error) throw error;
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
      );
      setSelectedMessage((prev) =>
        prev?.id === id ? { ...prev, status: newStatus } : prev
      );
      toast.success(`Status updated to "${newStatus}"`);
    } catch (err) {
      console.error('Status change error:', err);
      toast.error('Failed to update status');
    }
  };

  /* -- Save admin notes -- */
  const handleNoteSave = async (id, notes) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ admin_notes: notes })
        .eq('id', id);
      if (error) throw error;
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, admin_notes: notes } : m))
      );
      setSelectedMessage((prev) =>
        prev?.id === id ? { ...prev, admin_notes: notes } : prev
      );
      toast.success('Notes saved');
    } catch (err) {
      console.error('Save notes error:', err);
      toast.error('Failed to save notes');
    }
  };

  /* -- Filtering -- */
  const filtered = messages.filter((m) => {
    const matchSearch =
      !search ||
      m.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.email?.toLowerCase().includes(search.toLowerCase()) ||
      m.message?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || m.status === filterStatus;
    return matchSearch && matchStatus;
  });

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

  const newCount = messages.filter((m) => m.status === 'new').length;

  return (
    <div>
      {/* Page header */}
      <div style={s.pageHeader}>
        <div>
          <h1 style={s.pageTitle}>
            Messages
            {newCount > 0 && (
              <span style={s.newBadge}>{newCount} new</span>
            )}
          </h1>
          <p style={s.pageSubtitle}>Contact form submissions from your website visitors.</p>
        </div>
      </div>

      {/* Filters */}
      <div style={s.filterBar}>
        <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: 360 }}>
          <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light-color)' }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or message..."
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
            All ({messages.length})
          </button>
          {STATUS_OPTIONS.map((opt) => {
            const count = messages.filter((m) => m.status === opt.value).length;
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
      <div style={s.contentGrid}>
        {/* Messages list */}
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
                <Mail size={40} style={{ color: 'var(--bg-alt)', marginBottom: 12 }} />
                <p style={{ fontSize: 15, color: 'var(--text-light-color)', margin: 0 }}>
                  {search || filterStatus !== 'all' ? 'No messages match your filters.' : 'No messages received yet.'}
                </p>
              </div>
            ) : (
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={s.th}></th>
                    <th style={s.th}>Name</th>
                    <th style={s.th}>Email</th>
                    <th style={s.th}>Phone</th>
                    <th style={s.th}>Service</th>
                    <th style={s.th}>Date</th>
                    <th style={s.th}>Status</th>
                    <th style={s.th}></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((msg) => {
                    const isSelected = selectedMessage?.id === msg.id;
                    const isNew = msg.status === 'new';
                    return (
                      <tr
                        key={msg.id}
                        onClick={() => handleSelect(msg)}
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
                        <td style={{ ...s.td, width: 36, paddingRight: 0 }}>
                          {isNew ? (
                            <Mail size={16} style={{ color: 'var(--primary)' }} />
                          ) : (
                            <MailOpen size={16} style={{ color: 'var(--text-light-color)' }} />
                          )}
                        </td>
                        <td style={{ ...s.td, fontWeight: isNew ? 600 : 400 }}>
                          {msg.name}
                        </td>
                        <td style={s.td}>
                          <span style={{ fontSize: 13, color: 'var(--text-light-color)' }}>{msg.email}</span>
                        </td>
                        <td style={s.td}>
                          <span style={{ fontSize: 13, color: 'var(--text-light-color)' }}>{msg.phone || '-'}</span>
                        </td>
                        <td style={s.td}>
                          {msg.service ? (
                            <span style={{ padding: '2px 8px', borderRadius: 12, fontSize: 11, background: 'var(--bg-alt)', color: 'var(--text-main)', fontWeight: 500, textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
                              {msg.service?.replace(/-/g, ' ')}
                            </span>
                          ) : '-'}
                        </td>
                        <td style={s.td}>
                          <span style={{ fontSize: 13, color: 'var(--text-light-color)', whiteSpace: 'nowrap' }}>
                            <Clock size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                            {formatDate(msg.created_at)}
                          </span>
                        </td>
                        <td style={s.td}>
                          <StatusBadge status={msg.status} />
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
          {selectedMessage && (
            <MessageDetail
              message={selectedMessage}
              onClose={() => setSelectedMessage(null)}
              onStatusChange={handleStatusChange}
              onNoteSave={handleNoteSave}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Shimmer keyframes */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @media (max-width: 900px) {
          .admin-messages-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */
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
    gridTemplateColumns: '1fr 380px',
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
  emptyState: {
    padding: 48,
    textAlign: 'center',
  },
  /* -- Detail panel -- */
  detailPanel: {
    background: 'var(--white)',
    borderRadius: 16,
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    overflow: 'hidden',
    position: 'sticky',
    top: 80,
  },
  detailHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    borderBottom: '1px solid var(--bg-alt)',
  },
  detailBody: {
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  detailSection: {},
  avatarLg: {
    width: 44,
    height: 44,
    borderRadius: '50%',
    background: 'var(--accent)',
    color: 'var(--text-main)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
    fontWeight: 700,
    flexShrink: 0,
  },
  metaGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
    marginTop: 12,
  },
  metaItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  metaLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: 'var(--text-light-color)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--text-main)',
    margin: '0 0 8px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  messageBody: {
    padding: 16,
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
};
