import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Send, Phone, Printer, Building2, UserCheck, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import SectionHeader from '../shared/SectionHeader';
import AnimatedSection from '../shared/AnimatedSection';
import Button from '../shared/Button';
import Card from '../shared/Card';
import { COMPANY } from '../../utils/constants';
import { supabase } from '../../lib/supabase';

const schema = z.object({
  referrerName: z.string().min(2, 'Name is required'),
  referrerOrg: z.string().min(2, 'Organization is required'),
  referrerTitle: z.string().optional(),
  referrerPhone: z.string().min(10, 'Phone is required'),
  referrerEmail: z.string().email('Valid email is required'),
  referrerFax: z.string().optional(),
  patientName: z.string().min(2, 'Patient name is required'),
  patientDob: z.string().min(1, 'Date of birth is required'),
  patientAddress: z.string().min(5, 'Address is required'),
  patientPhone: z.string().min(10, 'Phone is required'),
  insuranceType: z.string().min(1, 'Insurance type is required'),
  medicaidId: z.string().optional(),
  serviceRequested: z.string().min(1, 'Service is required'),
  startDate: z.string().optional(),
  urgency: z.string().min(1, 'Urgency is required'),
  clinicalNotes: z.string().optional(),
  preferredSchedule: z.string().optional(),
});

const whoCanRefer = [
  { icon: Building2, title: 'Hospitals', desc: 'Discharge planners and case managers' },
  { icon: UserCheck, title: 'Physicians', desc: 'Primary care and specialists' },
  { icon: FileText, title: 'Case Managers', desc: 'Social workers and coordinators' },
  { icon: UserCheck, title: 'Families', desc: 'Family members and advocates' },
];

const steps = [
  'Submit the referral form below or call us directly',
  'Our intake team reviews and processes within 24 hours',
  'We coordinate with the patient and referral source to begin care',
];

