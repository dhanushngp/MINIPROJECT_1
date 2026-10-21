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
    color: 'from-emerald-500 to-teal-400',
    barColor: 'bg-emerald-500',
    textColor: 'text-emerald-400',
  },
  {
    key: 'conceptualDepth' as const,
    label: 'Conceptual Reasoning & Depth',
    description: 'Explanation of underlying mechanisms and logic',
    icon: Sparkles,
    color: 'from-blue-500 to-cyan-400',
    barColor: 'bg-blue-500',
    textColor: 'text-blue-400',
  },
  {
    key: 'keywordCoverage' as const,
    label: 'Key Terminology & Concepts',
    description: 'Inclusion of expected syllabus keywords and principles',
    icon: BookOpen,
    color: 'from-indigo-500 to-purple-400',
    barColor: 'bg-indigo-500',
    textColor: 'text-indigo-400',
  },
  {
    key: 'clarityAndStructure' as const,
    label: 'Clarity, Coherence & Flow',
    description: 'Logical organization, step-by-step layout and readability',
    icon: CheckCircle2,
    color: 'from-amber-500 to-orange-400',
    barColor: 'bg-amber-500',
    textColor: 'text-amber-400',
  },
  {
    key: 'languageAndGrammar' as const,
    label: 'Language, Tone & Presentation',
    description: 'Clarity of academic expression and neatness',
    icon: PenTool,
    color: 'from-pink-500 to-rose-400',
    barColor: 'bg-pink-500',
    textColor: 'text-pink-400',
  },
];

const CriteriaBreakdown: React.FC<CriteriaBreakdownProps> = ({ breakdown, className = '' }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {criteriaConfig.map(({ key, label, description, icon: Icon, barColor, textColor }) => {
        const score = breakdown[key] || 0;
        const percentage = Math.min(Math.round((score / 10) * 100), 100);

        return (
          <div key={key} className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className={`p-1.5 rounded-lg bg-slate-800 ${textColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-200">{label}</h4>
                  <p className="text-xs text-slate-400">{description}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-base font-bold font-mono ${textColor}`}>{score.toFixed(1)}</span>
                <span className="text-xs text-slate-500 font-mono"> / 10</span>
              </div>
            </div>

            {/* Progress Track */}
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full ${barColor} rounded-full transition-all duration-1000 ease-out`}
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
