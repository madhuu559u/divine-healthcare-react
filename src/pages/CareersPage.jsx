import CareersHero from '../components/careers/CareersHero';
import WhyWorkHere from '../components/careers/WhyWorkHere';
import JobListings from '../components/careers/JobListings';
import BenefitsSection from '../components/careers/BenefitsSection';
import CTASection from '../components/home/CTASection';

export default function CareersPage() {
  return (
    <>
      <CareersHero />
      <WhyWorkHere />
      <JobListings />
      <BenefitsSection />
      <CTASection title="Ready to Make a Difference?" subtitle="Join our team and help provide compassionate care to those who need it most." showJoinTeam={false} />
    </>
  );
}
