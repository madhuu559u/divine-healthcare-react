import { Phone, ArrowRight } from 'lucide-react';
import AnimatedSection from '../shared/AnimatedSection';
import Button from '../shared/Button';
import { COMPANY } from '../../utils/constants';

export default function CTASection({ title = 'Ready to Get Started?', subtitle = 'Contact us today for a free consultation and learn how we can help your loved ones.', showJoinTeam = true }) {
  return (
    <>
      {showJoinTeam && (
        <AnimatedSection className="py-16 px-4" style={{ background: 'var(--accent-light)' }}>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--primary-dark)' }}>Join Our Team</h2>
            <p className="text-lg mb-6" style={{ color: 'var(--text-main)' }}>
              We're hiring compassionate caregivers across Virginia. Make a difference in people's lives every day.
            </p>
            <Button to="/careers" variant="primary" size="lg">View Open Positions <ArrowRight size={18} /></Button>
          </div>
        </AnimatedSection>
      )}
      <section className="py-20 px-4 relative overflow-hidden" style={{ background: 'var(--primary)' }}>
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" style={{ background: 'var(--accent)', filter: 'blur(60px)' }} />
        <AnimatedSection className="max-w-4xl mx-auto text-center text-white relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">{subtitle}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button to="/contact" variant="accent" size="lg">Free Consultation <ArrowRight size={18} /></Button>
            <a href={`tel:${COMPANY.phone}`}
              className="inline-flex items-center gap-2 px-7 py-4 rounded-full text-lg font-semibold text-white border-2 border-white/30 hover:bg-white/10 transition-all">
              <Phone size={20} /> {COMPANY.phone}
            </a>
          </div>
        </AnimatedSection>
      </section>
    </>
  );
}
