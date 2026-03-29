import { MapPin } from 'lucide-react';
import { coverageAreas } from '../../data/coverageAreas';
import SectionHeader from '../shared/SectionHeader';
import AnimatedSection from '../shared/AnimatedSection';

export default function CoverageAreas() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <SectionHeader badge="Service Area" title="Areas We Serve" subtitle="Providing trusted home care across Northern Virginia and surrounding areas." />
        <AnimatedSection>
          <div className="flex flex-wrap justify-center gap-3">
            {coverageAreas.map((area) => (
              <span key={area} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all hover:shadow-md cursor-default"
                style={{ background: 'var(--bg-alt)', color: 'var(--text-main)' }}>
                <MapPin size={14} style={{ color: 'var(--primary)' }} /> {area}
              </span>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
