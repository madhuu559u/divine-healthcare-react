import { useForm, useFieldArray } from 'react-hook-form';
import { useState } from 'react';
import useApplicationStore from '../../../store/useApplicationStore';
import { US_STATES } from '../../../utils/constants';
import Button from '../../shared/Button';
import { ArrowRight, ArrowLeft, Plus, Trash2 } from 'lucide-react';

const skills = [
  'Communication', 'Observation, reporting and documentation', 'Temperature, pulse and respiration',
  'Universal Precautions', 'Body functions and changes reporting', 'Clean, safe and healthy environment',
  'Emergency situation recognition', 'Physical and emotional needs, privacy', 'Personal hygiene and grooming',
  'Toileting and elimination', 'Safe transfer techniques', 'Safe Ambulation',
  'Equipment use (Wheelchair, lift, walker, cane)', 'Proper body alignment positioning',
  'Feeding assistance (Aspiration Precautions)', 'Adequate nutrition and intake',
  'Medication Reminders', 'Infection Control (Handwashing, gloves)', 'Patient Care Documentation',
  'Reportable events to RN'
];

const ratings = [
  { value: 'A', label: 'Can perform well', color: 'var(--primary)' },
  { value: 'B', label: 'Need to review', color: 'var(--accent)' },
  { value: 'C', label: 'No experience', color: 'var(--text-light-color)' },
];

export default function Step5_Licenses() {
  const { licenses, skillsAssessment, updateLicenses, updateSkillsAssessment, nextStep, prevStep } = useApplicationStore();
  const { register, handleSubmit, control } = useForm({ defaultValues: { licenses } });
  const { fields, append, remove } = useFieldArray({ control, name: 'licenses' });
  const [localSkills, setLocalSkills] = useState(skillsAssessment);

  const onSubmit = (data) => {
    updateLicenses(data.licenses);
    updateSkillsAssessment(localSkills);
    nextStep();
  };

  const inputCls = 'w-full px-4 py-3 rounded-xl border text-sm outline-none';
  const inputStyle = { borderColor: 'var(--bg-alt)', background: 'var(--white)', color: 'var(--text-main)' };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: 'var(--text-main)' }}>Licenses & Skills</h2>
        <p className="text-sm" style={{ color: 'var(--text-light-color)' }}>Your certifications and skills self-assessment.</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <h3 className="text-lg font-bold" style={{ color: 'var(--text-main)' }}>Nursing Licenses & Certifications</h3>
          {fields.map((field, idx) => (
            <div key={field.id} className="grid grid-cols-12 gap-3 items-end p-4 rounded-xl" style={{ background: 'var(--bg-alt)' }}>
              <div className="col-span-3">
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-main)' }}>Type</label>
                <select {...register(`licenses.${idx}.type`)} className={inputCls} style={inputStyle}>
                  <option value="">Select...</option>
                  {['CNA', 'GNA', 'CMT', 'LPN', 'RN', 'NP', 'CPR', 'First Aid', 'Other'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="col-span-3">
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-main)' }}>State</label>
                <select {...register(`licenses.${idx}.state`)} className={inputCls} style={inputStyle}>
                  <option value="">State</option>
                  {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-main)' }}>Exp. Year</label>
                <input {...register(`licenses.${idx}.expirationYear`)} className={inputCls} style={inputStyle} placeholder="2026" />
              </div>
              <div className="col-span-3">
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-main)' }}>License #</label>
                <input {...register(`licenses.${idx}.number`)} className={inputCls} style={inputStyle} />
              </div>
              <div className="col-span-1">
                {fields.length > 1 && <button type="button" onClick={() => remove(idx)} className="text-red-400 hover:text-red-600 p-2"><Trash2 size={16} /></button>}
              </div>
            </div>
          ))}
          {fields.length < 5 && (
            <button type="button" onClick={() => append({ type: '', state: '', expirationYear: '', number: '' })}
              className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl" style={{ color: 'var(--primary)', background: 'var(--accent-light)' }}>
              <Plus size={16} /> Add License
            </button>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold" style={{ color: 'var(--text-main)' }}>Skills Self-Assessment</h3>
          <div className="flex gap-4 mb-4 text-xs flex-wrap">
            {ratings.map(r => (
              <span key={r.value} className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full" style={{ background: r.color }} /> {r.value} = {r.label}
              </span>
            ))}
          </div>
          <div className="space-y-2">
            {skills.map(skill => (
              <div key={skill} className="flex items-center justify-between p-3 rounded-xl hover:shadow-sm transition-shadow" style={{ background: 'var(--bg-alt)' }}>
                <span className="text-sm flex-1 pr-4" style={{ color: 'var(--text-main)' }}>{skill}</span>
                <div className="flex gap-2 shrink-0">
                  {ratings.map(r => (
                    <button key={r.value} type="button"
                      onClick={() => setLocalSkills(prev => ({ ...prev, [skill]: r.value }))}
                      className="w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center transition-all"
                      style={{
                        background: localSkills[skill] === r.value ? r.color : 'var(--white)',
                        color: localSkills[skill] === r.value ? 'white' : 'var(--text-light-color)',
                        border: `2px solid ${localSkills[skill] === r.value ? r.color : 'var(--bg-alt)'}`
                      }}>
                      {r.value}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between pt-6">
          <Button type="button" variant="ghost" onClick={prevStep}><ArrowLeft size={18} /> Back</Button>
          <Button type="submit" size="lg">Continue <ArrowRight size={18} /></Button>
        </div>
      </form>
    </div>
  );
}
