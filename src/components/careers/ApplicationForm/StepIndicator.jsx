import { Check } from 'lucide-react';
import useApplicationStore from '../../../store/useApplicationStore';

const stepLabels = ['Personal', 'Position', 'Employment', 'Education', 'Licenses', 'References', 'Documents', 'Agreements', 'Review'];

export default function StepIndicator() {
  const { currentStep, goToStep } = useApplicationStore();

  return (
    <div className="w-full overflow-x-auto py-4 px-2">
      <div className="flex items-center justify-center min-w-[600px] mx-auto max-w-3xl">
        {stepLabels.map((label, i) => {
          const step = i + 1;
          const isComplete = currentStep > step;
          const isCurrent = currentStep === step;
          return (
            <div key={step} className="flex items-center flex-1 last:flex-none">
              <button
                onClick={() => isComplete ? goToStep(step) : null}
                className={`flex flex-col items-center gap-1 ${isComplete ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${isCurrent ? 'scale-110' : ''}`}
                  style={{
                    background: isComplete ? 'var(--primary)' : isCurrent ? 'var(--primary)' : 'var(--bg-alt)',
                    color: isComplete || isCurrent ? 'var(--white)' : 'var(--text-light-color)',
                    boxShadow: isCurrent ? '0 0 0 4px color-mix(in srgb, var(--primary) 20%, transparent)' : 'none'
                  }}>
                  {isComplete ? <Check size={18} /> : step}
                </div>
                <span className="text-xs font-medium hidden sm:block" style={{ color: isCurrent ? 'var(--primary)' : 'var(--text-light-color)' }}>
                  {label}
                </span>
              </button>
              {i < stepLabels.length - 1 && (
                <div className="flex-1 h-0.5 mx-1" style={{ background: isComplete ? 'var(--primary)' : 'var(--bg-alt)' }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
