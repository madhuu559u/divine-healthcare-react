import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Edit3,
  Trash2,
  X,
  GripVertical,
  ToggleLeft,
  ToggleRight,
  Search,
  ChevronDown,
  AlertTriangle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */
const CATEGORIES = [
  'Nursing',
  'Certified Nursing Assistant',
  'Home Health Aide',
  'Therapy',
  'Administrative',
  'Other',
];
const TYPE_OPTIONS = ['Full-Time', 'Part-Time', 'PRN', 'Contract', 'Per Diem'];
const SHIFT_OPTIONS = ['Day', 'Evening', 'Night', 'Rotating', 'Weekends'];

const EMPTY_FORM = {
  title: '',
  full_title: '',
  category: '',
  description: '',
  requirements: [''],
  responsibilities: [''],
  types: [],
  shifts: [],
  pay_range: '',
  location: '',
  is_active: true,
};

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
/*  Dynamic List Field (add/remove string items)                       */
/* ------------------------------------------------------------------ */
function DynamicList({ label, items, onChange }) {
  const update = (index, value) => {
    const next = [...items];
    next[index] = value;
    onChange(next);
  };
  const add = () => onChange([...items, '']);
  const remove = (index) => {
    const next = items.filter((_, i) => i !== index);
    onChange(next.length === 0 ? [''] : next);
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <label style={s.label}>{label}</label>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
          <GripVertical size={16} style={{ color: 'var(--text-light-color)', marginTop: 12, flexShrink: 0 }} />
          <input
            value={item}
            onChange={(e) => update(i, e.target.value)}
            placeholder={`Item ${i + 1}`}
            style={s.input}
          />
          <button
            type="button"
            onClick={() => remove(i)}
            style={s.removeItemBtn}
            title="Remove"
          >
            <X size={14} />
          </button>
        </div>
      ))}
      <button type="button" onClick={add} style={s.addItemBtn}>
        <Plus size={14} /> Add Item
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Checkbox Group                                                     */
/* ------------------------------------------------------------------ */
function CheckboxGroup({ label, options, selected, onChange }) {
  const toggle = (val) => {
    if (selected.includes(val)) {
      onChange(selected.filter((v) => v !== val));
    } else {
      onChange([...selected, val]);
    }
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <label style={s.label}>{label}</label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
        {options.map((opt) => {
          const checked = selected.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              style={{
                padding: '6px 14px',
                borderRadius: 20,
                border: checked ? '1.5px solid var(--primary)' : '1.5px solid var(--bg-alt)',
                background: checked ? 'color-mix(in srgb, var(--primary) 12%, transparent)' : 'var(--white)',
                color: checked ? 'var(--primary-dark)' : 'var(--text-light-color)',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
                transition: 'all 0.2s ease',
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Confirmation Modal                                                 */
/* ------------------------------------------------------------------ */
function ConfirmModal({ open, title, message, onConfirm, onCancel, loading }) {
  if (!open) return null;
  return (
    <div style={s.overlay} onClick={onCancel}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        style={s.confirmBox}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626' }}>
            <AlertTriangle size={20} />
          </div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>{title}</h3>
        </div>
        <p style={{ fontSize: 14, color: 'var(--text-light-color)', margin: '0 0 20px', lineHeight: 1.5 }}>{message}</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={s.cancelBtn}>Cancel</button>
          <button onClick={onConfirm} disabled={loading} style={s.deleteBtn}>
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Job Form Modal                                                     */
/* ------------------------------------------------------------------ */
function JobFormModal({ open, onClose, onSave, initialData, saving }) {
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        full_title: initialData.full_title || '',
        category: initialData.category || '',
        description: initialData.description || '',
        requirements: initialData.requirements?.length ? initialData.requirements : [''],
        responsibilities: initialData.responsibilities?.length ? initialData.responsibilities : [''],
        types: initialData.types || [],
        shifts: initialData.shifts || [],
        pay_range: initialData.pay_range || '',
        location: initialData.location || '',
        is_active: initialData.is_active ?? true,
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [initialData, open]);

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // strip empty items from lists
    const payload = {
      ...form,
      requirements: form.requirements.filter((r) => r.trim()),
      responsibilities: form.responsibilities.filter((r) => r.trim()),
    };
    onSave(payload);
  };

  if (!open) return null;

  const isEdit = !!initialData;

  return (
    <div style={s.overlay} onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        style={s.modal}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div style={s.modalHeader}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--text-main)', fontFamily: "'Lora', serif" }}>
            {isEdit ? 'Edit Job Listing' : 'Post New Job'}
          </h2>
          <button onClick={onClose} style={s.closeBtn}><X size={20} /></button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={s.modalBody}>
          {/* Row: Title + Full title */}
          <div style={s.formRow}>
            <div style={{ flex: 1 }}>
              <label style={s.label}>Short Title *</label>
              <input
                value={form.title}
                onChange={(e) => update('title', e.target.value)}
                placeholder="e.g. CNA"
                required
                style={s.input}
              />
            </div>
            <div style={{ flex: 2 }}>
              <label style={s.label}>Full Title *</label>
              <input
                value={form.full_title}
                onChange={(e) => update('full_title', e.target.value)}
                placeholder="e.g. Certified Nursing Assistant"
                required
                style={s.input}
              />
            </div>
          </div>

          {/* Row: Category + Pay + Location */}
          <div style={s.formRow}>
            <div style={{ flex: 1 }}>
              <label style={s.label}>Category *</label>
              <div style={{ position: 'relative' }}>
                <select
                  value={form.category}
                  onChange={(e) => update('category', e.target.value)}
                  required
                  style={{ ...s.input, appearance: 'none', paddingRight: 36 }}
                >
                  <option value="">Select category...</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown size={16} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light-color)', pointerEvents: 'none' }} />
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <label style={s.label}>Pay Range</label>
              <input
                value={form.pay_range}
                onChange={(e) => update('pay_range', e.target.value)}
                placeholder="e.g. $18 - $25/hr"
                style={s.input}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={s.label}>Location</label>
              <input
                value={form.location}
                onChange={(e) => update('location', e.target.value)}
                placeholder="e.g. Woodbridge, VA"
                style={s.input}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={s.label}>Description *</label>
            <textarea
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="Describe the role, expectations, and work environment..."
              required
              rows={4}
              style={{ ...s.input, resize: 'vertical', minHeight: 80 }}
            />
          </div>

          {/* Types & Shifts */}
          <div style={s.formRow}>
            <div style={{ flex: 1 }}>
              <CheckboxGroup label="Employment Types" options={TYPE_OPTIONS} selected={form.types} onChange={(v) => update('types', v)} />
            </div>
            <div style={{ flex: 1 }}>
              <CheckboxGroup label="Shifts" options={SHIFT_OPTIONS} selected={form.shifts} onChange={(v) => update('shifts', v)} />
            </div>
          </div>

          {/* Requirements */}
          <DynamicList label="Requirements" items={form.requirements} onChange={(v) => update('requirements', v)} />

          {/* Responsibilities */}
          <DynamicList label="Responsibilities" items={form.responsibilities} onChange={(v) => update('responsibilities', v)} />

          {/* Active toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <button
              type="button"
              onClick={() => update('is_active', !form.is_active)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: form.is_active ? 'var(--primary)' : 'var(--text-light-color)', display: 'flex', alignItems: 'center' }}
            >
              {form.is_active ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
            </button>
            <span style={{ fontSize: 14, color: 'var(--text-main)', fontWeight: 500 }}>
              {form.is_active ? 'Active — visible to applicants' : 'Inactive — hidden from applicants'}
            </span>
          </div>

          {/* Submit */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 8, borderTop: '1px solid var(--bg-alt)' }}>
            <button type="button" onClick={onClose} style={s.cancelBtn}>Cancel</button>
            <button type="submit" disabled={saving} style={s.primaryBtn}>
              {saving ? 'Saving...' : isEdit ? 'Update Job' : 'Post Job'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */
export default function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setJobs(data || []);
    } catch (err) {
      console.error('Fetch jobs error:', err);
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  /* -- Save (create or update) -- */
  const handleSave = async (formData) => {
    setSaving(true);
    try {
      if (editingJob) {
        const { error } = await supabase
          .from('jobs')
          .update({ ...formData, updated_at: new Date().toISOString() })
          .eq('id', editingJob.id);
        if (error) throw error;
        toast.success('Job updated successfully');
      } else {
        const { error } = await supabase.from('jobs').insert([formData]);
        if (error) throw error;
        toast.success('Job posted successfully');
      }
      setFormOpen(false);
      setEditingJob(null);
      fetchJobs();
    } catch (err) {
      console.error('Save job error:', err);
      toast.error(err.message || 'Failed to save job');
    } finally {
      setSaving(false);
    }
  };

  /* -- Delete -- */
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const { error } = await supabase.from('jobs').delete().eq('id', deleteTarget.id);
      if (error) throw error;
      toast.success('Job deleted');
      setDeleteTarget(null);
      fetchJobs();
    } catch (err) {
      console.error('Delete job error:', err);
      toast.error('Failed to delete job');
    } finally {
      setDeleting(false);
    }
  };

  /* -- Toggle active -- */
  const toggleActive = async (job) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ is_active: !job.is_active, updated_at: new Date().toISOString() })
        .eq('id', job.id);
      if (error) throw error;
      setJobs((prev) =>
        prev.map((j) => (j.id === job.id ? { ...j, is_active: !j.is_active } : j))
      );
      toast.success(job.is_active ? 'Job deactivated' : 'Job activated');
    } catch (err) {
      console.error('Toggle active error:', err);
      toast.error('Failed to toggle status');
    }
  };

  /* -- Filtered jobs -- */
  const filtered = jobs.filter((j) => {
    const q = search.toLowerCase();
    return (
      j.title?.toLowerCase().includes(q) ||
      j.full_title?.toLowerCase().includes(q) ||
      j.category?.toLowerCase().includes(q) ||
      j.location?.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      {/* Page header */}
      <div style={s.pageHeader}>
        <div>
          <h1 style={s.pageTitle}>Job Listings</h1>
          <p style={s.pageSubtitle}>Manage your open positions and job postings.</p>
        </div>
        <button
          style={s.primaryBtn}
          onClick={() => {
            setEditingJob(null);
            setFormOpen(true);
          }}
        >
          <Plus size={16} /> Post New Job
        </button>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 20, maxWidth: 360 }}>
        <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light-color)' }} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search jobs..."
          style={{ ...s.input, paddingLeft: 38 }}
        />
      </div>

      {/* Jobs table */}
      <div style={s.card}>
        <div style={s.tableWrap}>
          {loading ? (
            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} height={48} borderRadius={10} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div style={s.emptyState}>
              <p style={{ fontSize: 15, color: 'var(--text-light-color)', margin: 0 }}>
                {search ? 'No jobs match your search.' : 'No jobs posted yet.'}
              </p>
              {!search && (
                <button
                  style={{ ...s.primaryBtn, marginTop: 12 }}
                  onClick={() => {
                    setEditingJob(null);
                    setFormOpen(true);
                  }}
                >
                  <Plus size={16} /> Post Your First Job
                </button>
              )}
            </div>
          ) : (
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Title</th>
                  <th style={s.th}>Full Title</th>
                  <th style={s.th}>Category</th>
                  <th style={s.th}>Types</th>
                  <th style={s.th}>Status</th>
                  <th style={{ ...s.th, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((job) => (
                  <tr key={job.id} style={s.tr}>
                    <td style={{ ...s.td, fontWeight: 600, color: 'var(--primary-dark)' }}>{job.title}</td>
                    <td style={s.td}>{job.full_title}</td>
                    <td style={s.td}>
                      <span style={{ padding: '3px 10px', borderRadius: 16, fontSize: 12, background: 'var(--bg-alt)', color: 'var(--text-main)', fontWeight: 500 }}>
                        {job.category || '-'}
                      </span>
                    </td>
                    <td style={s.td}>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {(job.types || []).map((t) => (
                          <span key={t} style={{ padding: '2px 8px', borderRadius: 12, fontSize: 11, background: 'color-mix(in srgb, var(--primary) 10%, transparent)', color: 'var(--primary-dark)', fontWeight: 500 }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td style={s.td}>
                      <button
                        onClick={() => toggleActive(job)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: 0,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          color: job.is_active ? '#16a34a' : 'var(--text-light-color)',
                          fontSize: 13,
                          fontWeight: 500,
                          fontFamily: "'Inter', sans-serif",
                        }}
                        title={job.is_active ? 'Click to deactivate' : 'Click to activate'}
                      >
                        {job.is_active ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                        {job.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td style={{ ...s.td, textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => {
                            setEditingJob(job);
                            setFormOpen(true);
                          }}
                          style={s.iconBtn}
                          title="Edit"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(job)}
                          style={{ ...s.iconBtn, color: '#dc2626' }}
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Form modal */}
      <AnimatePresence>
        {formOpen && (
          <JobFormModal
            open={formOpen}
            onClose={() => {
              setFormOpen(false);
              setEditingJob(null);
            }}
            onSave={handleSave}
            initialData={editingJob}
            saving={saving}
          />
        )}
      </AnimatePresence>

      {/* Delete confirmation */}
      <AnimatePresence>
        <ConfirmModal
          open={!!deleteTarget}
          title="Delete Job"
          message={`Are you sure you want to delete "${deleteTarget?.full_title || deleteTarget?.title}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      </AnimatePresence>

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
/*  Styles                                                             */
/* ------------------------------------------------------------------ */
const s = {
  pageHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
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
    padding: '12px 16px',
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
    padding: '12px 16px',
    color: 'var(--text-main)',
    borderBottom: '1px solid var(--bg-alt)',
    verticalAlign: 'middle',
  },
  emptyState: {
    padding: 48,
    textAlign: 'center',
  },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    border: '1px solid var(--bg-alt)',
    background: 'var(--white)',
    color: 'var(--text-light-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'background 0.2s ease, color 0.2s ease',
  },
  /* -- Overlay & Modals -- */
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.4)',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    zIndex: 200,
    padding: '40px 16px',
    overflowY: 'auto',
  },
  modal: {
    width: '100%',
    maxWidth: 720,
    background: 'var(--white)',
    borderRadius: 20,
    boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
    maxHeight: 'calc(100vh - 80px)',
    display: 'flex',
    flexDirection: 'column',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 24px',
    borderBottom: '1px solid var(--bg-alt)',
    flexShrink: 0,
  },
  modalBody: {
    padding: 24,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
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
  confirmBox: {
    width: '100%',
    maxWidth: 420,
    background: 'var(--white)',
    borderRadius: 16,
    padding: 24,
    boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
    marginTop: 120,
  },
  /* -- Form elements -- */
  formRow: {
    display: 'flex',
    gap: 14,
    flexWrap: 'wrap',
  },
  label: {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--text-main)',
    marginBottom: 6,
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
  removeItemBtn: {
    width: 32,
    height: 38,
    borderRadius: 8,
    border: '1px solid var(--bg-alt)',
    background: 'var(--white)',
    color: '#dc2626',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    flexShrink: 0,
  },
  addItemBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '6px 12px',
    borderRadius: 8,
    border: '1px dashed var(--primary)',
    background: 'none',
    color: 'var(--primary)',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
    marginTop: 2,
  },
  /* -- Buttons -- */
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
  cancelBtn: {
    padding: '10px 20px',
    borderRadius: 10,
    border: '1.5px solid var(--bg-alt)',
    background: 'var(--white)',
    color: 'var(--text-main)',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
  },
  deleteBtn: {
    padding: '10px 20px',
    borderRadius: 10,
    border: 'none',
    background: '#dc2626',
    color: '#fff',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
    transition: 'opacity 0.2s ease',
  },
};
