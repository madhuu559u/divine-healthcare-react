import ContactHero from '../components/contact/ContactHero';
import ContactForm from '../components/contact/ContactForm';
import ContactInfo from '../components/contact/ContactInfo';
import CoverageAreas from '../components/home/CoverageAreas';
import AnimatedSection from '../components/shared/AnimatedSection';

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-5 gap-12">
          <AnimatedSection direction="left" className="lg:col-span-3">
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-main)' }}>Send Us a Message</h2>
            <ContactForm />
          </AnimatedSection>
          <AnimatedSection direction="right" className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-main)' }}>Get In Touch</h2>
            <ContactInfo />
          </AnimatedSection>
        </div>
      </section>
      <CoverageAreas />
    </>
  );
}
