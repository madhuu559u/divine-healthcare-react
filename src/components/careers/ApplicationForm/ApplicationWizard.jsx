import { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Save } from 'lucide-react';
import useApplicationStore from '../../../store/useApplicationStore';
import { jobs } from '../../../data/jobs';
import StepIndicator from './StepIndicator';
import Step1_PersonalInfo from './Step1_PersonalInfo';
import Step2_Employment from './Step2_Employment';
import Step3_EmploymentHistory from './Step3_EmploymentHistory';
import Step4_Education from './Step4_Education';
import Step5_Licenses from './Step5_Licenses';
import Step6_References from './Step6_References';
import Step7_Documents from './Step7_Documents';
import Step8_Agreements from './Step8_Agreements';
import Step9_Review from './Step9_Review';

const steps = {
  1: Step1_PersonalInfo,
  2: Step2_Employment,
  3: Step3_EmploymentHistory,
  4: Step4_Education,
  5: Step5_Licenses,
  6: Step6_References,
  7: Step7_Documents,
  8: Step8_Agreements,
  9: Step9_Review,
};

export default function ApplicationWizard() {
  const [searchParams] = useSearchParams();
  const { currentStep, setSelectedJob, updateEmploymentDesired } = useApplicationStore();

  useEffect(() => {
    const jobId = searchParams.get('job');
    if (jobId) {
      const job = jobs.find(j => j.id === jobId);
      if (job) {
        setSelectedJob(job);
        updateEmploymentDesired({ position: job.title });
      }
    }
  }, [searchParams, setSelectedJob, updateEmploymentDesired]);

  const StepComponent = steps[currentStep];

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <header className="sticky top-0 z-40 border-b px-4 py-3" style={{ background: 'var(--white)', borderColor: 'var(--bg-alt)' }}>
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link to="/careers" className="flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--text-light-color)' }}>
            <ArrowLeft size={18} /> Back to Careers
          </Link>
          <div className="text-center">
            <span className="font-heading text-lg font-bold" style={{ color: 'var(--primary-dark)' }}>Divine Healthcare</span>
            <span className="text-xs block" style={{ color: 'var(--text-light-color)' }}>Career Application</span>
          </div>
          <div className="flex items-center gap-1 text-sm" style={{ color: 'var(--text-light-color)' }}>
            <Save size={16} /> Auto-saved
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <StepIndicator />
        <div className="mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <StepComponent />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
