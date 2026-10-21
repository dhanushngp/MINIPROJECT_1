import React from 'react';
import { EvaluationCriteriaBreakdown } from '../types';
import { CheckCircle2, ShieldCheck, Sparkles, BookOpen, PenTool } from 'lucide-react';

interface CriteriaBreakdownProps {
  breakdown: EvaluationCriteriaBreakdown;
  className?: string;
}

const criteriaConfig = [
  {
    key: 'factualAccuracy' as const,
    label: 'Factual & Technical Accuracy',
    description: 'Soundness of core facts, equations, and definitions',
    icon: ShieldCheck,
  },
  {
    key: 'conceptualDepth' as const,
    label: 'Conceptual Reasoning & Depth',
    description: 'Explanation of underlying mechanisms and logic',
    icon: Sparkles,
  },
  {
    key: 'keywordCoverage' as const,
    label: 'Key Terminology & Concepts',
    description: 'Inclusion of expected syllabus keywords and principles',
    icon: BookOpen,
  },
  {
    key: 'clarityAndStructure' as const,
    label: 'Clarity, Coherence & Flow',
    description: 'Logical organization, step-by-step layout and readability',
    icon: CheckCircle2,
  },
  {
    key: 'languageAndGrammar' as const,
    label: 'Language, Tone & Presentation',
    description: 'Clarity of academic expression and neatness',
    icon: PenTool,
  },
];

const CriteriaBreakdown: React.FC<CriteriaBreakdownProps> = ({ breakdown, className = '' }) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {criteriaConfig.map(({ key, label, description, icon: Icon }) => {
        const score = breakdown[key] || 0;
        const percentage = Math.min(Math.round((score / 10) * 100), 100);

        return (
          <div
            key={key}
            className="p-4 rounded-xl border transition bg-neutral-50 border-neutral-200 text-black dark:bg-neutral-900/60 dark:border-neutral-800 dark:text-white"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg border bg-white border-neutral-300 text-black dark:bg-neutral-800 dark:border-neutral-700 dark:text-white">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">{label}</h4>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">{description}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-base font-black font-mono">{score.toFixed(1)}</span>
                <span className="text-xs text-neutral-500 font-mono"> / 10</span>
              </div>
            </div>

            {/* Progress Track */}
            <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-black dark:bg-white rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CriteriaBreakdown;
