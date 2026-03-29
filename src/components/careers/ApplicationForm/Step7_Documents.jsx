import { useState } from 'react';
import useApplicationStore from '../../../store/useApplicationStore';
import Button from '../../shared/Button';
import { ArrowRight, ArrowLeft, Upload, FileText, X, AlertCircle } from 'lucide-react';

const docTypes = [
  { key: 'id', label: 'ID / Driver\'s License', required: true },
  { key: 'passport', label: 'US Passport or Work Authorization', required: true },
  { key: 'ssn', label: 'Social Security Card', required: true },
  { key: 'nursingLicense', label: 'Nursing License Copy', required: false, note: 'Required for clinical roles' },
  { key: 'cprCert', label: 'CPR and First Aid Certificate', required: false, note: 'Required for clinical roles' },
  { key: 'ppd', label: 'PPD / TB Test Results', required: false, note: 'Required for clinical roles' },
  { key: 'voidCheck', label: 'Void Check for Direct Deposit', required: true },
  { key: 'autoInsurance', label: 'Auto Insurance Declaration', required: false },
  { key: 'headshot', label: 'Head-shot Photo', required: true },
  { key: 'resume', label: 'Resume', required: false, note: 'Recommended' },
  { key: 'other', label: 'Other Supporting Documents', required: false },
];

export default function Step7_Documents() {
  const { documents, updateDocuments, nextStep, prevStep } = useApplicationStore();
  const [localDocs, setLocalDocs] = useState(documents);

  const handleFile = (key, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { alert('File must be under 10MB'); return; }
    setLocalDocs(prev => ({ ...prev, [key]: { name: file.name, size: file.size, type: file.type } }));
  };

  const removeFile = (key) => {
    setLocalDocs(prev => { const n = { ...prev }; delete n[key]; return n; });
  };

  const handleContinue = () => {
    updateDocuments(localDocs);
    nextStep();
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: 'var(--text-main)' }}>Document Upload</h2>
        <p className="text-sm" style={{ color: 'var(--text-light-color)' }}>Upload required documents. Accepted formats: PDF, JPG, PNG (max 10MB each).</p>
        <div className="flex items-start gap-2 mt-3 p-3 rounded-xl text-sm" style={{ background: 'var(--accent-light)', color: 'var(--primary-dark)' }}>
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>Document uploads will be fully processed when the backend is connected. For now, files are captured locally for review.</span>
        </div>
      </div>

      <div className="space-y-4">
        {docTypes.map(doc => (
          <div key={doc.key} className="p-4 rounded-2xl" style={{ background: 'var(--bg-alt)' }}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-sm font-medium" style={{ color: 'var(--text-main)' }}>{doc.label}</span>
                {doc.required && <span className="text-red-500 text-xs ml-1">*</span>}
                {doc.note && <span className="text-xs ml-2" style={{ color: 'var(--text-light-color)' }}>({doc.note})</span>}
              </div>
            </div>
            {localDocs[doc.key] ? (
              <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--white)' }}>
                <FileText size={20} style={{ color: 'var(--primary)' }} />
                <span className="text-sm flex-1" style={{ color: 'var(--text-main)' }}>{localDocs[doc.key].name}</span>
                <button onClick={() => removeFile(doc.key)} className="text-red-400 hover:text-red-600 p-1"><X size={16} /></button>
              </div>
            ) : (
              <label className="flex flex-col items-center gap-2 p-6 rounded-xl border-2 border-dashed cursor-pointer hover:border-[var(--primary)] transition-colors"
                style={{ borderColor: 'var(--accent-light)' }}>
                <Upload size={24} style={{ color: 'var(--text-light-color)' }} />
                <span className="text-sm" style={{ color: 'var(--text-light-color)' }}>Click to upload or drag & drop</span>
                <span className="text-xs" style={{ color: 'var(--text-light-color)' }}>PDF, JPG, PNG — Max 10MB</span>
                <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleFile(doc.key, e)} />
              </label>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between pt-8">
        <Button type="button" variant="ghost" onClick={prevStep}><ArrowLeft size={18} /> Back</Button>
        <Button onClick={handleContinue} size="lg">Continue <ArrowRight size={18} /></Button>
      </div>
    </div>
  );
}
