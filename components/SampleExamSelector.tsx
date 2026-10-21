import React from 'react';
import { SAMPLE_EXAM_PAPERS, SampleExamPaper } from '../services/sampleData';
import { Sparkles, ArrowRight, BookOpen } from 'lucide-react';

interface SampleExamSelectorProps {
  onSelectSample: (sample: SampleExamPaper) => void;
  disabled?: boolean;
}

const SampleExamSelector: React.FC<SampleExamSelectorProps> = ({ onSelectSample, disabled = false }) => {
  return (
    <div className="w-full max-w-2xl mx-auto mt-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Or Try A Pre-Loaded Sample Exam Sheet
        </span>
        <span className="text-[11px] text-slate-500">Instant 1-Click Evaluation</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SAMPLE_EXAM_PAPERS.map((sample) => (
          <button
            key={sample.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelectSample(sample)}
            className="flex items-start gap-3 p-3.5 text-left rounded-xl bg-slate-900/80 border border-slate-700/80 hover:border-blue-500 hover:bg-slate-800/80 transition-all duration-200 group disabled:opacity-50 disabled:pointer-events-none"
          >
            <div className="w-12 h-16 rounded bg-amber-50 border border-amber-200 overflow-hidden shrink-0 shadow-sm relative group-hover:scale-105 transition-transform">
              <img
                src={sample.svgPreview}
                alt={sample.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <BookOpen className="w-3 h-3 text-blue-400 shrink-0" />
                <span className="text-[11px] font-semibold text-blue-400 truncate">
                  {sample.subject}
                </span>
              </div>
              <h4 className="text-xs font-bold text-white leading-tight line-clamp-1 group-hover:text-blue-300 transition-colors">
                {sample.title}
              </h4>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {sample.description}
              </p>
              <div className="flex items-center gap-1 text-[11px] font-medium text-blue-400 mt-2 group-hover:translate-x-1 transition-transform">
                <span>Evaluate this paper</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SampleExamSelector;
