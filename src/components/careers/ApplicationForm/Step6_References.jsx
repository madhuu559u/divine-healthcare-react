import { useForm } from 'react-hook-form';
import useApplicationStore from '../../../store/useApplicationStore';
import Button from '../../shared/Button';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export default function Step6_References() {
  const { references, updateReferences, nextStep, prevStep, personalInfo } = useApplicationStore();
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: { references } });

  const onSubmit = (data) => { updateReferences(data.references); nextStep(); };

  const inputCls = 'w-full px-4 py-3 rounded-xl border text-sm outline-none';
  const inputStyle = { borderColor: 'var(--bg-alt)', background: 'var(--white)', color: 'var(--text-main)' };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: 'var(--text-main)' }}>References</h2>
        <p className="text-sm" style={{ color: 'var(--text-light-color)' }}>Please provide 2 professional references.</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {[0, 1].map(idx => (
          <div key={idx} className="p-6 rounded-2xl space-y-4" style={{ background: 'var(--bg-alt)' }}>
            <h4 className="font-bold" style={{ color: 'var(--text-main)' }}>Reference {idx + 1}</h4>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-main)' }}>Applicant Name</label>
              <input value={`${personalInfo.firstName} ${personalInfo.lastName}`} readOnly className={`${inputCls} opacity-60`} style={inputStyle} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-main)' }}>Name of Reference *</label>
              <input {...register(`references.${idx}.name`, { required: 'Required' })} className={inputCls} style={inputStyle} placeholder="Full name" />
              {errors.references?.[idx]?.name && <p className="text-red-500 text-xs mt-1">{errors.references[idx].name.message}</p>}
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-main)' }}>Daytime Phone *</label>
                <input {...register(`references.${idx}.phone`, { required: 'Required' })} type="tel" className={inputCls} style={inputStyle} />
                {errors.references?.[idx]?.phone && <p className="text-red-500 text-xs mt-1">{errors.references[idx].phone.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-main)' }}>Best Time to Contact</label>
                <input {...register(`references.${idx}.bestTime`)} className={inputCls} style={inputStyle} placeholder="e.g., Mornings 9-12" />
              </div>
            </div>
          </div>
        ))}
        <div className="flex justify-between pt-6">
          <Button type="button" variant="ghost" onClick={prevStep}><ArrowLeft size={18} /> Back</Button>
          <Button type="submit" size="lg">Continue <ArrowRight size={18} /></Button>
        </div>
      </form>
    </div>
  );
}
