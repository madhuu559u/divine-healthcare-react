import SectionHeader from '../shared/SectionHeader';
import AnimatedSection from '../shared/AnimatedSection';
import Card from '../shared/Card';

const waivers = [
  {
    title: 'CCC Plus Waiver',
    subtitle: 'Commonwealth Coordinated Care Plus',
    desc: 'The primary Medicaid managed care program in Virginia that coordinates all health care services, including home and community-based services, for eligible individuals.',
    services: ['Personal Care', 'Companion Services', 'Respite Care', 'Adult Day Health Care', 'Transition Services']
  },
  {
    title: 'EDCD Waiver',
    subtitle: 'Elderly or Disabled with Consumer Direction',
    desc: 'Allows members to self-direct their personal care services, choosing their own caregivers and managing their care budget.',
    services: ['Consumer-Directed Personal Care', 'Respite Care', 'Companion Services', 'Environmental Modifications']
  },
  {
    title: 'Technology Assisted Waiver',
    subtitle: 'Tech Waiver',
    desc: 'Provides home and community-based services to technology-dependent individuals who would otherwise require institutional care.',
    services: ['Skilled Nursing', 'Personal Care', 'Respite Care', 'Assistive Technology', 'Environmental Modifications']
  }
];

export default function WaiverPrograms() {
  return (
    <section className="py-20 px-4" style={{ background: 'var(--bg-alt)' }}>
      <div className="max-w-7xl mx-auto">
        <SectionHeader badge="Waiver Programs" title="Virginia Medicaid Waiver Programs" subtitle="We participate in multiple Virginia Medicaid waiver programs to serve eligible clients." />
        <div className="grid md:grid-cols-3 gap-6">
          {waivers.map((w, i) => (
            <AnimatedSection key={w.title} delay={i * 0.15}>
              <Card className="h-full">
                <div className="px-3 py-1.5 rounded-full text-xs font-medium inline-block mb-3" style={{ background: 'var(--accent-light)', color: 'var(--primary-dark)' }}>{w.subtitle}</div>
                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-main)' }}>{w.title}</h3>
                <p className="text-sm mb-4" style={{ color: 'var(--text-light-color)' }}>{w.desc}</p>
                <h4 className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: 'var(--primary)' }}>Covered Services</h4>
                <ul className="space-y-1">
                  {w.services.map(s => <li key={s} className="text-xs" style={{ color: 'var(--text-light-color)' }}>• {s}</li>)}
                </ul>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
