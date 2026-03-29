import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ChevronDown,
  ChevronRight,
  Eye,
  FileText,
  Download,
  Printer,
  RefreshCw,
  User,
  Briefcase,
  Clock,
  Phone,
  Mail,
  BookOpen,
  Award,
  Users,
  Paperclip,
  CheckCircle,
  CreditCard,
  StickyNote,
  ClipboardCheck,
  AlertTriangle,
  ArrowLeft,
  ExternalLink,
  Calendar,
  Hash,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';

/* ================================================================== */
/*  Constants                                                          */
/* ================================================================== */
const STATUSES = [
  { value: 'new', label: 'New', bg: '#dbeafe', color: '#1d4ed8' },
  { value: 'reviewing', label: 'Reviewing', bg: '#fef3c7', color: '#b45309' },
  { value: 'interviewed', label: 'Interviewed', bg: '#e0e7ff', color: '#4338ca' },
  { value: 'offered', label: 'Offered', bg: '#d1fae5', color: '#059669' },
  { value: 'hired', label: 'Hired', bg: '#dcfce7', color: '#16a34a' },
  { value: 'rejected', label: 'Rejected', bg: '#fee2e2', color: '#dc2626' },
  { value: 'withdrawn', label: 'Withdrawn', bg: '#f3f4f6', color: '#6b7280' },
];

const PAGE_SIZE = 20;

const SKILLS_LIST = [
  'Communication', 'Observation, reporting and documentation', 'Temperature, pulse and respiration',
  'Universal Precautions', 'Body functions and changes reporting', 'Clean, safe and healthy environment',
  'Emergency situation recognition', 'Physical and emotional needs, privacy', 'Personal hygiene and grooming',
  'Toileting and elimination', 'Safe transfer techniques', 'Safe Ambulation',
  'Equipment use (Wheelchair, lift, walker, cane)', 'Proper body alignment positioning',
  'Feeding assistance (Aspiration Precautions)', 'Adequate nutrition and intake',
  'Medication Reminders', 'Infection Control (Handwashing, gloves)', 'Patient Care Documentation',
  'Reportable events to RN',
];

const REF_CHECK_ABILITIES = [
  'Communication',
  'Work Quality',
  'Emotional Stability',
  'Reliability',
  'Patience & Flexibility',
  'Pleasantness',
  'Ability to work with others',
];

const REF_CHECK_RATINGS = ['Excellent', 'Very Good', 'Good', 'Poor', "Don't know"];

