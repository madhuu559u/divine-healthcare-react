import { MapPin, Phone } from 'lucide-react';
import SectionHeader from '../shared/SectionHeader';
import AnimatedSection from '../shared/AnimatedSection';

const regions = [
  {
    name: 'Northern Virginia',
    cities: ['Woodbridge', 'Dale City', 'Lake Ridge', 'Dumfries', 'Manassas', 'Gainesville', 'Haymarket', 'Bristow'],
  },
  {
    name: 'Fairfax Area',
    cities: ['Springfield', 'Fairfax', 'Alexandria', 'Arlington', 'Centreville', 'Chantilly', 'Herndon', 'Reston'],
  },
  {
    name: 'Stafford / Fredericksburg',
    cities: ['Stafford', 'Fredericksburg', 'Spotsylvania'],
  },
  {
    name: 'Loudoun County',
    cities: ['Leesburg', 'Ashburn', 'Sterling'],
  },
];

export default function ServiceAreaMap() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          badge="Service Area"
          title="Areas We Serve"
          subtitle="Providing trusted Medicaid-approved home care across Virginia communities."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {regions.map((region, i) => (
            <AnimatedSection key={region.name} delay={i * 0.1}>
              <div
                className="p-6 rounded-2xl h-full"
                style={{ background: 'var(--bg-alt)' }}
              >
                <div
                  className="flex items-center gap-2 mb-4 pb-3"
                  style={{ borderBottom: '2px solid var(--accent-light)' }}
                >
                  <MapPin size={18} style={{ color: 'var(--primary)' }} />
                  <h3
                    className="font-bold text-base"
                    style={{ color: 'var(--text-main)' }}
                  >
                    {region.name}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {region.cities.map((city) => (
                    <span
                      key={city}
                      className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 hover:shadow-md"
                      style={{
                        background: 'var(--white)',
                        color: 'var(--text-main)',
                        border: '1px solid var(--accent-light)',
                      }}
                    >
                      {city}
                    </span>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* CTA */}
        <AnimatedSection delay={0.4}>
          <div
            className="text-center p-8 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, var(--primary-light), var(--primary))',
            }}
          >
            <p className="text-white text-lg font-medium mb-4">
              Not sure if we serve your area? Give us a call!
            </p>
            <a
              href="tel:703-763-1749"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-medium text-base transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              style={{ background: 'var(--white)', color: 'var(--primary-dark)' }}
            >
              <Phone size={18} />
              Call 703-763-1749
            </a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
