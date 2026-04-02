import { Heart, Users, Pill, Hospital, HandHeart, Home, Stethoscope, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SectionHeader from '../shared/SectionHeader';
import AnimatedSection from '../shared/AnimatedSection';

const iconMap = { Heart, Users, Pill, Hospital, HandHeart, Home, Stethoscope, Clock };
const services = [
  { icon: 'HandHeart', emoji: '\u{1F91D}', title: 'Personal Care', desc: 'Assistance with daily living activities including bathing, dressing, and grooming to maintain comfort and dignity.', path: '/services#personal-care' },
  { icon: 'Users', emoji: '\u{1F465}', title: 'Companionship', desc: 'Meaningful social interaction, emotional support, and engaging activities to brighten every day.', path: '/services#companionship' },
  { icon: 'Home', emoji: '\u{1F3E0}', title: 'Homemaking', desc: 'Light housekeeping, meal preparation, and household management for a safe, comfortable home.', path: '/services#homemaking' },
  { icon: 'Stethoscope', emoji: '\u{1FA7A}', title: 'Respite Care', desc: 'Temporary relief for family caregivers so they can rest and recharge while their loved one is cared for.', path: '/services#respite-care' },
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
                  <motion.div whileHover={{ y: -6, boxShadow: '0 12px 32px rgba(0,0,0,0.10)' }} className="h-full p-7 rounded-2xl text-center transition-shadow group"
                    style={{ background: 'var(--white)', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-transform duration-300 group-hover:scale-110"
                      style={{ background: 'var(--accent-light)' }}>
                      <Icon size={36} strokeWidth={1.8} style={{ color: 'var(--primary)' }} />
                    </div>
                    <h3 className="text-lg font-bold mb-2 font-heading" style={{ color: 'var(--text-main)' }}>{service.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-light-color)' }}>{service.desc}</p>
                    <span className="inline-flex items-center gap-1 mt-4 text-sm font-medium transition-colors"
                      style={{ color: 'var(--primary)' }}>
                      Learn more <span className="transition-transform duration-200 group-hover:translate-x-1">&rarr;</span>
                    </span>
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
