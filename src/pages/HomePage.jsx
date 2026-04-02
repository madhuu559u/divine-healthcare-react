import Hero from '../components/home/Hero';
import TrustBar from '../components/home/TrustBar';
import AboutPreview from '../components/home/AboutPreview';
import ServicesPreview from '../components/home/ServicesPreview';
import MedicaidChecker from '../components/home/MedicaidChecker';
import HowItWorks from '../components/home/HowItWorks';
import Testimonials from '../components/home/Testimonials';
import ServiceAreaMap from '../components/home/ServiceAreaMap';
import CTASection from '../components/home/CTASection';

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <AboutPreview />
      <ServicesPreview />
      <MedicaidChecker />
      <HowItWorks />
      <Testimonials />
      <ServiceAreaMap />
      <CTASection />
    </>
  );
}
