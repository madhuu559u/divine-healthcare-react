import { Heart, Users, Pill, Hospital, CheckCircle, CreditCard } from 'lucide-react';
import { services } from '../../data/services';
import AnimatedSection from '../shared/AnimatedSection';

const iconMap = { Heart, Users, Pill, Hospital };

export default function ServiceDetail() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection className="mb-16 p-6 md:p-8 rounded-2xl text-center" style={{ background: 'var(--accent-light)' }}>
          <div className="flex items-center justify-center gap-2 mb-2">
            <CreditCard size={20} style={{ color: 'var(--primary)' }} />
            <span className="font-bold" style={{ color: 'var(--primary-dark)' }}>We Accept Medicaid</span>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-light-color)' }}>Many of our services are covered under Virginia Medicaid waiver programs including CCC Plus and EDCD.</p>
        </AnimatedSection>

        <div className="space-y-20">
          {services.map((service, i) => {
            const Icon = iconMap[service.icon];
            const isEven = i % 2 === 0;
            return (
              <AnimatedSection key={service.id} id={service.id} direction={isEven ? 'left' : 'right'}>
                <div className={`grid md:grid-cols-2 gap-10 items-center ${!isEven ? 'md:flex-row-reverse' : ''}`}>
                  <div className={!isEven ? 'md:order-2' : ''}>
                    <img src={service.image} alt={service.title} className="rounded-3xl w-full object-cover shadow-lg" style={{ maxHeight: 400 }} loading="lazy" />
                  </div>
                  <div className={!isEven ? 'md:order-1' : ''}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'var(--accent-light)' }}>
                        <Icon size={24} style={{ color: 'var(--primary)' }} />
                      </div>
                      <h3 className="text-2xl font-bold" style={{ color: 'var(--text-main)' }}>{service.title}</h3>
                    </div>
                    <p className="mb-6" style={{ color: 'var(--text-light-color)' }}>{service.fullDesc}</p>
                    <ul className="space-y-2">
                      {service.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm">
                          <CheckCircle size={18} className="mt-0.5 shrink-0" style={{ color: 'var(--primary)' }} />
                          <span style={{ color: 'var(--text-main)' }}>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
