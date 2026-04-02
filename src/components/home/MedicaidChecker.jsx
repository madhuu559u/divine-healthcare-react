import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardCheck, ArrowRight, ArrowLeft, Phone, CheckCircle, HelpCircle, XCircle } from 'lucide-react';
import SectionHeader from '../shared/SectionHeader';
import AnimatedSection from '../shared/AnimatedSection';
import Button from '../shared/Button';

const questions = [
  {
    id: 'resident',
    text: 'Are you a Virginia resident?',
    options: ['Yes', 'No'],
  },
  {
    id: 'needs',
    text: 'Do you or your loved one need help with daily activities?',
    options: ['Yes', 'No'],
  },
  {
    id: 'medicaid',
    text: 'Do you have Medicaid coverage?',
    options: ['Yes', 'No', 'Not Sure'],
  },
];

function getResult(answers) {
  const { resident, needs, medicaid } = answers;

  if (resident === 'Yes' && needs === 'Yes' && medicaid === 'Yes') {
    return {
      type: 'success',
      icon: CheckCircle,
      title: 'You May Qualify!',
      message: 'Based on your answers, you may be eligible for Medicaid-approved home care services. Contact us for a free, no-obligation assessment.',
      cta: 'contact',
    };
  }

  if (medicaid === 'Not Sure') {
    return {
      type: 'info',
      icon: HelpCircle,
      title: 'We Can Help You Find Out',
      message: 'Not sure about your Medicaid status? No problem. Our team can guide you through the eligibility process at no cost.',
      cta: 'phone',
    };
  }

  return {
    type: 'alternate',
    icon: XCircle,
    title: 'You May Still Qualify',
    message: "Even if you don't meet all the typical criteria, there may be other programs available to help. Let's explore your options together.",
    cta: 'contact',
  };
}

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction < 0 ? 80 : -80,
    opacity: 0,
  }),
};

export default function MedicaidChecker() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [direction, setDirection] = useState(1);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (questionId, answer) => {
    const newAnswers = { ...answers, [questionId]: answer };
    setAnswers(newAnswers);
    setDirection(1);

    if (step < questions.length - 1) {
      setTimeout(() => setStep(step + 1), 200);
    } else {
      setTimeout(() => setShowResult(true), 200);
    }
  };

  const handleBack = () => {
    if (showResult) {
      setShowResult(false);
      return;
    }
    if (step > 0) {
      setDirection(-1);
      setStep(step - 1);
    }
  };

  const handleReset = () => {
    setStep(0);
    setAnswers({});
    setShowResult(false);
    setDirection(-1);
  };

  const result = showResult ? getResult(answers) : null;
  const progress = showResult ? 100 : ((step) / questions.length) * 100;

  const resultColors = {
    success: { bg: 'var(--primary)', light: 'var(--primary-light)' },
    info: { bg: 'var(--accent)', light: 'var(--accent-light)' },
    alternate: { bg: 'var(--primary-light)', light: 'var(--accent-light)' },
  };

  return (
    <section className="py-20 px-4" style={{ background: 'var(--bg-alt)' }}>
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          badge="Eligibility Check"
          title="Check Your Medicaid Eligibility"
          subtitle="Answer 3 quick questions to see if you or your loved one may qualify for home care services."
        />

        <AnimatedSection>
          <div className="max-w-2xl mx-auto">
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: 'var(--white)',
                boxShadow: '0 8px 40px rgba(0,0,0,0.06)',
              }}
            >
              {/* Progress bar */}
              <div className="h-1.5" style={{ background: 'var(--bg-alt)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'var(--primary)' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
              </div>

              <div className="p-8 md:p-10 min-h-[320px] flex flex-col">
                <AnimatePresence mode="wait" custom={direction}>
                  {!showResult ? (
                    <motion.div
                      key={`question-${step}`}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="flex-1 flex flex-col"
                    >
                      {/* Step indicator */}
                      <div className="flex items-center gap-2 mb-6">
                        <ClipboardCheck size={20} style={{ color: 'var(--primary)' }} />
                        <span className="text-sm font-medium" style={{ color: 'var(--primary)' }}>
                          Question {step + 1} of {questions.length}
                        </span>
                      </div>

                      {/* Question */}
                      <h3
                        className="text-xl md:text-2xl font-bold mb-8 font-heading"
                        style={{ color: 'var(--text-main)' }}
                      >
                        {questions[step].text}
                      </h3>

                      {/* Options */}
                      <div className="flex flex-wrap gap-3 mb-8">
                        {questions[step].options.map((option) => {
                          const isSelected = answers[questions[step].id] === option;
                          return (
                            <button
                              key={option}
                              onClick={() => handleAnswer(questions[step].id, option)}
                              className="px-6 py-3 rounded-full font-medium text-base transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                              style={{
                                background: isSelected ? 'var(--primary)' : 'var(--bg-alt)',
                                color: isSelected ? 'var(--white)' : 'var(--text-main)',
                                border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--accent-light)'}`,
                              }}
                            >
                              {option}
                            </button>
                          );
                        })}
                      </div>

                      {/* Back button */}
                      {step > 0 && (
                        <button
                          onClick={handleBack}
                          className="inline-flex items-center gap-1 text-sm font-medium mt-auto cursor-pointer hover:opacity-70 transition-opacity self-start"
                          style={{ color: 'var(--text-light-color)' }}
                        >
                          <ArrowLeft size={14} /> Previous question
                        </button>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="result"
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="flex-1 flex flex-col items-center text-center"
                    >
                      {/* Result icon */}
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
                        style={{ background: resultColors[result.type].light }}
                      >
                        <result.icon size={32} style={{ color: resultColors[result.type].bg }} />
                      </div>

                      <h3
                        className="text-2xl font-bold mb-3 font-heading"
                        style={{ color: 'var(--text-main)' }}
                      >
                        {result.title}
                      </h3>

                      <p
                        className="text-base mb-8 max-w-md"
                        style={{ color: 'var(--text-light-color)' }}
                      >
                        {result.message}
                      </p>

                      <div className="flex flex-wrap gap-3 justify-center mb-6">
                        {result.cta === 'contact' ? (
                          <Button to="/contact" variant="primary" size="md">
                            Get Free Assessment <ArrowRight size={16} />
                          </Button>
                        ) : (
                          <a
                            href="tel:703-763-1749"
                            className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-medium text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                            style={{ background: 'var(--primary)' }}
                          >
                            <Phone size={16} />
                            Call 703-763-1749
                          </a>
                        )}
                      </div>

                      <button
                        onClick={handleReset}
                        className="inline-flex items-center gap-1 text-sm font-medium cursor-pointer hover:opacity-70 transition-opacity"
                        style={{ color: 'var(--text-light-color)' }}
                      >
                        <ArrowLeft size={14} /> Start over
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