/* ================================================================== */
/*  Skeleton                                                           */
/* ================================================================== */
function Skeleton({ width = '100%', height = 20, borderRadius = 8, style = {} }) {
  return (
    <div
      style={{
        width, height, borderRadius,
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
  const cfg = STATUSES.find((s) => s.value === status) || STATUSES[0];
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
/*  Collapsible Section                                                */
/* ================================================================== */
function CollapsibleSection({ title, icon: Icon, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={s.section}>
      <button
        onClick={() => setOpen(!open)}
        style={s.sectionHeader}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={s.sectionIconWrap}>
            <Icon size={16} />
          </div>
          <span style={s.sectionTitle}>{title}</span>
        </div>
        <motion.div
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRight size={18} style={{ color: 'var(--text-light-color)' }} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div style={s.sectionBody}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ================================================================== */
/*  Data field component                                               */
/* ================================================================== */
function Field({ label, value, href, mono }) {
  if (value === undefined || value === null || value === '') return null;
  const display = Array.isArray(value) ? value.join(', ') : String(value);
  if (!display || display === 'undefined') return null;
  return (
    <div style={s.field}>
      <span style={s.fieldLabel}>{label}</span>
      {href ? (
        <a href={href} style={{ ...s.fieldValue, color: 'var(--primary)', textDecoration: 'none' }}>
          {display}
        </a>
      ) : (
        <span style={{ ...s.fieldValue, ...(mono ? { fontFamily: 'monospace', fontSize: 13 } : {}) }}>
          {display}
        </span>
      )}
    </div>
  );
}

/* ================================================================== */
/*  Reference Check Form                                               */
/* ================================================================== */
function ReferenceCheckForm({ refData, checkData, onChange }) {
  const [local, setLocal] = useState(checkData || {
    howLongKnown: '',
    relationship: '',
    abilities: {},
    suitabilityNotes: '',
    characterComments: '',
  });

  const update = (key, val) => {
    const next = { ...local, [key]: val };
    setLocal(next);
    onChange(next);
  };

  const updateAbility = (ability, rating) => {
    const next = { ...local, abilities: { ...local.abilities, [ability]: rating } };
    setLocal(next);
    onChange(next);
  };

  return (
    <div style={{ padding: 16, borderRadius: 12, background: 'var(--bg)', marginBottom: 12 }}>
      <p style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 600, color: 'var(--text-main)' }}>
        {refData?.name || 'Reference'} {refData?.phone ? `- ${refData.phone}` : ''}
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
        <div>
          <label style={s.miniLabel}>How long known</label>
          <input
            value={local.howLongKnown || ''}
            onChange={(e) => update('howLongKnown', e.target.value)}
            style={s.input}
            placeholder="e.g. 3 years"
          />
        </div>
        <div>
          <label style={s.miniLabel}>Relationship</label>
          <input
            value={local.relationship || ''}
            onChange={(e) => update('relationship', e.target.value)}
            style={s.input}
            placeholder="e.g. Supervisor"
          />
        </div>
      </div>

      <label style={s.miniLabel}>Abilities Rating</label>
      <div style={{ overflowX: 'auto', marginBottom: 12 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr>
              <th style={{ ...s.miniTh, textAlign: 'left', minWidth: 160 }}>Ability</th>
              {REF_CHECK_RATINGS.map((r) => (
                <th key={r} style={{ ...s.miniTh, textAlign: 'center', minWidth: 70 }}>{r}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {REF_CHECK_ABILITIES.map((ability) => (
              <tr key={ability}>
                <td style={s.miniTd}>{ability}</td>
                {REF_CHECK_RATINGS.map((rating) => (
                  <td key={rating} style={{ ...s.miniTd, textAlign: 'center' }}>
                    <input
                      type="radio"
                      name={`refcheck-${refData?.name}-${ability}`}
                      checked={local.abilities?.[ability] === rating}
                      onChange={() => updateAbility(ability, rating)}
                      style={{ accentColor: 'var(--primary)', cursor: 'pointer' }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div>
          <label style={s.miniLabel}>Suitability Notes</label>
          <textarea
            value={local.suitabilityNotes || ''}
            onChange={(e) => update('suitabilityNotes', e.target.value)}
            style={{ ...s.input, resize: 'vertical', minHeight: 60 }}
            placeholder="Overall suitability for the position..."
          />
        </div>
        <div>
          <label style={s.miniLabel}>Character Comments</label>
          <textarea
            value={local.characterComments || ''}
            onChange={(e) => update('characterComments', e.target.value)}
            style={{ ...s.input, resize: 'vertical', minHeight: 60 }}
            placeholder="Character and personal qualities..."
          />
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Application Detail View                                            */
/* ================================================================== */
function ApplicationDetail({ application, documents, onBack, onUpdate }) {
  const { user } = useAuth();
  const [status, setStatus] = useState(application.status || 'new');
  const [adminNotes, setAdminNotes] = useState(application.admin_notes || '');
  const [referenceChecks, setReferenceChecks] = useState(application.reference_checks || {});
  const [savingNotes, setSavingNotes] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);
  const [savingRefChecks, setSavingRefChecks] = useState(false);

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit',
    });
  };

  const formatBytes = (bytes) => {
    if (!bytes) return '-';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  /* -- Status change -- */
  const handleStatusChange = async (newStatus) => {
    setSavingStatus(true);
    try {
      const updatePayload = {
        status: newStatus,
        updated_at: new Date().toISOString(),
      };
      if (newStatus === 'reviewing' && !application.reviewed_by) {
        updatePayload.reviewed_by = user?.email;
        updatePayload.reviewed_at = new Date().toISOString();
      }
      const { error } = await supabase
        .from('applications')
        .update(updatePayload)
        .eq('id', application.id);
      if (error) throw error;
      setStatus(newStatus);
      onUpdate({ ...application, ...updatePayload, status: newStatus });
      toast.success(`Status updated to "${newStatus}"`);
    } catch (err) {
      console.error('Status update error:', err);
      toast.error('Failed to update status');
    } finally {
      setSavingStatus(false);
    }
  };

  /* -- Admin notes auto-save on blur -- */
  const handleNotesSave = async () => {
    if (adminNotes === (application.admin_notes || '')) return;
    setSavingNotes(true);
    try {
      const { error } = await supabase
        .from('applications')
        .update({
          admin_notes: adminNotes,
          reviewed_by: user?.email,
          updated_at: new Date().toISOString(),
        })
        .eq('id', application.id);
      if (error) throw error;
      toast.success('Notes saved');
    } catch (err) {
      console.error('Save notes error:', err);
      toast.error('Failed to save notes');
    } finally {
      setSavingNotes(false);
    }
  };

  /* -- Save reference checks -- */
  const handleSaveRefChecks = async () => {
    setSavingRefChecks(true);
    try {
      const { error } = await supabase
        .from('applications')
        .update({
          reference_checks: referenceChecks,
          updated_at: new Date().toISOString(),
        })
        .eq('id', application.id);
      if (error) throw error;
      toast.success('Reference checks saved');
    } catch (err) {
      console.error('Save ref checks error:', err);
      toast.error('Failed to save reference checks');
    } finally {
      setSavingRefChecks(false);
    }
  };

  /* -- Document helpers -- */
  const handleViewDocument = async (doc) => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .createSignedUrl(doc.storage_path, 3600);
      if (error) throw error;
      window.open(data.signedUrl, '_blank');
    } catch (err) {
      console.error('View doc error:', err);
      toast.error('Failed to open document');
    }
  };

  const handleDownloadDocument = async (doc) => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .download(doc.storage_path);
      if (error) throw error;
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download doc error:', err);
      toast.error('Failed to download document');
    }
  };

  const handleDownloadAll = async () => {
    if (!documents.length) return;
    toast('Downloading files...', { icon: '📥' });
    for (const doc of documents) {
      await handleDownloadDocument(doc);
    }
  };

  const handlePrint = () => window.print();

  /* -- Employers, education, licenses, references from JSONB -- */
  const employers = application.employers || [];
  const education = application.education || [];
  const licenses = application.licenses || [];
  const skillsAssessment = application.skills_assessment || {};
  const references = application.references_data || [];
  const agreements = application.agreements || {};
  const directDeposit = application.direct_deposit || {};
  const empType = application.employment_type || [];
  const prefShift = application.preferred_shift || [];

  return (
    <div>
      {/* Header */}
      <div style={s.detailHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onBack} style={s.backBtn}>
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 style={s.detailTitle}>
              {application.first_name} {application.middle_name ? application.middle_name + ' ' : ''}{application.last_name}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4, flexWrap: 'wrap' }}>
              {application.reference_number && (
                <span style={s.refBadge}>
                  <Hash size={12} /> {application.reference_number}
                </span>
              )}
              <StatusBadge status={status} />
              <span style={{ fontSize: 13, color: 'var(--text-light-color)' }}>
                Applied {formatDate(application.created_at)}
              </span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button onClick={handlePrint} style={s.outlineBtn} title="Print application">
            <Printer size={15} /> Print
          </button>
          {documents.length > 0 && (
            <button onClick={handleDownloadAll} style={s.outlineBtn} title="Download all documents">
              <Download size={15} /> Download All
            </button>
          )}
        </div>
      </div>

      {/* Content: main + sidebar */}
      <div style={s.detailGrid} className="admin-app-detail-grid">
        {/* Main content */}
        <div style={s.detailMain}>
          {/* 1. Personal Information */}
          <CollapsibleSection title="Personal Information" icon={User} defaultOpen={true}>
            <div style={s.fieldGrid}>
              <Field label="First Name" value={application.first_name} />
              <Field label="Middle Name" value={application.middle_name} />
              <Field label="Last Name" value={application.last_name} />
              <Field label="Preferred Name" value={application.preferred_name} />
              <Field label="SSN (last 4)" value={application.ssn_last4} mono />
              <Field label="Date of Birth" value={formatDate(application.date_of_birth)} />
              <Field label="Gender" value={application.gender} />
              <Field label="Home Phone" value={application.home_phone} href={application.home_phone ? `tel:${application.home_phone}` : undefined} />
              <Field label="Cell Phone" value={application.cell_phone} href={application.cell_phone ? `tel:${application.cell_phone}` : undefined} />
              <Field label="Email" value={application.email} href={application.email ? `mailto:${application.email}` : undefined} />
              <Field label="Over 18" value={application.is_over_18} />
              <Field label="U.S. Citizen" value={application.is_citizen} />
              <Field label="Work Eligible" value={application.is_eligible} />
              <Field label="Heard About Us" value={application.hear_about_us} />
            </div>
            {/* Address */}
            <div style={{ marginTop: 12 }}>
              <span style={s.fieldLabel}>Address</span>
              <p style={{ margin: '4px 0 0', fontSize: 14, color: 'var(--text-main)' }}>
                {[application.street, application.city, application.state, application.zip].filter(Boolean).join(', ') || '-'}
              </p>
            </div>
            {application.former_names && (
              <div style={{ marginTop: 12 }}>
                <Field label="Former Names" value={application.former_names} />
              </div>
            )}
            {application.drivers_license && (
              <div style={{ display: 'flex', gap: 24, marginTop: 12 }}>
                <Field label="Driver's License" value={application.drivers_license} mono />
                <Field label="DL State" value={application.drivers_license_state} />
              </div>
            )}
            {application.race && <Field label="Race/Ethnicity" value={application.race} />}
            {application.residency_history && Array.isArray(application.residency_history) && application.residency_history.length > 0 && (
              <div style={{ marginTop: 12 }}>
                <span style={s.fieldLabel}>Residency History</span>
                {application.residency_history.map((r, i) => (
                  <p key={i} style={{ margin: '4px 0', fontSize: 13, color: 'var(--text-main)' }}>
                    {[r.address, r.city, r.state, r.zip].filter(Boolean).join(', ')} {r.from && r.to ? `(${r.from} - ${r.to})` : ''}
                  </p>
                ))}
              </div>
            )}
          </CollapsibleSection>

          {/* 2. Employment Desired */}
          <CollapsibleSection title="Employment Desired" icon={Briefcase} defaultOpen={true}>
            <div style={s.fieldGrid}>
              <Field label="Position" value={application.position} />
              <Field label="Start Date" value={application.start_date} />
              <Field label="Desired Pay" value={application.desired_pay} />
              <Field label="Employment Type" value={empType} />
              <Field label="Preferred Shift" value={prefShift} />
              <Field label="Previously Employed" value={application.previously_employed} />
              <Field label="Previous Dates" value={application.previous_dates} />
            </div>
          </CollapsibleSection>

          {/* 3. Employment History */}
          <CollapsibleSection title="Employment History" icon={Clock}>
            {employers.length > 0 ? employers.map((emp, i) => (
              <div key={i} style={s.subCard}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-main)' }}>
                    {emp.name || `Employer ${i + 1}`}
                  </span>
                  {(emp.dateFrom || emp.dateTo) && (
                    <span style={{ fontSize: 12, color: 'var(--text-light-color)' }}>
                      {emp.dateFrom} - {emp.dateTo || 'Present'}
                    </span>
                  )}
                </div>
                <div style={s.fieldGrid}>
                  <Field label="Title" value={emp.title} />
                  <Field label="Supervisor" value={emp.supervisor} />
                  <Field label="Supervisor Title" value={emp.supervisorTitle} />
                  <Field label="Phone" value={emp.phone} href={emp.phone ? `tel:${emp.phone}` : undefined} />
                  <Field label="City" value={emp.city} />
                  <Field label="State" value={emp.state} />
                  <Field label="ZIP" value={emp.zip} />
                  <Field label="May Contact" value={emp.mayContact} />
                </div>
                {emp.workPerformed && (
                  <div style={{ marginTop: 8 }}>
                    <span style={s.fieldLabel}>Work Performed</span>
                    <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-main)', lineHeight: 1.5 }}>{emp.workPerformed}</p>
                  </div>
                )}
                {emp.reasonLeaving && (
                  <div style={{ marginTop: 8 }}>
                    <span style={s.fieldLabel}>Reason for Leaving</span>
                    <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-main)' }}>{emp.reasonLeaving}</p>
                  </div>
                )}
              </div>
            )) : <p style={s.emptyText}>No employment history provided.</p>}

            {/* Background questions */}
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {application.convicted && (
                <div style={s.bgQuestion}>
                  <span style={s.bgLabel}>Convicted of a crime?</span>
                  <span style={{ fontWeight: 600, color: application.convicted === 'Yes' ? '#dc2626' : '#16a34a' }}>{application.convicted}</span>
                  {application.convicted_explanation && <p style={s.bgExplanation}>{application.convicted_explanation}</p>}
                </div>
              )}
              {application.excluded_medicaid && (
                <div style={s.bgQuestion}>
                  <span style={s.bgLabel}>Excluded from Medicaid?</span>
                  <span style={{ fontWeight: 600, color: application.excluded_medicaid === 'Yes' ? '#dc2626' : '#16a34a' }}>{application.excluded_medicaid}</span>
                  {application.excluded_explanation && <p style={s.bgExplanation}>{application.excluded_explanation}</p>}
                </div>
              )}
              {application.disciplined && (
                <div style={s.bgQuestion}>
                  <span style={s.bgLabel}>Disciplined by licensing board?</span>
                  <span style={{ fontWeight: 600, color: application.disciplined === 'Yes' ? '#dc2626' : '#16a34a' }}>{application.disciplined}</span>
                  {application.disciplined_explanation && <p style={s.bgExplanation}>{application.disciplined_explanation}</p>}
                </div>
              )}
            </div>
          </CollapsibleSection>

          {/* 4. Education */}
          <CollapsibleSection title="Education" icon={BookOpen}>
            {education.length > 0 ? education.map((edu, i) => (
              <div key={i} style={s.subCard}>
                <div style={s.fieldGrid}>
                  <Field label="Level" value={edu.level} />
                  <Field label="School Name" value={edu.schoolName} />
                  <Field label="Years Attended" value={edu.yearsAttended} />
                  <Field label="State" value={edu.state} />
                  <Field label="Degree/Certificate #" value={edu.degreeNumber} />
                </div>
              </div>
            )) : <p style={s.emptyText}>No education entries provided.</p>}
          </CollapsibleSection>

          {/* 5. Licenses & Skills */}
          <CollapsibleSection title="Licenses & Certifications" icon={Award}>
            {licenses.length > 0 ? (
              <div style={{ marginBottom: 16 }}>
                {licenses.map((lic, i) => (
                  <div key={i} style={{ ...s.subCard, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', padding: 12 }}>
                    <div style={{ flex: '1 1 auto', minWidth: 100 }}>
                      <span style={s.fieldLabel}>Type</span>
                      <p style={{ margin: '2px 0 0', fontSize: 14, fontWeight: 600, color: 'var(--text-main)' }}>{lic.type || '-'}</p>
                    </div>
                    <div style={{ flex: '0 0 auto' }}>
                      <span style={s.fieldLabel}>State</span>
                      <p style={{ margin: '2px 0 0', fontSize: 14, color: 'var(--text-main)' }}>{lic.state || '-'}</p>
                    </div>
                    <div style={{ flex: '0 0 auto' }}>
                      <span style={s.fieldLabel}>Exp. Year</span>
                      <p style={{ margin: '2px 0 0', fontSize: 14, color: 'var(--text-main)' }}>{lic.expirationYear || '-'}</p>
                    </div>
                    <div style={{ flex: '0 0 auto' }}>
                      <span style={s.fieldLabel}>License #</span>
                      <p style={{ margin: '2px 0 0', fontSize: 13, fontFamily: 'monospace', color: 'var(--text-main)' }}>{lic.number || '-'}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : <p style={s.emptyText}>No licenses provided.</p>}

            {/* Skills Assessment */}
            {Object.keys(skillsAssessment).length > 0 && (
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)', margin: '0 0 10px' }}>
                  Skills Self-Assessment
                </h4>
                <div style={{ display: 'flex', gap: 16, marginBottom: 10, fontSize: 12, color: 'var(--text-light-color)', flexWrap: 'wrap' }}>
                  <span><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: 'var(--primary)', marginRight: 4, verticalAlign: 'middle' }} />A = Can perform well</span>
                  <span><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: '#f59e0b', marginRight: 4, verticalAlign: 'middle' }} />B = Need to review</span>
                  <span><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: 'var(--text-light-color)', marginRight: 4, verticalAlign: 'middle' }} />C = No experience</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 6 }}>
                  {SKILLS_LIST.map((skill) => {
                    const rating = skillsAssessment[skill];
                    if (!rating) return null;
                    const ratingColor = rating === 'A' ? 'var(--primary)' : rating === 'B' ? '#f59e0b' : 'var(--text-light-color)';
                    return (
                      <div key={skill} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 8, background: 'var(--bg)' }}>
                        <span style={{
                          width: 24, height: 24, borderRadius: '50%', background: ratingColor,
                          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 11, fontWeight: 700, flexShrink: 0,
                        }}>{rating}</span>
                        <span style={{ fontSize: 13, color: 'var(--text-main)' }}>{skill}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CollapsibleSection>

          {/* 6. References */}
          <CollapsibleSection title="References" icon={Users}>
            {references.length > 0 ? references.map((ref, i) => (
              <div key={i} style={s.subCard}>
                <div style={s.fieldGrid}>
                  <Field label="Name" value={ref.name} />
                  <Field label="Phone" value={ref.phone} href={ref.phone ? `tel:${ref.phone}` : undefined} />
                  <Field label="Best Time to Call" value={ref.bestTime} />
                </div>
              </div>
            )) : <p style={s.emptyText}>No references provided.</p>}
          </CollapsibleSection>

          {/* 7. Documents */}
          <CollapsibleSection title="Documents" icon={Paperclip}>
            {documents.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {documents.map((doc) => (
                  <div key={doc.id} style={s.docRow}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                      <FileText size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                      <div style={{ minWidth: 0 }}>
                        <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {doc.file_name}
                        </p>
                        <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-light-color)' }}>
                          {doc.doc_type && <span style={{ textTransform: 'capitalize' }}>{doc.doc_type.replace(/_/g, ' ')} &middot; </span>}
                          {formatBytes(doc.file_size)} &middot; {formatDate(doc.uploaded_at)}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                      <button onClick={() => handleViewDocument(doc)} style={s.smallBtn} title="View">
                        <ExternalLink size={14} />
                      </button>
                      <button onClick={() => handleDownloadDocument(doc)} style={s.smallBtn} title="Download">
                        <Download size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : <p style={s.emptyText}>No documents uploaded.</p>}
          </CollapsibleSection>

          {/* 8. Agreements */}
          <CollapsibleSection title="Agreements" icon={CheckCircle}>
            {Object.keys(agreements).length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {agreements.backgroundCheck !== undefined && (
                  <div style={s.agreementRow}>
                    <CheckCircle size={16} style={{ color: agreements.backgroundCheck ? '#16a34a' : 'var(--text-light-color)', flexShrink: 0 }} />
                    <div>
                      <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-main)' }}>Background Check Authorization</span>
                      {agreements.backgroundSignature && (
                        <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-light-color)', fontStyle: 'italic' }}>
                          Signed: "{agreements.backgroundSignature}"
                        </p>
                      )}
                    </div>
                  </div>
                )}
                {agreements.confidentiality !== undefined && (
                  <div style={s.agreementRow}>
                    <CheckCircle size={16} style={{ color: agreements.confidentiality ? '#16a34a' : 'var(--text-light-color)', flexShrink: 0 }} />
                    <div>
                      <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-main)' }}>Confidentiality & NDA</span>
                      {agreements.confidentialitySignature && (
                        <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-light-color)', fontStyle: 'italic' }}>
                          Signed: "{agreements.confidentialitySignature}"
                        </p>
                      )}
                    </div>
                  </div>
                )}
                {agreements.substanceAbuse !== undefined && (
                  <div style={s.agreementRow}>
                    <CheckCircle size={16} style={{ color: agreements.substanceAbuse ? '#16a34a' : 'var(--text-light-color)', flexShrink: 0 }} />
                    <div>
                      <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-main)' }}>Substance Abuse Policy</span>
                      {agreements.substanceAbuseSignature && (
                        <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-light-color)', fontStyle: 'italic' }}>
                          Signed: "{agreements.substanceAbuseSignature}"
                        </p>
                      )}
                    </div>
                  </div>
                )}
                {agreements.certification !== undefined && (
                  <div style={s.agreementRow}>
                    <CheckCircle size={16} style={{ color: agreements.certification ? '#16a34a' : 'var(--text-light-color)', flexShrink: 0 }} />
                    <div>
                      <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-main)' }}>Employment Certification</span>
                      {agreements.certificationSignature && (
                        <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-light-color)', fontStyle: 'italic' }}>
                          Signed: "{agreements.certificationSignature}"
                        </p>
                      )}
                    </div>
                  </div>
                )}
                {agreements.atWill !== undefined && (
                  <div style={s.agreementRow}>
                    <CheckCircle size={16} style={{ color: agreements.atWill ? '#16a34a' : 'var(--text-light-color)', flexShrink: 0 }} />
                    <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-main)' }}>At-Will Employment Acknowledgment</span>
                  </div>
                )}
              </div>
            ) : <p style={s.emptyText}>No agreements data.</p>}
          </CollapsibleSection>

          {/* 9. Direct Deposit */}
          <CollapsibleSection title="Direct Deposit" icon={CreditCard}>
            {Object.keys(directDeposit).length > 0 ? (
              <div style={s.fieldGrid}>
                <Field label="Bank Name" value={directDeposit.bankName} />
                <Field label="Routing Number" value={directDeposit.routingNumber} mono />
                <Field label="Account Number" value={directDeposit.accountNumber} mono />
                <Field label="Account Type" value={directDeposit.accountType} />
              </div>
            ) : <p style={s.emptyText}>No direct deposit information provided.</p>}
            {application.hbv_vaccine_choice && (
              <div style={{ marginTop: 12 }}>
                <Field label="HBV Vaccine Choice" value={application.hbv_vaccine_choice} />
              </div>
            )}
          </CollapsibleSection>
        </div>

        {/* Sidebar */}
        <div style={s.detailSidebar}>
          {/* Actions card */}
          <div style={s.sidebarCard}>
            <h3 style={s.sidebarTitle}>
              <ClipboardCheck size={16} /> Actions
            </h3>

            {/* Status dropdown */}
            <div style={{ marginBottom: 16 }}>
              <label style={s.miniLabel}>Status</label>
              <div style={{ position: 'relative' }}>
                <select
                  value={status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={savingStatus}
                  style={{ ...s.input, appearance: 'none', paddingRight: 36, fontWeight: 600 }}
                >
                  {STATUSES.map((st) => (
                    <option key={st.value} value={st.value}>{st.label}</option>
                  ))}
                </select>
                <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light-color)', pointerEvents: 'none' }} />
              </div>
            </div>

            {/* Reviewed by */}
            {(application.reviewed_by || user?.email) && (
              <div style={{ marginBottom: 16 }}>
                <label style={s.miniLabel}>Reviewed By</label>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-main)' }}>
                  {application.reviewed_by || user?.email}
                </p>
                {application.reviewed_at && (
                  <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-light-color)' }}>
                    {formatDateTime(application.reviewed_at)}
                  </p>
                )}
              </div>
            )}

            {/* Admin Notes */}
            <div style={{ marginBottom: 16 }}>
              <label style={s.miniLabel}>
                <StickyNote size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                Admin Notes
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                onBlur={handleNotesSave}
                placeholder="Add private notes about this applicant..."
                rows={5}
                style={{ ...s.input, resize: 'vertical', minHeight: 80 }}
              />
              {savingNotes && <p style={{ fontSize: 11, color: 'var(--text-light-color)', margin: '4px 0 0' }}>Saving...</p>}
            </div>

            {/* Quick info */}
            <div style={{ borderTop: '1px solid var(--bg-alt)', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {application.email && (
                <a href={`mailto:${application.email}`} style={s.quickLink}>
                  <Mail size={14} /> {application.email}
                </a>
              )}
              {application.cell_phone && (
                <a href={`tel:${application.cell_phone}`} style={s.quickLink}>
                  <Phone size={14} /> {application.cell_phone}
                </a>
              )}
              {application.position && (
                <span style={s.quickLink}>
                  <Briefcase size={14} /> {application.position}
                </span>
              )}
            </div>
          </div>

          {/* Reference Checks card */}
          <div style={s.sidebarCard}>
            <h3 style={s.sidebarTitle}>
              <ClipboardCheck size={16} /> Reference Checks
            </h3>
            <p style={{ fontSize: 12, color: 'var(--text-light-color)', margin: '0 0 12px' }}>
              To be filled by office staff
            </p>
            {references.length > 0 ? (
              <>
                {references.map((ref, i) => (
                  <ReferenceCheckForm
                    key={i}
                    refData={ref}
                    checkData={referenceChecks[`ref_${i}`]}
                    onChange={(data) => setReferenceChecks((prev) => ({ ...prev, [`ref_${i}`]: data }))}
                  />
                ))}
                <button
                  onClick={handleSaveRefChecks}
                  disabled={savingRefChecks}
                  style={{ ...s.primaryBtn, width: '100%', justifyContent: 'center', marginTop: 8 }}
                >
                  {savingRefChecks ? 'Saving...' : 'Save Reference Checks'}
                </button>
              </>
            ) : (
              <p style={s.emptyText}>No references to check.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Main Component: List View                                          */
/* ================================================================== */
export default function AdminApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPosition, setFilterPosition] = useState('all');
  const [selectedApp, setSelectedApp] = useState(null);
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState(null);

  /* -- Fetch applications -- */
  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('applications')
        .select('id, reference_number, first_name, middle_name, last_name, position, status, email, cell_phone, created_at', { count: 'exact' })
        .order('created_at', { ascending: false });

      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
      }
      if (filterPosition !== 'all') {
        query = query.eq('position', filterPosition);
      }
      if (search.trim()) {
        const q = search.trim();
        query = query.or(`first_name.ilike.%${q}%,last_name.ilike.%${q}%,email.ilike.%${q}%,reference_number.ilike.%${q}%`);
      }

      const from = page * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      query = query.range(from, to);

      const { data, error: fetchErr, count } = await query;
      if (fetchErr) throw fetchErr;
      setApplications(data || []);
      setTotalCount(count ?? 0);
    } catch (err) {
      console.error('Fetch applications error:', err);
      setError('Failed to load applications.');
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  }, [filterStatus, filterPosition, search, page]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  /* -- Fetch status counts for tabs -- */
  const [statusCounts, setStatusCounts] = useState({});
  const fetchStatusCounts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('status');
      if (error) throw error;
      const counts = {};
      (data || []).forEach((a) => {
        counts[a.status] = (counts[a.status] || 0) + 1;
      });
      setStatusCounts(counts);
    } catch (err) {
      console.error('Fetch counts error:', err);
    }
  }, []);

  useEffect(() => {
    fetchStatusCounts();
  }, [fetchStatusCounts]);

  /* -- Positions for filter -- */
  const [positions, setPositions] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase
          .from('applications')
          .select('position')
          .not('position', 'is', null);
        const unique = [...new Set((data || []).map((d) => d.position).filter(Boolean))];
        setPositions(unique.sort());
      } catch (err) {
        console.error('Fetch positions error:', err);
      }
    })();
  }, []);

  /* -- Open detail view -- */
  const openDetail = async (app) => {
    try {
      // Fetch full application
      const { data: fullApp, error: appErr } = await supabase
        .from('applications')
        .select('*')
        .eq('id', app.id)
        .single();
      if (appErr) throw appErr;

      // Fetch documents
      const { data: docs, error: docsErr } = await supabase
        .from('documents')
        .select('*')
        .eq('application_id', app.id)
        .order('uploaded_at', { ascending: false });

      setSelectedApp(fullApp);
      setSelectedDocs(docs || []);
    } catch (err) {
      console.error('Open detail error:', err);
      toast.error('Failed to load application details');
    }
  };

  const handleDetailUpdate = (updatedApp) => {
    setSelectedApp(updatedApp);
    setApplications((prev) =>
      prev.map((a) => (a.id === updatedApp.id ? { ...a, status: updatedApp.status } : a))
    );
    fetchStatusCounts();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });
  };

  const totalAll = Object.values(statusCounts).reduce((sum, c) => sum + c, 0);
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  /* -- If detail view selected -- */
  if (selectedApp) {
    return (
      <ApplicationDetail
        application={selectedApp}
        documents={selectedDocs}
        onBack={() => {
          setSelectedApp(null);
          setSelectedDocs([]);
          fetchApplications();
        }}
        onUpdate={handleDetailUpdate}
      />
    );
  }

  /* -- List View -- */
  return (
    <div>
      {/* Page header */}
      <div style={s.pageHeader}>
        <div>
          <h1 style={s.pageTitle}>Applications</h1>
          <p style={s.pageSubtitle}>Review and manage job applications.</p>
        </div>
        <button style={s.refreshBtn} onClick={() => { fetchApplications(); fetchStatusCounts(); }} title="Refresh">
          <RefreshCw size={16} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={s.errorBanner}>
          <AlertTriangle size={16} style={{ marginRight: 8, flexShrink: 0 }} />
          {error}
          <button onClick={fetchApplications} style={{ ...s.linkBtn, marginLeft: 12, color: '#dc2626' }}>
            Retry
          </button>
        </div>
      )}

      {/* Status filter tabs */}
      <div style={s.filterBar}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', flex: 1 }}>
          <button
            onClick={() => { setFilterStatus('all'); setPage(0); }}
            style={{ ...s.filterChip, ...(filterStatus === 'all' ? s.filterChipActive : {}) }}
          >
            All ({totalAll})
          </button>
          {STATUSES.map((st) => (
            <button
              key={st.value}
              onClick={() => { setFilterStatus(st.value); setPage(0); }}
              style={{
                ...s.filterChip,
                ...(filterStatus === st.value ? s.filterChipActive : {}),
              }}
            >
              {st.label} ({statusCounts[st.value] || 0})
            </button>
          ))}
        </div>
      </div>

      {/* Search + position filter */}
      <div style={s.searchRow}>
        <div style={{ position: 'relative', flex: '1 1 300px', maxWidth: 400 }}>
          <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light-color)' }} />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            placeholder="Search by name, email, or reference #..."
            style={{ ...s.input, paddingLeft: 38 }}
          />
        </div>
        {positions.length > 0 && (
          <div style={{ position: 'relative' }}>
            <select
              value={filterPosition}
              onChange={(e) => { setFilterPosition(e.target.value); setPage(0); }}
              style={{ ...s.input, appearance: 'none', paddingRight: 36, minWidth: 180 }}
            >
              <option value="all">All Positions</option>
              {positions.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light-color)', pointerEvents: 'none' }} />
          </div>
        )}
      </div>

      {/* Table */}
      <div style={s.card}>
        <div style={s.tableWrap}>
          {loading ? (
            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} height={48} borderRadius={10} />
              ))}
            </div>
          ) : applications.length === 0 ? (
            <div style={s.emptyState}>
              <FileText size={40} style={{ color: 'var(--bg-alt)', marginBottom: 12 }} />
              <p style={{ fontSize: 15, color: 'var(--text-light-color)', margin: 0 }}>
                {search || filterStatus !== 'all' || filterPosition !== 'all'
                  ? 'No applications match your filters.'
                  : 'No applications received yet.'}
              </p>
            </div>
          ) : (
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Ref #</th>
                  <th style={s.th}>Applicant Name</th>
                  <th style={s.th}>Position</th>
                  <th style={s.th}>Date Applied</th>
                  <th style={s.th}>Status</th>
                  <th style={{ ...s.th, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr
                    key={app.id}
                    style={{
                      ...s.tr,
                      cursor: 'pointer',
                      background: app.status === 'new' ? 'color-mix(in srgb, var(--primary) 3%, transparent)' : 'transparent',
                    }}
                    onClick={() => openDetail(app)}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'color-mix(in srgb, var(--primary) 6%, transparent)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = app.status === 'new' ? 'color-mix(in srgb, var(--primary) 3%, transparent)' : 'transparent'; }}
                  >
                    <td style={s.td}>
                      <span style={{ fontFamily: 'monospace', fontSize: 13, color: 'var(--primary-dark)', fontWeight: 600 }}>
                        {app.reference_number || '-'}
                      </span>
                    </td>
                    <td style={{ ...s.td, fontWeight: app.status === 'new' ? 600 : 400 }}>
                      <div>
                        {app.first_name} {app.last_name}
                        <br />
                        <span style={{ fontSize: 12, color: 'var(--text-light-color)' }}>{app.email}</span>
                      </div>
                    </td>
                    <td style={s.td}>
                      {app.position ? (
                        <span style={{ padding: '3px 10px', borderRadius: 12, fontSize: 12, background: 'var(--bg-alt)', color: 'var(--text-main)', fontWeight: 500 }}>
                          {app.position}
                        </span>
                      ) : '-'}
                    </td>
                    <td style={s.td}>
                      <span style={{ fontSize: 13, color: 'var(--text-light-color)', whiteSpace: 'nowrap' }}>
                        <Calendar size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                        {formatDate(app.created_at)}
                      </span>
                    </td>
                    <td style={s.td}>
                      <StatusBadge status={app.status} />
                    </td>
                    <td style={{ ...s.td, textAlign: 'right' }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); openDetail(app); }}
                        style={s.viewBtn}
                        title="View application"
                      >
                        <Eye size={15} /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div style={s.pagination}>
            <span style={{ fontSize: 13, color: 'var(--text-light-color)' }}>
              Showing {page * PAGE_SIZE + 1}-{Math.min((page + 1) * PAGE_SIZE, totalCount)} of {totalCount}
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                style={{ ...s.pageBtn, opacity: page === 0 ? 0.4 : 1 }}
              >
                Previous
              </button>
              {/* Page numbers (show max 5) */}
              {(() => {
                const pages = [];
                let start = Math.max(0, page - 2);
                let end = Math.min(totalPages - 1, start + 4);
                if (end - start < 4) start = Math.max(0, end - 4);
                for (let i = start; i <= end; i++) {
                  pages.push(
                    <button
                      key={i}
                      onClick={() => setPage(i)}
                      style={{
                        ...s.pageBtn,
                        ...(i === page ? {
                          background: 'var(--primary)',
                          color: '#fff',
                          borderColor: 'var(--primary)',
                        } : {}),
                      }}
                    >
                      {i + 1}
                    </button>
                  );
                }
                return pages;
              })()}
              <button
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page >= totalPages - 1}
                style={{ ...s.pageBtn, opacity: page >= totalPages - 1 ? 0.4 : 1 }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media print {
          .admin-sidebar, .admin-topbar, .admin-overlay { display: none !important; }
          .admin-main { margin-left: 0 !important; }
        }
        @media (max-width: 900px) {
          .admin-app-detail-grid {
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
  /* Page header */
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

  /* Filters */
  filterBar: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
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
  searchRow: {
    display: 'flex',
    gap: 12,
    marginBottom: 20,
    flexWrap: 'wrap',
    alignItems: 'center',
  },

  /* Table */
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
  viewBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 14px',
    borderRadius: 8,
    border: '1.5px solid var(--primary)',
    background: 'transparent',
    color: 'var(--primary)',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
  },

  /* Pagination */
  pagination: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    borderTop: '1px solid var(--bg-alt)',
    flexWrap: 'wrap',
    gap: 12,
  },
  pageBtn: {
    padding: '6px 12px',
    borderRadius: 8,
    border: '1px solid var(--bg-alt)',
    background: 'var(--white)',
    color: 'var(--text-main)',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
    transition: 'all 0.15s ease',
  },

  /* Detail view header */
  detailHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: 'var(--text-main)',
    fontFamily: "'Lora', serif",
    margin: 0,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    border: '1px solid var(--bg-alt)',
    background: 'var(--white)',
    color: 'var(--text-main)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    flexShrink: 0,
    transition: 'background 0.2s ease',
  },
  refBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '3px 10px',
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 600,
    fontFamily: 'monospace',
    background: 'var(--bg-alt)',
    color: 'var(--primary-dark)',
  },
  outlineBtn: {
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
    transition: 'background 0.2s ease',
    whiteSpace: 'nowrap',
  },

  /* Detail grid */
  detailGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 360px',
    gap: 20,
    alignItems: 'start',
  },
  detailMain: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  detailSidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    position: 'sticky',
    top: 80,
  },

  /* Collapsible section */
  section: {
    background: 'var(--white)',
    borderRadius: 16,
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    overflow: 'hidden',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '14px 20px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    transition: 'background 0.15s ease',
    fontFamily: "'Inter', sans-serif",
  },
  sectionIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    background: 'color-mix(in srgb, var(--primary) 10%, transparent)',
    color: 'var(--primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 600,
    color: 'var(--text-main)',
  },
  sectionBody: {
    padding: '0 20px 20px',
  },

  /* Fields */
  fieldGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: 12,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: 'var(--text-light-color)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  fieldValue: {
    fontSize: 14,
    color: 'var(--text-main)',
  },
  subCard: {
    padding: 14,
    borderRadius: 12,
    background: 'var(--bg)',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: 'var(--text-light-color)',
    margin: 0,
    padding: '8px 0',
  },

  /* Background questions */
  bgQuestion: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
    padding: '10px 14px',
    borderRadius: 10,
    background: 'var(--bg)',
    fontSize: 14,
  },
  bgLabel: {
    color: 'var(--text-main)',
    fontWeight: 500,
  },
  bgExplanation: {
    width: '100%',
    margin: '4px 0 0',
    fontSize: 13,
    color: 'var(--text-light-color)',
    lineHeight: 1.5,
  },

  /* Documents */
  docRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    padding: '10px 14px',
    borderRadius: 10,
    background: 'var(--bg)',
    transition: 'background 0.15s ease',
  },
  smallBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    border: '1px solid var(--bg-alt)',
    background: 'var(--white)',
    color: 'var(--primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'background 0.2s ease',
  },

  /* Agreements */
  agreementRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
    padding: '10px 14px',
    borderRadius: 10,
    background: 'var(--bg)',
  },

  /* Sidebar */
  sidebarCard: {
    background: 'var(--white)',
    borderRadius: 16,
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    padding: 20,
  },
  sidebarTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 15,
    fontWeight: 700,
    color: 'var(--text-main)',
    fontFamily: "'Lora', serif",
    margin: '0 0 16px',
  },
  miniLabel: {
    display: 'block',
    fontSize: 11,
    fontWeight: 600,
    color: 'var(--text-light-color)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: 4,
  },
  quickLink: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 13,
    color: 'var(--primary)',
    textDecoration: 'none',
    fontWeight: 500,
  },

  /* Reference checks */
  miniTh: {
    padding: '6px 8px',
    fontSize: 11,
    fontWeight: 600,
    color: 'var(--text-light-color)',
    borderBottom: '1px solid var(--bg-alt)',
    whiteSpace: 'nowrap',
  },
  miniTd: {
    padding: '6px 8px',
    fontSize: 12,
    color: 'var(--text-main)',
    borderBottom: '1px solid var(--bg-alt)',
  },

  /* Shared */
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
