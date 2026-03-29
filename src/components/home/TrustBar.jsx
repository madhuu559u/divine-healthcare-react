import { Award, Shield, Users, MapPin, CreditCard } from 'lucide-react';
import AnimatedSection from '../shared/AnimatedSection';

const items = [
  { icon: Award, label: '10+ Years', sub: 'Experience' },
  { icon: Shield, label: 'Licensed &', sub: 'Insured' },
  { icon: Users, label: 'Certified', sub: 'Caregivers' },
  { icon: MapPin, label: 'Statewide', sub: 'Coverage' },
  { icon: CreditCard, label: 'Medicaid', sub: 'Accepted' },
];

export default function TrustBar() {
  return (
    <AnimatedSection className="py-8 px-4" style={{ background: 'var(--bg-alt)' }}>
      <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-6 md:gap-12">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-3 text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'var(--primary)', color: 'var(--white)' }}>
              <item.icon size={22} />
            </div>
            <div>
              <span className="font-bold text-sm block" style={{ color: 'var(--text-main)' }}>{item.label}</span>
              <span className="text-xs" style={{ color: 'var(--text-light-color)' }}>{item.sub}</span>
            </div>
          </div>
        ))}
      </div>
    </AnimatedSection>
  );
}
