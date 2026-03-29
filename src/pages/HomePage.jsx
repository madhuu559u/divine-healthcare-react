import Hero from '../components/home/Hero';
import TrustBar from '../components/home/TrustBar';
import AboutPreview from '../components/home/AboutPreview';
import ServicesPreview from '../components/home/ServicesPreview';
import HowItWorks from '../components/home/HowItWorks';
import Testimonials from '../components/home/Testimonials';
import CoverageAreas from '../components/home/CoverageAreas';
import CTASection from '../components/home/CTASection';

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <AboutPreview />
      <ServicesPreview />
      <HowItWorks />
      <Testimonials />
      <CoverageAreas />
      <CTASection />
    </>
  );
}
