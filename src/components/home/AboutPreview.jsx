import { CheckCircle } from 'lucide-react';
import AnimatedSection from '../shared/AnimatedSection';
import Button from '../shared/Button';

export default function AboutPreview() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <AnimatedSection direction="left">
          <div className="relative">
            <img src="https://img1.wsimg.com/isteam/ip/2b5573a4-2ac2-4b6d-b528-244db817d67f/Depositphotos_24655255_XL.jpg/:/cr=t:12.51%25,l:0%25,w:100%25,h:74.99%25/rs=w:600,h:400,cg:true"
              alt="Our caring team" className="rounded-3xl w-full object-cover shadow-lg" style={{ maxHeight: 480 }} />
            <div className="absolute -bottom-6 -right-6 p-4 rounded-2xl shadow-lg hidden md:block"
              style={{ background: 'var(--white)' }}>
              <span className="text-3xl font-bold block" style={{ color: 'var(--primary)' }}>10+</span>
              <span className="text-sm" style={{ color: 'var(--text-light-color)' }}>Years of Care</span>
            </div>
          </div>
        </AnimatedSection>
        <AnimatedSection direction="right">
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4"
            style={{ background: 'var(--accent-light)', color: 'var(--primary-dark)' }}>Our Story</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: 'var(--text-main)' }}>
            A Decade of Compassionate Home Care
          </h2>
          <p className="mb-6 leading-relaxed" style={{ color: 'var(--text-light-color)' }}>
            Founded in 2014, Divine Healthcare Services was born from a deep passion for serving others.
            What started as a family-inspired mission has grown into a trusted provider of non-medical
            home care services across Virginia.
          </p>
          <ul className="space-y-3 mb-8">
            {['Compassionate & Personalized Care', 'Licensed & Insured Professionals', 'Flexible Scheduling Options', 'Statewide Virginia Coverage'].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <CheckCircle size={20} style={{ color: 'var(--primary)' }} />
                <span style={{ color: 'var(--text-main)' }}>{item}</span>
              </li>
            ))}
          </ul>
          <Button to="/about">Learn More About Us</Button>
        </AnimatedSection>
      </div>
    </section>
  );
}
