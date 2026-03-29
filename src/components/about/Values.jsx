import { Heart, Shield, Star, Users, MessageCircle, RefreshCw, HandHeart } from 'lucide-react';
import SectionHeader from '../shared/SectionHeader';
import AnimatedSection from '../shared/AnimatedSection';
import Card from '../shared/Card';

const values = [
  { icon: Heart, title: 'Dignity', desc: 'Every person deserves to be treated with the utmost respect and dignity.' },
  { icon: Shield, title: 'Safety', desc: 'Creating a safe, secure environment for every client in our care.' },
  { icon: Star, title: 'Independence', desc: 'Supporting clients to maintain their independence and quality of life.' },
  { icon: Users, title: 'Respect', desc: 'Honoring the individuality, culture, and preferences of each client.' },
  { icon: MessageCircle, title: 'Communication', desc: 'Maintaining open, honest communication with clients and families.' },
  { icon: RefreshCw, title: 'Consistency', desc: 'Delivering reliable, consistent care you can count on.' },
  { icon: HandHeart, title: 'Kindness', desc: 'Leading with kindness in every interaction, every day.' },
];

export default function Values() {
  return (
    <section className="py-20 px-4" style={{ background: 'var(--bg-alt)' }}>
      <div className="max-w-7xl mx-auto">
        <SectionHeader badge="Core Values" title="What We Stand For" subtitle="Our values guide every decision, every interaction, and every moment of care." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {values.map((v, i) => (
            <AnimatedSection key={v.title} delay={i * 0.08}>
              <Card className="text-center h-full">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--accent-light)' }}>
                  <v.icon size={24} style={{ color: 'var(--primary)' }} />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-main)' }}>{v.title}</h3>
                <p className="text-sm" style={{ color: 'var(--text-light-color)' }}>{v.desc}</p>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
