import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Edit2, CheckCircle, FileText, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import useApplicationStore from '../../../store/useApplicationStore';
import { supabase } from '../../../lib/supabase';
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

  const [refNumber, setRefNumber] = useState('');

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const generatedRef = `DHH-${Date.now().toString().slice(-8)}`;

      // Insert application into Supabase
      const { data: appData, error: appError } = await supabase.from('applications').insert({
        reference_number: generatedRef,
        job_id: store.selectedJob?.id || null,
        status: 'new',
        // Personal Info
        first_name: p.firstName,
        middle_name: p.middleName || null,
        last_name: p.lastName,
        preferred_name: p.preferredName || null,
        date_of_birth: p.dob ? p.dob : null,
        street: p.street,
        city: p.city,
        state: p.state,
        zip: p.zip,
        gender: p.gender || null,
        home_phone: p.homePhone || null,
        cell_phone: p.cellPhone,
        email: p.email,
        is_over_18: p.isOver18 || null,
        is_citizen: p.isCitizen || null,
        is_eligible: p.isEligible || null,
        hear_about_us: p.hearAboutUs || null,
        ssn_last4: p.ssnLast4 || null,
        former_names: p.formerNames || null,
        drivers_license: p.driversLicenseNumber || null,
        drivers_license_state: p.driversLicenseState || null,
        // Employment Desired
        position: e.position || null,
        start_date: e.startDate ? e.startDate : null,
        desired_pay: e.desiredPay || null,
        employment_type: e.employmentType || [],
        preferred_shift: e.preferredShift || [],
        previously_employed: e.previouslyEmployed || null,
        previous_dates: e.previousDates || null,
        // Employment History
        employers: h.employers || [],
        convicted: h.convicted || null,
        convicted_explanation: h.convictedExplanation || null,
        excluded_medicaid: h.excludedMedicaid || null,
        excluded_explanation: h.excludedExplanation || null,
        disciplined: h.disciplined || null,
        disciplined_explanation: h.disciplinedExplanation || null,
        // Education, Licenses, Skills, References, Agreements
        education: store.education || [],
        licenses: store.licenses || [],
        skills_assessment: store.skillsAssessment || {},
        references_data: store.references || [],
        agreements: store.agreements || {},
      }).select().single();

      if (appError) throw appError;

      const applicationId = appData.id;

      // Upload documents to Supabase Storage and insert records
      const docFiles = store.documentFiles || {};
      const docMeta = store.documents || {};
      let uploadCount = 0;
      for (const [docType, file] of Object.entries(docFiles)) {
        if (!file) continue;
        // File objects may lose instanceof check across Zustand — check for name and size instead
        const hasFileData = file instanceof File || file instanceof Blob || (file.name && file.size);
        if (!hasFileData) { console.warn(`Skipping ${docType}: not a valid file`); continue; }

        const fileName = file.name || `${docType}_upload`;
        const filePath = `${applicationId}/${docType}_${fileName}`;
        try {
          const { error: uploadError } = await supabase.storage
            .from('documents')
            .upload(filePath, file, { upsert: true });

          if (uploadError) {
            console.error(`Error uploading ${docType}:`, uploadError);
            toast.error(`Failed to upload ${docType}: ${uploadError.message}`);
            continue;
          }

          // Insert document record
          const { error: docRecordError } = await supabase.from('documents').insert({
            application_id: applicationId,
            doc_type: docType,
            file_name: fileName,
            storage_path: filePath,
            file_size: file.size || 0,
            mime_type: file.type || 'application/octet-stream',
          });
          if (docRecordError) {
            console.error(`Error saving ${docType} record:`, docRecordError);
          } else {
            uploadCount++;
          }
        } catch (uploadErr) {
          console.error(`Upload exception for ${docType}:`, uploadErr);
        }
      }
      if (Object.keys(docFiles).length > 0) {
        toast.success(`${uploadCount} document(s) uploaded successfully`);
      }

      setRefNumber(generatedRef);
      setSubmitting(false);
      setSubmitted(true);
    } catch (err) {
      console.error('Application submission error:', err);
      toast.error('Something went wrong submitting your application. Please try again.');
      setSubmitting(false);
    }
  };

  if (submitted) return <SubmissionSuccess name={p.firstName} email={p.email} refNumber={refNumber} />;

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
          {p.ssnLast4 && <Field label="SSN (last 4)" value={`***-**-${p.ssnLast4}`} />}
          {p.formerNames && <Field label="Former Names" value={p.formerNames} />}
          <Field label="Address" value={`${p.street}, ${p.city}, ${p.state} ${p.zip}`} />
          <Field label="Gender" value={p.gender} />
          <Field label="Cell Phone" value={p.cellPhone} />
          <Field label="Email" value={p.email} />
          {p.driversLicenseNumber && <Field label="Driver's License" value={`${p.driversLicenseNumber} (${p.driversLicenseState || 'N/A'})`} />}
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
