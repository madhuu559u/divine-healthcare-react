import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import useApplicationStore from '../../../store/useApplicationStore';
import { US_STATES } from '../../../utils/constants';
import Button from '../../shared/Button';
import { ArrowRight } from 'lucide-react';

const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required'),
  preferredName: z.string().optional(),
  dob: z.string().min(1, 'Date of birth is required'),
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zip: z.string().min(5, 'Valid ZIP is required'),
  gender: z.string().min(1, 'Please select'),
  homePhone: z.string().optional(),
  cellPhone: z.string().min(10, 'Cell phone is required'),
  email: z.string().email('Valid email is required'),
  isOver18: z.string().min(1, 'Required'),
  isCitizen: z.string().min(1, 'Required'),
  isEligible: z.string().optional(),
  hearAboutUs: z.string().min(1, 'Please select'),
});

export default function Step1_PersonalInfo() {
  const { personalInfo, updatePersonalInfo, nextStep } = useApplicationStore();
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: personalInfo,
  });

  const isCitizen = watch('isCitizen');

  const onSubmit = (data) => {
    updatePersonalInfo(data);
    nextStep();
  };

  const inputCls = 'w-full px-4 py-3 rounded-xl border text-sm outline-none';
  const inputStyle = { borderColor: 'var(--bg-alt)', background: 'var(--white)', color: 'var(--text-main)' };
  const labelCls = 'block text-sm font-medium mb-1.5';
  const labelStyle = { color: 'var(--text-main)' };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: 'var(--text-main)' }}>Personal Information</h2>
        <p className="text-sm" style={{ color: 'var(--text-light-color)' }}>Let's start with your basic information.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className={labelCls} style={labelStyle}>First Name *</label>
            <input {...register('firstName')} className={inputCls} style={inputStyle} placeholder="First name" />
            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
          </div>
          <div>
            <label className={labelCls} style={labelStyle}>Middle Name</label>
            <input {...register('middleName')} className={inputCls} style={inputStyle} placeholder="Middle name" />
          </div>
          <div>
            <label className={labelCls} style={labelStyle}>Last Name *</label>
            <input {...register('lastName')} className={inputCls} style={inputStyle} placeholder="Last name" />
            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls} style={labelStyle}>Preferred Name</label>
            <input {...register('preferredName')} className={inputCls} style={inputStyle} placeholder="What should we call you?" />
          </div>
          <div>
            <label className={labelCls} style={labelStyle}>Date of Birth *</label>
            <input {...register('dob')} type="date" className={inputCls} style={inputStyle} />
            {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob.message}</p>}
          </div>
        </div>

        <div>
          <label className={labelCls} style={labelStyle}>Street Address *</label>
          <input {...register('street')} className={inputCls} style={inputStyle} placeholder="123 Main St" />
          {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street.message}</p>}
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className={labelCls} style={labelStyle}>City *</label>
            <input {...register('city')} className={inputCls} style={inputStyle} placeholder="City" />
            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
          </div>
          <div>
            <label className={labelCls} style={labelStyle}>State *</label>
            <select {...register('state')} className={inputCls} style={inputStyle}>
              <option value="">Select state</option>
              {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
          </div>
          <div>
            <label className={labelCls} style={labelStyle}>ZIP Code *</label>
            <input {...register('zip')} className={inputCls} style={inputStyle} placeholder="22193" />
            {errors.zip && <p className="text-red-500 text-xs mt-1">{errors.zip.message}</p>}
          </div>
        </div>

        <div>
          <label className={labelCls} style={labelStyle}>Gender *</label>
          <div className="flex gap-4">
            {['Male', 'Female', 'Prefer not to say'].map(g => (
              <label key={g} className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text-main)' }}>
                <input {...register('gender')} type="radio" value={g} className="accent-[var(--primary)]" /> {g}
              </label>
            ))}
          </div>
          {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>}
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className={labelCls} style={labelStyle}>Home Phone</label>
            <input {...register('homePhone')} type="tel" className={inputCls} style={inputStyle} placeholder="(703) 555-0123" />
          </div>
          <div>
            <label className={labelCls} style={labelStyle}>Cell Phone *</label>
            <input {...register('cellPhone')} type="tel" className={inputCls} style={inputStyle} placeholder="(703) 555-0123" />
            {errors.cellPhone && <p className="text-red-500 text-xs mt-1">{errors.cellPhone.message}</p>}
          </div>
          <div>
            <label className={labelCls} style={labelStyle}>Email *</label>
            <input {...register('email')} type="email" className={inputCls} style={inputStyle} placeholder="you@email.com" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className={labelCls} style={labelStyle}>Are you 18 or older? *</label>
            <div className="flex gap-4">
              {['Yes', 'No'].map(v => (
                <label key={v} className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text-main)' }}>
                  <input {...register('isOver18')} type="radio" value={v} className="accent-[var(--primary)]" /> {v}
                </label>
              ))}
            </div>
            {errors.isOver18 && <p className="text-red-500 text-xs mt-1">{errors.isOver18.message}</p>}
          </div>
          <div>
            <label className={labelCls} style={labelStyle}>Are you a U.S. Citizen? *</label>
            <div className="flex gap-4">
              {['Yes', 'No'].map(v => (
                <label key={v} className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text-main)' }}>
                  <input {...register('isCitizen')} type="radio" value={v} className="accent-[var(--primary)]" /> {v}
                </label>
              ))}
            </div>
            {errors.isCitizen && <p className="text-red-500 text-xs mt-1">{errors.isCitizen.message}</p>}
          </div>
        </div>

        {isCitizen === 'No' && (
          <div>
            <label className={labelCls} style={labelStyle}>Are you legally eligible for employment in the U.S.? *</label>
            <div className="flex gap-4">
              {['Yes', 'No'].map(v => (
                <label key={v} className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text-main)' }}>
                  <input {...register('isEligible')} type="radio" value={v} className="accent-[var(--primary)]" /> {v}
                </label>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className={labelCls} style={labelStyle}>How did you hear about us? *</label>
          <select {...register('hearAboutUs')} className={inputCls} style={inputStyle}>
            <option value="">Select...</option>
            {['Indeed', 'Website', 'Referral', 'Social Media', 'Job Fair', 'Other'].map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          {errors.hearAboutUs && <p className="text-red-500 text-xs mt-1">{errors.hearAboutUs.message}</p>}
        </div>

        <div className="flex justify-end pt-6">
          <Button type="submit" size="lg">Continue <ArrowRight size={18} /></Button>
        </div>
      </form>
    </div>
  );
}
