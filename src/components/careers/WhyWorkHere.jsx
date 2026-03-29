import { DollarSign, Clock, GraduationCap, ShieldCheck, Users, TrendingUp, HeartHandshake, CreditCard } from 'lucide-react';
import SectionHeader from '../shared/SectionHeader';
import AnimatedSection from '../shared/AnimatedSection';
import Card from '../shared/Card';

const iconMap = { DollarSign, Clock, GraduationCap, ShieldCheck, Users, TrendingUp, HeartHandshake, CreditCard };
const benefits = [
  { icon: 'DollarSign', title: 'Competitive Pay', desc: 'Industry-leading compensation packages' },
  { icon: 'Clock', title: 'Flexible Scheduling', desc: 'Work-life balance with shifts that fit your life' },
  { icon: 'GraduationCap', title: 'Training & Certification', desc: 'Ongoing professional development support' },
  { icon: 'ShieldCheck', title: 'Health Benefits', desc: 'Medical, dental, and vision coverage' },
  { icon: 'Users', title: 'Supportive Team', desc: 'Collaborative and caring work environment' },
  { icon: 'TrendingUp', title: 'Career Growth', desc: 'Clear pathways for advancement' },
  { icon: 'HeartHandshake', title: 'Employee Assistance', desc: 'EAP program for your well-being' },
  { icon: 'CreditCard', title: 'Direct Deposit', desc: 'Convenient and reliable pay' },
];

export default function WhyWorkHere() {
  return (
    <section className="py-20 px-4" style={{ background: 'var(--bg-alt)' }}>
      <div className="max-w-7xl mx-auto">
        <SectionHeader badge="Benefits" title="Why Work at Divine Healthcare?" subtitle="We take care of those who take care of others." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b, i) => {
            const Icon = iconMap[b.icon];
            return (
              <AnimatedSection key={b.title} delay={i * 0.08}>
                <Card className="text-center h-full">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--accent-light)' }}>
                    <Icon size={24} style={{ color: 'var(--primary)' }} />
                  </div>
                  <h3 className="font-bold mb-1" style={{ color: 'var(--text-main)' }}>{b.title}</h3>
                  <p className="text-sm" style={{ color: 'var(--text-light-color)' }}>{b.desc}</p>
                </Card>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
