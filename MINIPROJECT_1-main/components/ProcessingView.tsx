import React, { useState, useEffect } from 'react';
import { Cpu, CheckCircle2, Loader2, Sparkles, X } from 'lucide-react';

interface ProcessingViewProps {
  onCancel?: () => void;
}

const steps = [
  { label: 'Uploading & pre-processing handwriting document', time: 1000 },
  { label: 'Optical Character Recognition & visual line analysis', time: 2500 },
  { label: 'Detecting question & answer boundaries', time: 4000 },
  { label: 'Cross-verifying factual accuracy and scientific laws', time: 6000 },
  { label: 'Scoring against rubric and detecting missing key concepts', time: 8000 },
  { label: 'Generating model answer and personalized feedback report', time: 9500 },
];

const ProcessingView: React.FC<ProcessingViewProps> = ({ onCancel }) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const intervals = steps.map((s, idx) => {
      return setTimeout(() => {
        setCurrentStepIdx(idx);
      }, s.time);
    });

    return () => {
      intervals.forEach(clearTimeout);
    };
  }, []);

  const progressPercent = Math.min(Math.round(((currentStepIdx + 1) / steps.length) * 100), 95);

  return (
    <div className="flex flex-col items-center justify-center text-center p-6 max-w-xl mx-auto view-fade-in text-black dark:text-white">
      {/* Central Pulsing AI Scanner Icon */}
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-3xl flex items-center justify-center shadow-xl border bg-black text-white border-neutral-800 dark:bg-white dark:text-black dark:border-neutral-200 animate-pulse">
          <Cpu className="w-12 h-12" />
        </div>
        <div className="absolute -bottom-1 -right-1 p-2 rounded-full border shadow-md bg-white border-neutral-300 text-black dark:bg-black dark:border-neutral-700 dark:text-white">
          <Sparkles className="w-4 h-4" />
        </div>
      </div>

      <h2 className="text-2xl font-black mb-2 tracking-tight">
        AI Evaluation in Progress
      </h2>
      <p className="text-xs mb-6 max-w-md text-neutral-600 dark:text-neutral-400">
        Multimodal Vision is transcribing handwriting strokes, analyzing technical logic, and grading against syllabus criteria.
      </p>

      {/* Progress Track */}
      <div className="w-full max-w-md mb-6">
        <div className="flex items-center justify-between text-xs mb-1.5 font-mono text-neutral-600 dark:text-neutral-400">
          <span>{progressPercent}% Complete</span>
          <span>Elapsed: {elapsed}s</span>
        </div>
        <div className="w-full h-2 rounded-full overflow-hidden border bg-neutral-200 border-neutral-300 dark:bg-neutral-800 dark:border-neutral-700">
          <div
            className="h-full bg-black dark:bg-white rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Steps List */}
      <div className="w-full max-w-md space-y-2.5 text-left p-4 rounded-2xl border mb-6 bg-neutral-50 border-neutral-200 dark:bg-neutral-900/60 dark:border-neutral-800">
        {steps.map((step, idx) => {
          const isDone = idx < currentStepIdx;
          const isCurrent = idx === currentStepIdx;

          return (
            <div
              key={idx}
              className={`flex items-center gap-3 text-xs transition-colors duration-200 ${
                isDone
                  ? 'text-black dark:text-white font-bold'
                  : isCurrent
                  ? 'text-neutral-700 dark:text-neutral-300 font-bold'
                  : 'text-neutral-400 dark:text-neutral-600'
              }`}
            >
              <div className="shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-black dark:text-white" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 animate-spin text-black dark:text-white" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-neutral-300 dark:border-neutral-700 bg-neutral-200 dark:bg-neutral-800" />
                )}
              </div>
              <span className="truncate">{step.label}</span>
            </div>
          );
        })}
      </div>

      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition border bg-neutral-100 text-black border-neutral-300 hover:bg-neutral-200 dark:bg-neutral-900 dark:text-white dark:border-neutral-800 dark:hover:bg-neutral-800"
        >
          <X className="w-3.5 h-3.5" /> Cancel Evaluation
        </button>
      )}
    </div>
  );
};

export default ProcessingView;