import { useForm, useFieldArray } from 'react-hook-form';
import useApplicationStore from '../../../store/useApplicationStore';
import Button from '../../shared/Button';
import { ArrowRight, ArrowLeft, Plus, Trash2 } from 'lucide-react';

export default function Step3_EmploymentHistory() {
  const { employmentHistory, updateEmploymentHistory, nextStep, prevStep } = useApplicationStore();
  const { register, handleSubmit, control, watch } = useForm({ defaultValues: { employers: employmentHistory.employers, convicted: employmentHistory.convicted, convictedExplanation: employmentHistory.convictedExplanation, excludedMedicaid: employmentHistory.excludedMedicaid, excludedExplanation: employmentHistory.excludedExplanation, disciplined: employmentHistory.disciplined, disciplinedExplanation: employmentHistory.disciplinedExplanation } });
  const { fields, append, remove } = useFieldArray({ control, name: 'employers' });

  const convicted = watch('convicted');
  const excluded = watch('excludedMedicaid');
  const disciplined = watch('disciplined');

  const onSubmit = (data) => { updateEmploymentHistory(data); nextStep(); };

  const inputCls = 'w-full px-4 py-3 rounded-xl border text-sm outline-none';
  const inputStyle = { borderColor: 'var(--bg-alt)', background: 'var(--white)', color: 'var(--text-main)' };
  const labelCls = 'block text-sm font-medium mb-1.5';
  const labelStyle = { color: 'var(--text-main)' };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: 'var(--text-main)' }}>Employment History</h2>
        <p className="text-sm" style={{ color: 'var(--text-light-color)' }}>Please list your previous employers, starting with the most recent.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {fields.map((field, idx) => (
          <div key={field.id} className="p-6 rounded-2xl space-y-4" style={{ background: 'var(--bg-alt)' }}>
            <div className="flex items-center justify-between">
              <h4 className="font-bold" style={{ color: 'var(--text-main)' }}>Employer {idx + 1}</h4>
              {fields.length > 1 && (
                <button type="button" onClick={() => remove(idx)} className="text-red-400 hover:text-red-600 p-1"><Trash2 size={18} /></button>
              )}
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls} style={labelStyle}>Employer Name</label>
                <input {...register(`employers.${idx}.name`)} className={inputCls} style={inputStyle} />
              </div>
              <div>
                <label className={labelCls} style={labelStyle}>May we contact?</label>
                <div className="flex gap-4 pt-2">
                  {['Yes', 'No'].map(v => (
                    <label key={v} className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text-main)' }}>
                      <input {...register(`employers.${idx}.mayContact`)} type="radio" value={v} className="accent-[var(--primary)]" /> {v}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div><label className={labelCls} style={labelStyle}>City</label><input {...register(`employers.${idx}.city`)} className={inputCls} style={inputStyle} /></div>
              <div><label className={labelCls} style={labelStyle}>State</label><input {...register(`employers.${idx}.state`)} className={inputCls} style={inputStyle} /></div>
              <div><label className={labelCls} style={labelStyle}>ZIP</label><input {...register(`employers.${idx}.zip`)} className={inputCls} style={inputStyle} /></div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className={labelCls} style={labelStyle}>Your Title</label><input {...register(`employers.${idx}.title`)} className={inputCls} style={inputStyle} /></div>
              <div><label className={labelCls} style={labelStyle}>Supervisor Name</label><input {...register(`employers.${idx}.supervisor`)} className={inputCls} style={inputStyle} /></div>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div><label className={labelCls} style={labelStyle}>Supervisor's Title</label><input {...register(`employers.${idx}.supervisorTitle`)} className={inputCls} style={inputStyle} /></div>
              <div><label className={labelCls} style={labelStyle}>From</label><input {...register(`employers.${idx}.dateFrom`)} type="date" className={inputCls} style={inputStyle} /></div>
              <div><label className={labelCls} style={labelStyle}>To</label><input {...register(`employers.${idx}.dateTo`)} type="date" className={inputCls} style={inputStyle} /></div>
            </div>
            <div><label className={labelCls} style={labelStyle}>Contact Number</label><input {...register(`employers.${idx}.phone`)} type="tel" className={inputCls} style={inputStyle} /></div>
            <div><label className={labelCls} style={labelStyle}>Work Performed</label><textarea {...register(`employers.${idx}.workPerformed`)} rows={3} className={inputCls} style={inputStyle} /></div>
            <div><label className={labelCls} style={labelStyle}>Reason for Leaving</label><textarea {...register(`employers.${idx}.reasonLeaving`)} rows={2} className={inputCls} style={inputStyle} /></div>
          </div>
        ))}

        {fields.length < 3 && (
          <button type="button" onClick={() => append({ name: '', mayContact: '', city: '', state: '', zip: '', title: '', supervisor: '', supervisorTitle: '', dateFrom: '', dateTo: '', phone: '', workPerformed: '', reasonLeaving: '' })}
            className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl" style={{ color: 'var(--primary)', background: 'var(--accent-light)' }}>
            <Plus size={16} /> Add Another Employer
          </button>
        )}

        <div className="space-y-4 p-6 rounded-2xl" style={{ background: 'var(--bg-alt)' }}>
          <h4 className="font-bold" style={{ color: 'var(--text-main)' }}>Background Questions</h4>
          {[
            { field: 'convicted', explain: 'convictedExplanation', q: 'Have you been convicted of a crime?', val: convicted },
            { field: 'excludedMedicaid', explain: 'excludedExplanation', q: 'Have you been excluded from Medicare/Medicaid?', val: excluded },
            { field: 'disciplined', explain: 'disciplinedExplanation', q: 'Have you been disciplined by a professional/licensing board?', val: disciplined },
          ].map(({ field, explain, q, val }) => (
            <div key={field}>
              <label className={labelCls} style={labelStyle}>{q}</label>
              <div className="flex gap-4">
                {['Yes', 'No'].map(v => (
                  <label key={v} className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text-main)' }}>
                    <input {...register(field)} type="radio" value={v} className="accent-[var(--primary)]" /> {v}
                  </label>
                ))}
              </div>
              {val === 'Yes' && (
                <textarea {...register(explain)} rows={2} className={`${inputCls} mt-2`} style={inputStyle} placeholder="Please explain..." />
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-between pt-6">
          <Button type="button" variant="ghost" onClick={prevStep}><ArrowLeft size={18} /> Back</Button>
          <Button type="submit" size="lg">Continue <ArrowRight size={18} /></Button>
        </div>
      </form>
    </div>
  );
}
