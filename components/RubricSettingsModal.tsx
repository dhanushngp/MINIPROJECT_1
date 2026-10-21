import React from 'react';
import { EvaluationSettings } from '../types';
import { Sliders, X, BookOpen, GraduationCap, FileText, CheckCircle2 } from 'lucide-react';

interface RubricSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: EvaluationSettings;
  onUpdateSettings: (newSettings: EvaluationSettings) => void;
}

const subjectsList = [
  'Computer Science & Engineering',
  'Physics & Applied Sciences',
  'Chemistry & Materials',
  'Biology & Life Sciences',
  'Mathematics & Statistics',
  'Mechanical & Civil Engineering',
  'Electrical & Electronics Engineering',
  'History & Humanities',
  'Literature & Languages',
  'General Descriptive'
];

const RubricSettingsModal: React.FC<RubricSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm view-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative text-slate-200 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/30">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Exam &amp; Evaluation Options</h3>
            <p className="text-xs text-slate-400">Customize grading rubrics, subject domain, and answer key matching</p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Student Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Student Name
              </label>
              <input
                type="text"
                value={settings.studentName}
                onChange={(e) => onUpdateSettings({ ...settings, studentName: e.target.value })}
                placeholder="e.g. Dhanush S."
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Roll No / Student ID
              </label>
              <input
                type="text"
                value={settings.studentRoll}
                onChange={(e) => onUpdateSettings({ ...settings, studentRoll: e.target.value })}
                placeholder="e.g. CS2026-8841"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Subject Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-blue-400" /> Subject Domain
            </label>
            <select
              value={settings.subject}
              onChange={(e) => onUpdateSettings({ ...settings, subject: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {subjectsList.map(subj => (
                <option key={subj} value={subj}>{subj}</option>
              ))}
            </select>
          </div>

          {/* Rubric Strictness */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-400" /> Evaluation Strictness &amp; Rubric
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                {
                  id: 'strict' as const,
                  title: 'Strict Mode',
                  desc: 'Board / Competitive. Deducts for omissions and vagueness.',
                  color: 'border-red-500/50 bg-red-950/20 text-red-300'
                },
                {
                  id: 'balanced' as const,
                  title: 'Balanced',
                  desc: 'Standard University. Balanced facts, logic, and structure.',
                  color: 'border-blue-500/50 bg-blue-950/20 text-blue-300'
                },
                {
                  id: 'generous' as const,
                  title: 'Generous',
                  desc: 'Formative / School. Focuses on ideas, rewards effort.',
                  color: 'border-emerald-500/50 bg-emerald-950/20 text-emerald-300'
                }
              ].map(rubric => {
                const isSelected = settings.rubric === rubric.id;
                return (
                  <button
                    key={rubric.id}
                    type="button"
                    onClick={() => onUpdateSettings({ ...settings, rubric: rubric.id })}
                    className={`p-3 text-left rounded-xl border transition-all duration-200 ${
                      isSelected
                        ? `${rubric.color} ring-2 ring-blue-500 shadow-lg`
                        : 'border-slate-700 bg-slate-950/60 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm text-white">{rubric.title}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                    </div>
                    <p className="text-xs text-slate-400 leading-snug">{rubric.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Teacher's Reference Answer Key */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                Teacher's Reference Answer Key (Optional)
              </span>
              <span className="text-[11px] text-slate-500 font-normal">Leaves blank for automatic AI evaluation</span>
            </label>
            <textarea
              rows={4}
              value={settings.referenceAnswerKey}
              onChange={(e) => onUpdateSettings({ ...settings, referenceAnswerKey: e.target.value })}
              placeholder="Paste key expected points, formulas, or marking scheme to evaluate against... (e.g. Q1: Must include virtual-to-physical translation, TLB role, and LRU page replacement algorithm)."
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed font-mono"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition shadow-lg shadow-blue-600/30"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default RubricSettingsModal;
