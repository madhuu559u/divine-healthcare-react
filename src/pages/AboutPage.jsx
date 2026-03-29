import AboutHero from '../components/about/AboutHero';
import Story from '../components/about/Story';
import Values from '../components/about/Values';
import TrustBar from '../components/home/TrustBar';
import Team from '../components/about/Team';
import Testimonials from '../components/home/Testimonials';
import CTASection from '../components/home/CTASection';

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <Story />
      <Values />
      <TrustBar />
      <Team />
      <Testimonials />
      <CTASection showJoinTeam={false} />
    </>
  );
}