export default function ReferralForm() {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    try {
      const { error } = await supabase.from('referrals').insert({
        referrer_name: data.referrerName,
        referrer_org: data.referrerOrg,
        referrer_title: data.referrerTitle || null,
        referrer_phone: data.referrerPhone,
        referrer_email: data.referrerEmail,
        referrer_fax: data.referrerFax || null,
        patient_name: data.patientName,
        patient_dob: data.patientDob,
        patient_address: data.patientAddress,
        patient_phone: data.patientPhone,
        insurance_type: data.insuranceType,
        medicaid_id: data.medicaidId || null,
        service_requested: data.serviceRequested,
        start_date: data.startDate || null,
        urgency: data.urgency,
        clinical_notes: data.clinicalNotes || null,
        preferred_schedule: data.preferredSchedule || null,
      });
      if (error) throw error;
      toast.success('Referral submitted successfully!');
      setSubmitted(true);
      reset();
    } catch (err) {
      console.error('Referral submission error:', err);
      toast.error('Something went wrong. Please try again or call us directly.');
    }
  };

  const inputCls = 'w-full px-4 py-3 rounded-xl border text-sm outline-none';
  const inputStyle = { borderColor: 'var(--bg-alt)', background: 'var(--white)', color: 'var(--text-main)' };
  const labelCls = 'block text-sm font-medium mb-1.5';
  const labelStyle = { color: 'var(--text-main)' };

  return (
    <>
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <SectionHeader badge="Who Can Refer" title="We Accept Referrals From" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {whoCanRefer.map((item, i) => (
              <AnimatedSection key={item.title} delay={i * 0.1}>
                <Card className="text-center h-full">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: 'var(--accent-light)' }}>
                    <item.icon size={24} style={{ color: 'var(--primary)' }} />
                  </div>
                  <h3 className="font-bold mb-1" style={{ color: 'var(--text-main)' }}>{item.title}</h3>
                  <p className="text-sm" style={{ color: 'var(--text-light-color)' }}>{item.desc}</p>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4" style={{ background: 'var(--bg-alt)' }}>
        <div className="max-w-4xl mx-auto">
          <SectionHeader badge="Refer Now" title="Referral Form" subtitle="Complete the form below to refer a patient or client for home care services." />

          {submitted ? (
            <AnimatedSection className="text-center py-12 rounded-3xl" style={{ background: 'var(--white)' }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--primary)', color: 'var(--white)' }}><Send size={28} /></div>
              <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-main)' }}>Referral Submitted!</h3>
              <p style={{ color: 'var(--text-light-color)' }}>Our intake team will process this referral within 24 hours.</p>
              <button onClick={() => setSubmitted(false)} className="mt-4 text-sm underline" style={{ color: 'var(--primary)' }}>Submit another referral</button>
            </AnimatedSection>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 p-6 md:p-8 rounded-3xl" style={{ background: 'var(--white)' }}>
              <div>
                <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-main)' }}>Referrer Information</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className={labelCls} style={labelStyle}>Your Name *</label><input {...register('referrerName')} className={inputCls} style={inputStyle} />{errors.referrerName && <p className="text-red-500 text-xs mt-1">{errors.referrerName.message}</p>}</div>
                  <div><label className={labelCls} style={labelStyle}>Organization *</label><input {...register('referrerOrg')} className={inputCls} style={inputStyle} />{errors.referrerOrg && <p className="text-red-500 text-xs mt-1">{errors.referrerOrg.message}</p>}</div>
                  <div><label className={labelCls} style={labelStyle}>Title</label><input {...register('referrerTitle')} className={inputCls} style={inputStyle} /></div>
                  <div><label className={labelCls} style={labelStyle}>Phone *</label><input {...register('referrerPhone')} type="tel" className={inputCls} style={inputStyle} />{errors.referrerPhone && <p className="text-red-500 text-xs mt-1">{errors.referrerPhone.message}</p>}</div>
                  <div><label className={labelCls} style={labelStyle}>Email *</label><input {...register('referrerEmail')} type="email" className={inputCls} style={inputStyle} />{errors.referrerEmail && <p className="text-red-500 text-xs mt-1">{errors.referrerEmail.message}</p>}</div>
                  <div><label className={labelCls} style={labelStyle}>Fax</label><input {...register('referrerFax')} className={inputCls} style={inputStyle} /></div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-main)' }}>Patient Information</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className={labelCls} style={labelStyle}>Patient Name *</label><input {...register('patientName')} className={inputCls} style={inputStyle} />{errors.patientName && <p className="text-red-500 text-xs mt-1">{errors.patientName.message}</p>}</div>
                  <div><label className={labelCls} style={labelStyle}>Date of Birth *</label><input {...register('patientDob')} type="date" className={inputCls} style={inputStyle} />{errors.patientDob && <p className="text-red-500 text-xs mt-1">{errors.patientDob.message}</p>}</div>
                  <div className="sm:col-span-2"><label className={labelCls} style={labelStyle}>Address *</label><input {...register('patientAddress')} className={inputCls} style={inputStyle} />{errors.patientAddress && <p className="text-red-500 text-xs mt-1">{errors.patientAddress.message}</p>}</div>
                  <div><label className={labelCls} style={labelStyle}>Phone *</label><input {...register('patientPhone')} type="tel" className={inputCls} style={inputStyle} />{errors.patientPhone && <p className="text-red-500 text-xs mt-1">{errors.patientPhone.message}</p>}</div>
                  <div><label className={labelCls} style={labelStyle}>Insurance Type *</label>
                    <select {...register('insuranceType')} className={inputCls} style={inputStyle}><option value="">Select...</option><option value="medicaid">Medicaid</option><option value="medicare">Medicare</option><option value="private">Private Insurance</option><option value="self-pay">Self Pay</option><option value="other">Other</option></select>
                    {errors.insuranceType && <p className="text-red-500 text-xs mt-1">{errors.insuranceType.message}</p>}
                  </div>
                  <div><label className={labelCls} style={labelStyle}>Medicaid ID (if applicable)</label><input {...register('medicaidId')} className={inputCls} style={inputStyle} /></div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-main)' }}>Service Details</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className={labelCls} style={labelStyle}>Service Requested *</label>
                    <select {...register('serviceRequested')} className={inputCls} style={inputStyle}><option value="">Select...</option><option value="personal-care">Personal Care</option><option value="companionship">Companionship</option><option value="skilled-nursing">Skilled Nursing</option><option value="medication-management">Medication Management</option><option value="post-hospital">Post-Hospital Support</option><option value="other">Other</option></select>
                    {errors.serviceRequested && <p className="text-red-500 text-xs mt-1">{errors.serviceRequested.message}</p>}
                  </div>
                  <div><label className={labelCls} style={labelStyle}>Requested Start Date</label><input {...register('startDate')} type="date" className={inputCls} style={inputStyle} /></div>
                  <div><label className={labelCls} style={labelStyle}>Urgency *</label>
                    <div className="flex gap-4 pt-2">
                      {['Routine', 'Urgent'].map(v => (<label key={v} className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text-main)' }}><input {...register('urgency')} type="radio" value={v.toLowerCase()} className="accent-[var(--primary)]" /> {v}</label>))}
                    </div>
                    {errors.urgency && <p className="text-red-500 text-xs mt-1">{errors.urgency.message}</p>}
                  </div>
                  <div><label className={labelCls} style={labelStyle}>Preferred Schedule</label><input {...register('preferredSchedule')} className={inputCls} style={inputStyle} placeholder="e.g., M-F mornings" /></div>
                  <div className="sm:col-span-2"><label className={labelCls} style={labelStyle}>Clinical Notes / Special Instructions</label><textarea {...register('clinicalNotes')} rows={4} className={inputCls} style={inputStyle} /></div>
                </div>
              </div>

              <Button type="submit" loading={isSubmitting} size="lg" className="w-full sm:w-auto"><Send size={16} /> Submit Referral</Button>
            </form>
          )}
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <SectionHeader badge="Process" title="What Happens After Your Referral" />
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <AnimatedSection key={i} delay={i * 0.15} className="text-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold" style={{ background: 'var(--primary)' }}>{i + 1}</div>
                <p className="text-sm" style={{ color: 'var(--text-main)' }}>{step}</p>
              </AnimatedSection>
            ))}
          </div>
          <AnimatedSection className="mt-12 p-6 rounded-2xl text-center" style={{ background: 'var(--accent-light)' }}>
            <p className="font-bold mb-2" style={{ color: 'var(--primary-dark)' }}>For Urgent Referrals</p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <a href={`tel:${COMPANY.phone}`} className="flex items-center gap-2 font-semibold" style={{ color: 'var(--primary)' }}><Phone size={16} /> {COMPANY.phone}</a>
              <span className="flex items-center gap-2" style={{ color: 'var(--text-main)' }}><Printer size={16} /> Fax: {COMPANY.fax}</span>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
