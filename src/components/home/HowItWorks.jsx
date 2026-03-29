import { Phone, ClipboardList, UserCheck, HeartPulse } from 'lucide-react';
import SectionHeader from '../shared/SectionHeader';
import AnimatedSection from '../shared/AnimatedSection';

const steps = [
  { icon: Phone, title: 'Quick Call', desc: 'Contact us for a free consultation' },
  { icon: ClipboardList, title: 'Personalized Plan', desc: 'We create a custom care plan' },
  { icon: UserCheck, title: 'Caregiver Match', desc: 'Matched with the right caregiver' },
  { icon: HeartPulse, title: 'Ongoing Support', desc: 'Continuous care and monitoring' },
];

export default function HowItWorks() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <SectionHeader badge="Our Process" title="Your Care Journey" subtitle="Getting started with Divine Healthcare is simple and stress-free." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <AnimatedSection key={step.title} delay={i * 0.15} className="text-center relative">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white relative z-10"
                style={{ background: 'var(--primary)' }}>
                <step.icon size={28} />
              </div>
              <div className="absolute top-8 left-1/2 w-full h-0.5 hidden lg:block" style={{ background: 'var(--accent-light)' }} />
              <span className="text-xs font-bold mb-2 block" style={{ color: 'var(--primary)' }}>Step {i + 1}</span>
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-main)' }}>{step.title}</h3>
              <p className="text-sm" style={{ color: 'var(--text-light-color)' }}>{step.desc}</p>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
