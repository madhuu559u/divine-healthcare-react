import { CheckCircle, AlertCircle } from 'lucide-react';
import { applicationRequirements } from '../../data/jobs';
import SectionHeader from '../shared/SectionHeader';
import AnimatedSection from '../shared/AnimatedSection';

const howToApply = [
  'Browse open positions',
  'Click "Apply Now" on your desired role',
  'Complete the online application (9 steps)',
  'Upload required documents',
  'Our team reviews within 48 hours',
  'Interview & onboarding'
];

export default function BenefitsSection() {
  return (
    <section className="py-20 px-4" style={{ background: 'var(--bg-alt)' }}>
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12">
        <AnimatedSection direction="left">
          <h3 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-main)' }}>Application Requirements</h3>
          <p className="text-sm mb-4" style={{ color: 'var(--text-light-color)' }}>Please have the following ready before starting your application:</p>
          <ul className="space-y-3">
            {applicationRequirements.map((req) => (
              <li key={req.text} className="flex items-start gap-3">
                <CheckCircle size={18} className="mt-0.5 shrink-0" style={{ color: req.required ? 'var(--primary)' : 'var(--text-light-color)' }} />
                <div>
                  <span className="text-sm" style={{ color: 'var(--text-main)' }}>{req.text}</span>
                  {req.note && <span className="text-xs ml-1 px-2 py-0.5 rounded-full" style={{ background: 'var(--accent-light)', color: 'var(--primary-dark)' }}>{req.note}</span>}
                  {!req.required && <span className="text-xs ml-1" style={{ color: 'var(--text-light-color)' }}>(Optional)</span>}
                </div>
              </li>
            ))}
          </ul>
        </AnimatedSection>

        <AnimatedSection direction="right">
          <h3 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-main)' }}>How to Apply</h3>
          <div className="space-y-6">
            {howToApply.map((step, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white text-sm font-bold"
                  style={{ background: 'var(--primary)' }}>{i + 1}</div>
                <div className="pt-2">
                  <span className="font-medium" style={{ color: 'var(--text-main)' }}>{step}</span>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
