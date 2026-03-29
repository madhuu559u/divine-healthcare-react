import { Smartphone, MapPin, Clock, Shield } from 'lucide-react';
import SectionHeader from '../shared/SectionHeader';
import AnimatedSection from '../shared/AnimatedSection';
import Card from '../shared/Card';
import Button from '../shared/Button';
import { Phone as PhoneIcon } from 'lucide-react';
import { COMPANY } from '../../utils/constants';

const evvFeatures = [
  { icon: Smartphone, title: 'Electronic Check-in/out', desc: 'Caregivers check in and out electronically at the start and end of each visit.' },
  { icon: MapPin, title: 'Location Verification', desc: 'GPS verification confirms caregivers are at the correct client location.' },
  { icon: Clock, title: 'Real-Time Tracking', desc: 'Services are tracked in real-time for accurate documentation.' },
  { icon: Shield, title: 'Compliance Assured', desc: 'Meets federal 21st Century Cures Act requirements for Medicaid services.' },
];

const faq = [
  { q: 'Does Medicaid cover all home care services?', a: 'Medicaid covers many home care services through waiver programs. Eligibility depends on your specific needs, income, and the waiver program you qualify for.' },
  { q: 'How do I apply for Medicaid in Virginia?', a: 'You can apply through Virginia\'s CommonHelp online portal, by contacting your local Department of Social Services, or by calling the Cover Virginia Call Center.' },
  { q: 'Can I choose my own caregiver with Medicaid?', a: 'Yes, through the EDCD waiver program, you can self-direct your care and choose your own caregiver, including family members (with some restrictions).' },
  { q: 'How long does Medicaid approval take?', a: 'Processing times vary, but typically take 30-45 days for standard applications. Expedited processing may be available for urgent cases.' },
];

export default function EVVSection() {
  return (
    <>
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <SectionHeader badge="EVV" title="Electronic Visit Verification" subtitle="Ensuring transparency and accountability in every home visit." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {evvFeatures.map((f, i) => (
              <AnimatedSection key={f.title} delay={i * 0.1}>
                <Card className="text-center h-full">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: 'var(--accent-light)' }}>
                    <f.icon size={24} style={{ color: 'var(--primary)' }} />
                  </div>
                  <h3 className="font-bold mb-1 text-sm" style={{ color: 'var(--text-main)' }}>{f.title}</h3>
                  <p className="text-xs" style={{ color: 'var(--text-light-color)' }}>{f.desc}</p>
                </Card>
              </AnimatedSection>
            ))}
          </div>

          <SectionHeader badge="FAQ" title="Common Medicaid Questions" />
          <div className="max-w-3xl mx-auto space-y-4">
            {faq.map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="p-5 rounded-2xl" style={{ background: 'var(--bg-alt)' }}>
                  <h4 className="font-bold mb-2" style={{ color: 'var(--text-main)' }}>{item.q}</h4>
                  <p className="text-sm" style={{ color: 'var(--text-light-color)' }}>{item.a}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4" style={{ background: 'var(--primary)' }}>
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Need Help Navigating Medicaid?</h2>
          <p className="text-lg opacity-90 mb-8">Our team can help you understand your benefits and get started with home care services.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button to="/contact" variant="accent" size="lg">Schedule a Consultation</Button>
            <a href={`tel:${COMPANY.phone}`} className="inline-flex items-center gap-2 px-7 py-4 rounded-full text-lg font-semibold text-white border-2 border-white/30 hover:bg-white/10 transition-all">
              <PhoneIcon size={20} /> {COMPANY.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
