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
    <div className="flex flex-col items-center justify-center text-center text-white p-6 max-w-xl mx-auto view-fade-in">
      {/* Central Pulsing AI Scanner Icon */}
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-2xl shadow-blue-500/40 animate-pulse">
          <Cpu className="w-12 h-12 text-white animate-spin-slow" />
        </div>
        <div className="absolute -bottom-1 -right-1 p-2 bg-slate-900 rounded-full border border-slate-700 shadow-md">
          <Sparkles className="w-4 h-4 text-amber-400" />
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-2 tracking-tight text-white">
        AI Evaluation in Progress
      </h2>
      <p className="text-xs text-slate-400 mb-6 max-w-md">
        Gemini Multimodal Vision is reading handwriting strokes, transcribing text, and evaluating factual logic.
      </p>

      {/* Progress Track */}
      <div className="w-full max-w-md mb-6">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-mono">
          <span>{progressPercent}% Complete</span>
          <span>Elapsed: {elapsed}s</span>
        </div>
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-teal-400 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Steps List */}
      <div className="w-full max-w-md space-y-2.5 text-left bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80 mb-6">
        {steps.map((step, idx) => {
          const isDone = idx < currentStepIdx;
          const isCurrent = idx === currentStepIdx;

          return (
            <div
              key={idx}
              className={`flex items-center gap-3 text-xs transition-colors duration-300 ${
                isDone
                  ? 'text-emerald-400 font-medium'
                  : isCurrent
                  ? 'text-blue-300 font-semibold'
                  : 'text-slate-500'
              }`}
            >
              <div className="shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-700 bg-slate-800" />
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
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-xl transition border border-slate-700"
        >
          <X className="w-3.5 h-3.5" /> Cancel Evaluation
        </button>
      )}
    </div>
  );
};

export default ProcessingView;