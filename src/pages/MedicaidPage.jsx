import MedicaidHero from '../components/medicaid/MedicaidHero';
import EligibilityInfo from '../components/medicaid/EligibilityInfo';
import WaiverPrograms from '../components/medicaid/WaiverPrograms';
import EVVSection from '../components/medicaid/EVVSection';

export default function MedicaidPage() {
  return (
    <>
      <MedicaidHero />
      <EligibilityInfo />
      <WaiverPrograms />
      <EVVSection />
    </>
  );
}
