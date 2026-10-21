import React from 'react';
import { SAMPLE_EXAM_PAPERS, SampleExamPaper } from '../services/sampleData';
import { ArrowRight, BookOpen, FileSpreadsheet } from 'lucide-react';

interface SampleExamSelectorProps {
  onSelectSample: (sample: SampleExamPaper) => void;
  disabled?: boolean;
}

const SampleExamSelector: React.FC<SampleExamSelectorProps> = ({ onSelectSample, disabled = false }) => {
  return (
    <div className="w-full max-w-2xl mx-auto mt-6">
      <div className="flex items-center justify-between mb-2 font-mono text-[11px] uppercase tracking-wider text-neutral-500">
        <span className="flex items-center gap-1.5">
          <FileSpreadsheet className="w-3.5 h-3.5 text-black dark:text-white" />
          TEST BENCH // PRE-LOADED EXAMINATION SCRIPTS
        </span>
        <span>INSTANT TEST</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SAMPLE_EXAM_PAPERS.map((sample, idx) => (
          <button
            key={sample.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelectSample(sample)}
            className="flex items-start gap-3 p-3.5 text-left border transition-all duration-150 group disabled:opacity-50 disabled:pointer-events-none crosshair-corner bg-white border-neutral-300 hover:border-black dark:bg-[#0c0c0c] dark:border-neutral-800 dark:hover:border-white shadow-sm"
          >
            <div className="w-12 h-16 border border-neutral-300 dark:border-neutral-700 bg-white overflow-hidden shrink-0 shadow-sm relative group-hover:scale-105 transition-transform p-0.5">
              <img
                src={sample.svgPreview}
                alt={sample.title}
                className="w-full h-full object-cover grayscale contrast-125"
              />
            </div>

            <div className="flex-1 min-w-0 font-mono">
              <div className="flex items-center justify-between gap-1 mb-1 text-[10px] text-neutral-500">
                <span className="truncate uppercase font-bold text-black dark:text-white">
                  DOC-{idx + 1}: {sample.subject.slice(0, 16)}..
                </span>
                <span className="shrink-0">[ 10/10 MAX ]</span>
              </div>
              <h4 className="text-xs font-bold leading-snug line-clamp-1 font-sans text-black dark:text-white group-hover:underline">
                {sample.title}
              </h4>
              <p className="text-[10px] mt-1 line-clamp-2 leading-relaxed text-neutral-500">
                {sample.description}
              </p>
              <div className="flex items-center gap-1 text-[10px] font-bold mt-2 uppercase tracking-wider text-black dark:text-white group-hover:translate-x-1 transition-transform">
                <span>[ LOAD &amp; EVALUATE ]</span>
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
