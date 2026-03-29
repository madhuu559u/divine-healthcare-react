import ServicesHero from '../components/services/ServicesHero';
import ServiceDetail from '../components/services/ServiceDetail';
import HowItWorks from '../components/home/HowItWorks';
import ServicesCTA from '../components/services/ServicesCTA';

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <ServiceDetail />
      <HowItWorks />
      <ServicesCTA />
    </>
  );
}
