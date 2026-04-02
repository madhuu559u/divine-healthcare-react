import { CheckCircle } from 'lucide-react';
import SectionHeader from '../shared/SectionHeader';
import AnimatedSection from '../shared/AnimatedSection';

const criteria = [
  'Virginia resident with valid Medicaid coverage',
  'Individuals requiring assistance with Activities of Daily Living (ADLs)',
  'Seniors aged 65+ meeting income and asset requirements',
  'Adults with physical or intellectual disabilities',
  'Individuals assessed as needing nursing facility level of care',
  'Those who can safely remain in the community with support services',
];

export default function EligibilityInfo() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <AnimatedSection direction="left">
          <SectionHeader badge="Eligibility" title="Who Qualifies for Medicaid Home Care?" center={false} />
          <p className="text-sm mb-6" style={{ color: 'var(--text-light-color)' }}>
            Virginia Medicaid provides coverage for home health care services to eligible individuals who need assistance but prefer to remain in their homes and communities.
          </p>
          <ul className="space-y-3">
            {criteria.map(c => (
              <li key={c} className="flex items-start gap-3">
                <CheckCircle size={18} className="mt-0.5 shrink-0" style={{ color: 'var(--primary)' }} />
                <span className="text-sm" style={{ color: 'var(--text-main)' }}>{c}</span>
              </li>
            ))}
          </ul>
        </AnimatedSection>
        <AnimatedSection direction="right">
          <img src="https://img1.wsimg.com/isteam/ip/2b5573a4-2ac2-4b6d-b528-244db817d67f/Home-Solutions_AdobeStock_256636375_4x3.jpg/:/cr=t:16.67%25,l:0%25,w:100%25,h:66.67%25/rs=w:600,h:400,cg:true" alt="Medicaid services" className="rounded-3xl w-full object-cover shadow-lg" style={{ maxHeight: 400 }} loading="lazy" />
        </AnimatedSection>
      </div>
    </section>
  );
}
