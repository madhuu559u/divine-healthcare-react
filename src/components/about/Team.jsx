import SectionHeader from '../shared/SectionHeader';
import AnimatedSection from '../shared/AnimatedSection';

const team = [
  { title: 'Compassionate Caregivers', desc: 'Our caregivers are the heart of what we do — trained, certified, and deeply committed to client well-being.', image: 'https://img1.wsimg.com/isteam/ip/2b5573a4-2ac2-4b6d-b528-244db817d67f/Home-Solutions_AdobeStock_256636375_4x3.jpg/:/cr=t:16.67%25,l:0%25,w:100%25,h:66.67%25/rs=w:400,h:300,cg:true' },
  { title: 'Care Coordinators', desc: 'Our coordinators ensure seamless communication between clients, families, caregivers, and healthcare providers.', image: 'https://img1.wsimg.com/isteam/ip/2b5573a4-2ac2-4b6d-b528-244db817d67f/Depositphotos_24655255_XL.jpg/:/cr=t:12.51%25,l:0%25,w:100%25,h:74.99%25/rs=w:400,h:300,cg:true' },
  { title: 'Administrative Team', desc: 'Our admin team handles scheduling, compliance, and operations so our caregivers can focus on what matters.', image: 'https://img1.wsimg.com/isteam/stock/ZzQ8knj/:/rs=w:400,h:300,cg:true,m/cr=w:400,h:300' },
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
