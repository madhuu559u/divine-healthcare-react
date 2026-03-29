import { Heart, Users, Pill, Hospital } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SectionHeader from '../shared/SectionHeader';
import AnimatedSection from '../shared/AnimatedSection';

const iconMap = { Heart, Users, Pill, Hospital };
const serviceIcons = ['Heart', 'Users', 'Pill', 'Hospital'];
const services = [
  { icon: 'Heart', title: 'Personal Care', desc: 'Assistance with daily living activities to maintain comfort and dignity.', path: '/services#personal-care' },
  { icon: 'Users', title: 'Companionship', desc: 'Meaningful social interaction and emotional support.', path: '/services#companionship' },
  { icon: 'Pill', title: 'Medication Reminders', desc: 'Ensuring timely and accurate medication management.', path: '/services#medication-reminders' },
  { icon: 'Hospital', title: 'Post-Hospital Support', desc: 'Smooth recovery support after hospital stays.', path: '/services#post-hospital' },
];

export default function ServicesPreview() {
  return (
    <section className="py-20 px-4" style={{ background: 'var(--bg-alt)' }}>
      <div className="max-w-7xl mx-auto">
        <SectionHeader badge="What We Do" title="Our Care Services" subtitle="Personalized home care services tailored to meet the unique needs of each client." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, i) => {
            const Icon = iconMap[service.icon];
            return (
              <AnimatedSection key={service.title} delay={i * 0.1}>
                <Link to={service.path}>
                  <motion.div whileHover={{ y: -6 }} className="h-full p-6 rounded-2xl text-center transition-shadow"
                    style={{ background: 'var(--white)', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                      style={{ background: 'var(--accent-light)' }}>
                      <Icon size={28} style={{ color: 'var(--primary)' }} />
                    </div>
                    <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-main)' }}>{service.title}</h3>
                    <p className="text-sm" style={{ color: 'var(--text-light-color)' }}>{service.desc}</p>
                  </motion.div>
                </Link>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
