import { useForm, useFieldArray } from 'react-hook-form';
import useApplicationStore from '../../../store/useApplicationStore';
import { US_STATES } from '../../../utils/constants';
import Button from '../../shared/Button';
import { ArrowRight, ArrowLeft, Plus, Trash2 } from 'lucide-react';

export default function Step4_Education() {
  const { education, updateEducation, nextStep, prevStep } = useApplicationStore();
  const { register, handleSubmit, control } = useForm({ defaultValues: { education } });
  const { fields, append, remove } = useFieldArray({ control, name: 'education' });

  const onSubmit = (data) => { updateEducation(data.education); nextStep(); };

  const inputCls = 'w-full px-4 py-3 rounded-xl border text-sm outline-none';
  const inputStyle = { borderColor: 'var(--bg-alt)', background: 'var(--white)', color: 'var(--text-main)' };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: 'var(--text-main)' }}>Education Background</h2>
        <p className="text-sm" style={{ color: 'var(--text-light-color)' }}>List your educational history.</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {fields.map((field, idx) => (
          <div key={field.id} className="p-6 rounded-2xl space-y-4" style={{ background: 'var(--bg-alt)' }}>
            <div className="flex items-center justify-between">
              <h4 className="font-bold" style={{ color: 'var(--text-main)' }}>Education {idx + 1}</h4>
              {fields.length > 1 && <button type="button" onClick={() => remove(idx)} className="text-red-400 hover:text-red-600 p-1"><Trash2 size={18} /></button>}
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-main)' }}>Education Level</label>
                <select {...register(`education.${idx}.level`)} className={inputCls} style={inputStyle}>
                  <option value="">Select...</option>
                  {['High School', 'College', 'University', 'Nursing School', 'Trade School', 'Other'].map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-main)' }}>School Name & Location</label>
                <input {...register(`education.${idx}.schoolName`)} className={inputCls} style={inputStyle} placeholder="School name, City" />
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-main)' }}>Years Attended</label>
                <input {...register(`education.${idx}.yearsAttended`)} className={inputCls} style={inputStyle} placeholder="e.g., 2018-2022" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-main)' }}>State</label>
                <select {...register(`education.${idx}.state`)} className={inputCls} style={inputStyle}>
                  <option value="">Select...</option>
                  {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-main)' }}>License/Degree #</label>
                <input {...register(`education.${idx}.degreeNumber`)} className={inputCls} style={inputStyle} />
              </div>
            </div>
          </div>
        ))}
        {fields.length < 5 && (
          <button type="button" onClick={() => append({ level: '', schoolName: '', yearsAttended: '', state: '', degreeNumber: '' })}
            className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl" style={{ color: 'var(--primary)', background: 'var(--accent-light)' }}>
            <Plus size={16} /> Add Another
          </button>
        )}
        <div className="flex justify-between pt-6">
          <Button type="button" variant="ghost" onClick={prevStep}><ArrowLeft size={18} /> Back</Button>
          <Button type="submit" size="lg">Continue <ArrowRight size={18} /></Button>
        </div>
      </form>
    </div>
  );
}
