import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Button from '../shared/Button';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  service: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    await new Promise((r) => setTimeout(r, 1000));
    toast.success('Message sent successfully! We\'ll be in touch soon.');
    setSubmitted(true);
    reset();
  };

  if (submitted) {
    return (
      <div className="text-center py-12 px-6 rounded-3xl" style={{ background: 'var(--accent-light)' }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--primary)', color: 'var(--white)' }}>
          <Send size={28} />
        </div>
        <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-main)' }}>Thank You!</h3>
        <p style={{ color: 'var(--text-light-color)' }}>Your message has been received. Our team will contact you within 24 hours.</p>
        <button onClick={() => setSubmitted(false)} className="mt-4 text-sm underline" style={{ color: 'var(--primary)' }}>Send another message</button>
      </div>
    );
  }

  const inputCls = 'w-full px-4 py-3 rounded-xl border text-sm outline-none';
  const inputStyle = { borderColor: 'var(--bg-alt)', background: 'var(--white)', color: 'var(--text-main)' };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-main)' }}>Full Name *</label>
        <input {...register('name')} className={inputCls} style={inputStyle} placeholder="Your full name" />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-main)' }}>Email *</label>
          <input {...register('email')} type="email" className={inputCls} style={inputStyle} placeholder="your@email.com" />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-main)' }}>Phone *</label>
          <input {...register('phone')} type="tel" className={inputCls} style={inputStyle} placeholder="(703) 555-0123" />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-main)' }}>Service of Interest</label>
        <select {...register('service')} className={inputCls} style={inputStyle}>
          <option value="">Select a service...</option>
          <option value="personal-care">Personal Care</option>
          <option value="companionship">Companionship</option>
          <option value="medication-reminders">Medication Reminders</option>
          <option value="post-hospital">Post-Hospital Support</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-main)' }}>Message *</label>
        <textarea {...register('message')} rows={5} className={inputCls} style={inputStyle} placeholder="How can we help you?" />
        {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
      </div>
      <Button type="submit" loading={isSubmitting} className="w-full sm:w-auto">
        <Send size={16} /> Send Message
      </Button>
    </form>
  );
}
