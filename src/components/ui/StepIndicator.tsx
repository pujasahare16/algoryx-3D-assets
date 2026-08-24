import { cn } from '@/lib/utils';

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
  onStepClick?: (step: number) => void;
  completedSteps?: number[];
}

export default function StepIndicator({ steps, currentStep, onStepClick, completedSteps = [] }: StepIndicatorProps) {
  return (
    <div className="flex items-center w-full" role="list" aria-label="Progress steps">
      {steps.map((step, i) => {
        const isActive = i === currentStep;
        const isCompleted = completedSteps.includes(i) || i < currentStep;
        const isClickable = onStepClick && (isCompleted || i <= currentStep);
        const stepNum = String(i + 1).padStart(2, '0');

        return (
          <div key={i} className="flex items-center flex-1 last:flex-none" role="listitem">
            <button
              type="button"
              onClick={() => isClickable && onStepClick?.(i)}
              disabled={!isClickable}
              className={cn(
                'flex items-center gap-2 whitespace-nowrap transition-colors',
                isClickable ? 'cursor-pointer' : 'cursor-default',
                isActive
                  ? 'text-white'
                  : isCompleted
                    ? 'text-teal-500'
                    : 'text-neutral-500'
              )}
              aria-current={isActive ? 'step' : undefined}
            >
              <span
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-md text-[11px] font-semibold border transition-colors shrink-0',
                  isActive
                    ? 'bg-teal-600 border-teal-500 text-white'
                    : isCompleted
                      ? 'bg-teal-900/30 border-teal-700/50 text-teal-400'
                      : 'bg-neutral-800/50 border-neutral-700 text-neutral-500'
                )}
              >
                {isCompleted && !isActive ? '✓' : stepNum}
              </span>
              <span className="text-[13px] font-medium hidden sm:inline">{step}</span>
            </button>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  'flex-1 h-px mx-3 hidden sm:block',
                  i < currentStep ? 'bg-teal-700/50' : 'bg-neutral-800'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
