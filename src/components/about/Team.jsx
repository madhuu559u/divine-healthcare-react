import SectionHeader from '../shared/SectionHeader';
import AnimatedSection from '../shared/AnimatedSection';

const team = [
  { title: 'Compassionate Caregivers', desc: 'Our caregivers are the heart of what we do — trained, certified, and deeply committed to client well-being.', image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80' },
  { title: 'Care Coordinators', desc: 'Our coordinators ensure seamless communication between clients, families, caregivers, and healthcare providers.', image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80' },
  { title: 'Administrative Team', desc: 'Our admin team handles scheduling, compliance, and operations so our caregivers can focus on what matters.', image: 'https://images.unsplash.com/photo-1551836022-4c4c79ecde51?w=400&q=80' },
];

export default function Team() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <SectionHeader badge="Our Team" title="The People Behind the Care" subtitle="A dedicated team united by a shared passion for helping others." />
        <div className="grid md:grid-cols-3 gap-8">
          {team.map((t, i) => (
            <AnimatedSection key={t.title} delay={i * 0.15} className="text-center">
              <img src={t.image} alt={t.title} className="w-full h-64 object-cover rounded-3xl mb-5 shadow-lg" loading="lazy" />
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-main)' }}>{t.title}</h3>
              <p className="text-sm" style={{ color: 'var(--text-light-color)' }}>{t.desc}</p>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
