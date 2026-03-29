import { useForm } from 'react-hook-form';
import useApplicationStore from '../../../store/useApplicationStore';
import Button from '../../shared/Button';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export default function Step2_Employment() {
  const { employmentDesired, updateEmploymentDesired, nextStep, prevStep } = useApplicationStore();
  const { register, handleSubmit, watch, formState: { errors } } = useForm({ defaultValues: employmentDesired });

  const prevEmployed = watch('previouslyEmployed');

  const onSubmit = (data) => {
    updateEmploymentDesired(data);
    nextStep();
  };

  const inputCls = 'w-full px-4 py-3 rounded-xl border text-sm outline-none';
  const inputStyle = { borderColor: 'var(--bg-alt)', background: 'var(--white)', color: 'var(--text-main)' };
  const labelCls = 'block text-sm font-medium mb-1.5';
  const labelStyle = { color: 'var(--text-main)' };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: 'var(--text-main)' }}>Employment Desired</h2>
        <p className="text-sm" style={{ color: 'var(--text-light-color)' }}>Tell us about the position you're interested in.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls} style={labelStyle}>Position Applying For *</label>
            <select {...register('position', { required: 'Required' })} className={inputCls} style={inputStyle}>
              <option value="">Select position</option>
              {['CNA', 'GNA', 'CMT', 'HHA', 'PCA', 'LPN', 'RN', 'NP', 'Other'].map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            {errors.position && <p className="text-red-500 text-xs mt-1">{errors.position.message}</p>}
          </div>
          <div>
            <label className={labelCls} style={labelStyle}>Date You Can Start *</label>
            <input {...register('startDate', { required: 'Required' })} type="date" className={inputCls} style={inputStyle} />
            {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate.message}</p>}
          </div>
        </div>

        <div>
          <label className={labelCls} style={labelStyle}>Desired Pay Rate</label>
          <input {...register('desiredPay')} className={inputCls} style={inputStyle} placeholder="e.g., $18/hr" />
        </div>

        <div>
          <label className={labelCls} style={labelStyle}>Type of Employment *</label>
          <div className="flex flex-wrap gap-4">
            {['Full-Time', 'Part-Time', 'PRN'].map(t => (
              <label key={t} className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text-main)' }}>
                <input {...register('employmentType')} type="checkbox" value={t} className="accent-[var(--primary)]" /> {t}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className={labelCls} style={labelStyle}>Preferred Shift *</label>
          <div className="flex flex-wrap gap-4">
            {['Day', 'Evening', 'Nights'].map(s => (
              <label key={s} className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text-main)' }}>
                <input {...register('preferredShift')} type="checkbox" value={s} className="accent-[var(--primary)]" /> {s}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className={labelCls} style={labelStyle}>Were you previously employed by Divine Healthcare?</label>
          <div className="flex gap-4">
            {['Yes', 'No'].map(v => (
              <label key={v} className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text-main)' }}>
                <input {...register('previouslyEmployed')} type="radio" value={v} className="accent-[var(--primary)]" /> {v}
              </label>
            ))}
          </div>
        </div>

        {prevEmployed === 'Yes' && (
          <div>
            <label className={labelCls} style={labelStyle}>When?</label>
            <input {...register('previousDates')} className={inputCls} style={inputStyle} placeholder="e.g., Jan 2020 - Mar 2021" />
          </div>
        )}

        <div className="flex justify-between pt-6">
          <Button type="button" variant="ghost" onClick={prevStep}><ArrowLeft size={18} /> Back</Button>
          <Button type="submit" size="lg">Continue <ArrowRight size={18} /></Button>
        </div>
      </form>
    </div>
  );
}
