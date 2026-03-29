import { useState } from 'react';
import useApplicationStore from '../../../store/useApplicationStore';
import Button from '../../shared/Button';
import { ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';

const agreements = [
  {
    key: 'backgroundCheck',
    sigKey: 'backgroundSignature',
    title: 'Pre-Employment Background Check Authorization',
    text: 'I understand that as part of the employment process, Divine Healthcare Services LLC needs to complete a background check on me regarding: Criminal record, Sex and Violent Offenders Record, Employment Verification, Education Verification, License Verification, Motor Vehicle Records, Personal/Professional Reference Verification, Medical Suitability, Drugs/Alcohol screening. I hereby authorize Divine Healthcare Services LLC to conduct the above-described background investigation and to receive and use the information obtained. I release Divine Healthcare Services LLC and any person providing information from any and all liability arising from the investigation or the disclosure of the results thereof.',
    checkbox: 'I authorize this background check'
  },
  {
    key: 'confidentiality',
    sigKey: 'confidentialitySignature',
    title: 'Confidentiality & Non-Disclosure Agreement',
    text: 'As an employee of Divine Healthcare Services LLC, I understand that I may have access to confidential information regarding the Agency, its clients, and other employees. I agree to protect all confidential information and not disclose it to any unauthorized person or entity. This includes but is not limited to: patient health information (PHI), financial records, business strategies, employee records, and proprietary processes. I understand that violation of this agreement may result in disciplinary action, termination of employment, and/or legal action.',
    checkbox: 'I have read and agree to the Confidentiality & NDA'
  },
  {
    key: 'substanceAbuse',
    sigKey: 'substanceAbuseSignature',
    title: 'Substance Abuse Policy Acknowledgment',
    text: 'Divine Healthcare Services LLC maintains a drug-free workplace policy. Pre-employment drug testing is required for all positions. Random drug testing may be conducted during employment. The use, possession, distribution, or being under the influence of alcohol or illegal drugs while on company time, on company premises, or while conducting company business is strictly prohibited. Employees taking prescription medications that may affect job performance must notify their supervisor. Violation of this policy will result in immediate disciplinary action, up to and including termination.',
    checkbox: 'I have read and understand the Substance Abuse Policy'
  },
  {
    key: 'certification',
    sigKey: 'certificationSignature',
    title: 'Employment Certification',
    text: 'I certify that all information I have provided in this application is true, complete, and correct to the best of my knowledge. I understand that any misrepresentation, falsification, or material omission of information may result in my failure to receive an offer, or if I am hired, my dismissal from employment. I authorize Divine Healthcare Services LLC to verify any and all information provided and to contact any references listed.',
    checkbox: 'I certify all information is true and correct'
  },
  {
    key: 'atWill',
    sigKey: null,
    title: 'At-Will Employment Acknowledgment',
    text: 'I understand that employment with Divine Healthcare Services LLC is at-will, meaning either I or the company may terminate the employment relationship at any time, with or without cause or notice. No supervisor, manager, or representative of the company has the authority to make any agreement contrary to the foregoing, except in writing signed by an authorized company officer.',
    checkbox: 'I acknowledge and agree'
  },
];

export default function Step8_Agreements() {
  const { agreements: savedAgreements, updateAgreements, nextStep, prevStep } = useApplicationStore();
  const [local, setLocal] = useState(savedAgreements);

  const allSigned = agreements.every(a => {
    if (!local[a.key]) return false;
    if (a.sigKey && !local[a.sigKey]) return false;
    return true;
  });

  const handleContinue = () => {
    if (!allSigned) return;
    updateAgreements(local);
    nextStep();
  };

  const inputCls = 'w-full px-4 py-3 rounded-xl border text-sm outline-none';
  const inputStyle = { borderColor: 'var(--bg-alt)', background: 'var(--white)', color: 'var(--text-main)' };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: 'var(--text-main)' }}>Agreements & Acknowledgments</h2>
        <p className="text-sm" style={{ color: 'var(--text-light-color)' }}>Please read each agreement carefully and sign.</p>
      </div>

      <div className="space-y-6">
        {agreements.map(a => (
          <div key={a.key} className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-alt)' }}>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle size={18} style={{ color: local[a.key] ? 'var(--primary)' : 'var(--text-light-color)' }} />
                <h4 className="font-bold" style={{ color: 'var(--text-main)' }}>{a.title}</h4>
              </div>
              <div className="max-h-32 overflow-y-auto p-4 rounded-xl text-xs leading-relaxed mb-4" style={{ background: 'var(--white)', color: 'var(--text-light-color)' }}>
                {a.text}
              </div>
              <label className="flex items-start gap-3 cursor-pointer mb-3">
                <input type="checkbox" checked={!!local[a.key]}
                  onChange={(e) => setLocal(prev => ({ ...prev, [a.key]: e.target.checked }))}
                  className="mt-0.5 accent-[var(--primary)]" />
                <span className="text-sm font-medium" style={{ color: 'var(--text-main)' }}>{a.checkbox}</span>
              </label>
              {a.sigKey && (
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-light-color)' }}>Typed Signature (Full Legal Name)</label>
                  <input value={local[a.sigKey] || ''} onChange={(e) => setLocal(prev => ({ ...prev, [a.sigKey]: e.target.value }))}
                    className={inputCls} style={{ ...inputStyle, fontStyle: 'italic' }} placeholder="Type your full name as signature" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between pt-8">
        <Button type="button" variant="ghost" onClick={prevStep}><ArrowLeft size={18} /> Back</Button>
        <Button onClick={handleContinue} size="lg" disabled={!allSigned}>
          Review Application <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  );
}
