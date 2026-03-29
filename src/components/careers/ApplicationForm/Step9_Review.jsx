import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Edit2, CheckCircle, FileText, Send } from 'lucide-react';
import useApplicationStore from '../../../store/useApplicationStore';
import Button from '../../shared/Button';
import SubmissionSuccess from './SubmissionSuccess';

function Section({ title, step, children }) {
  const [open, setOpen] = useState(true);
  const { goToStep } = useApplicationStore();
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-alt)' }}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-4 text-left">
        <span className="font-bold" style={{ color: 'var(--text-main)' }}>{title}</span>
        <div className="flex items-center gap-2">
          <button onClick={(e) => { e.stopPropagation(); goToStep(step); }} className="text-xs px-2 py-1 rounded-lg hover:bg-black/5 flex items-center gap-1" style={{ color: 'var(--primary)' }}>
            <Edit2 size={12} /> Edit
          </button>
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
            <div className="px-4 pb-4 text-sm space-y-1" style={{ color: 'var(--text-light-color)' }}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({ label, value }) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;
  return (
    <div className="flex gap-2">
      <span className="font-medium shrink-0" style={{ color: 'var(--text-main)' }}>{label}:</span>
      <span>{Array.isArray(value) ? value.join(', ') : value}</span>
    </div>
  );
}

export default function Step9_Review() {
  const store = useApplicationStore();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const p = store.personalInfo;
  const e = store.employmentDesired;
  const h = store.employmentHistory;

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 2000));
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) return <SubmissionSuccess name={p.firstName} email={p.email} />;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: 'var(--text-main)' }}>Review Your Application</h2>
        <p className="text-sm" style={{ color: 'var(--text-light-color)' }}>Please review all information before submitting.</p>
      </div>

      <div className="space-y-4">
        <Section title="Personal Information" step={1}>
          <Field label="Name" value={`${p.firstName} ${p.middleName} ${p.lastName}`} />
          {p.preferredName && <Field label="Preferred Name" value={p.preferredName} />}
          <Field label="Date of Birth" value={p.dob} />
          <Field label="Address" value={`${p.street}, ${p.city}, ${p.state} ${p.zip}`} />
          <Field label="Gender" value={p.gender} />
          <Field label="Cell Phone" value={p.cellPhone} />
          <Field label="Email" value={p.email} />
        </Section>

        <Section title="Employment Desired" step={2}>
          <Field label="Position" value={e.position} />
          <Field label="Start Date" value={e.startDate} />
          <Field label="Desired Pay" value={e.desiredPay} />
          <Field label="Employment Type" value={e.employmentType} />
          <Field label="Preferred Shift" value={e.preferredShift} />
        </Section>

        <Section title="Employment History" step={3}>
          {h.employers.map((emp, i) => emp.name && (
            <div key={i} className="mb-2">
              <span className="font-medium" style={{ color: 'var(--text-main)' }}>{emp.name}</span>
              {emp.title && <span> — {emp.title}</span>}
              {emp.dateFrom && <span className="text-xs ml-2">({emp.dateFrom} to {emp.dateTo})</span>}
            </div>
          ))}
        </Section>

        <Section title="Education" step={4}>
          {store.education.map((edu, i) => edu.schoolName && (
            <div key={i}><span className="font-medium" style={{ color: 'var(--text-main)' }}>{edu.level}</span> — {edu.schoolName}</div>
          ))}
        </Section>

        <Section title="Licenses & Skills" step={5}>
          {store.licenses.map((lic, i) => lic.type && (
            <div key={i}>{lic.type} — {lic.state} (Exp: {lic.expirationYear})</div>
          ))}
          <div className="mt-2">Skills assessed: {Object.keys(store.skillsAssessment).length} items</div>
        </Section>

        <Section title="References" step={6}>
          {store.references.map((ref, i) => ref.name && (
            <div key={i}>{ref.name} — {ref.phone}</div>
          ))}
        </Section>

        <Section title="Documents" step={7}>
          {Object.entries(store.documents).map(([key, doc]) => (
            <div key={key} className="flex items-center gap-2">
              <FileText size={14} style={{ color: 'var(--primary)' }} />
              <span>{doc.name}</span>
            </div>
          ))}
          {Object.keys(store.documents).length === 0 && <span>No documents uploaded yet</span>}
        </Section>

        <Section title="Agreements" step={8}>
          {store.agreements.backgroundCheck && <div className="flex items-center gap-2"><CheckCircle size={14} style={{ color: 'var(--primary)' }} /> Background check authorized</div>}
          {store.agreements.confidentiality && <div className="flex items-center gap-2"><CheckCircle size={14} style={{ color: 'var(--primary)' }} /> Confidentiality NDA signed</div>}
          {store.agreements.substanceAbuse && <div className="flex items-center gap-2"><CheckCircle size={14} style={{ color: 'var(--primary)' }} /> Substance abuse policy acknowledged</div>}
          {store.agreements.certification && <div className="flex items-center gap-2"><CheckCircle size={14} style={{ color: 'var(--primary)' }} /> Employment certification signed</div>}
          {store.agreements.atWill && <div className="flex items-center gap-2"><CheckCircle size={14} style={{ color: 'var(--primary)' }} /> At-will employment acknowledged</div>}
        </Section>
      </div>

      <div className="flex justify-between pt-8">
        <Button type="button" variant="ghost" onClick={store.prevStep}>Back</Button>
        <Button onClick={handleSubmit} size="lg" loading={submitting}>
          <Send size={18} /> Submit Application
        </Button>
      </div>
    </div>
  );
}
