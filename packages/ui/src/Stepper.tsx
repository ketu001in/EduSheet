import React from 'react';
import { Check } from 'lucide-react';

export interface Step {
  label: string;
  description?: string;
}

export interface StepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStep, className = '' }) => {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = currentStep > index;
          const isCurrent = currentStep === index;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.label} className={`flex items-center ${isLast ? '' : 'flex-1'}`}>
              <div className="relative flex flex-col items-center group">
                <div 
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 z-10
                    ${isCompleted ? 'bg-indigo-500 border-indigo-500 text-white' : ''}
                    ${isCurrent ? 'bg-white dark:bg-slate-900 border-indigo-500 text-indigo-500' : ''}
                    ${!isCompleted && !isCurrent ? 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-500' : ''}
                  `}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : <span>{index + 1}</span>}
                </div>
                
                <div className="absolute top-12 w-32 text-center">
                  <p className={`text-sm font-medium ${isCurrent || isCompleted ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
                    {step.label}
                  </p>
                  {step.description && (
                    <p className="text-xs text-slate-500 mt-1 hidden sm:block">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>

              {!isLast && (
                <div className="flex-1 h-0.5 mx-4 relative overflow-hidden bg-slate-200 dark:bg-slate-700">
                  <div 
                    className="absolute inset-y-0 left-0 bg-indigo-500 transition-all duration-500 ease-in-out"
                    style={{ width: isCompleted ? '100%' : '0%' }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
