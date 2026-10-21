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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm view-fade-in text-black dark:text-white">
      <div className="rounded-2xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto border bg-white border-neutral-300 dark:bg-neutral-900 dark:border-neutral-800">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-black dark:hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl border bg-neutral-100 border-neutral-300 text-black dark:bg-neutral-800 dark:border-neutral-700 dark:text-white">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black">Exam &amp; Evaluation Options</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Customize grading rubrics, subject domain, and answer key matching</p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Student Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-neutral-600 dark:text-neutral-400">
                Student Name
              </label>
              <input
                type="text"
                value={settings.studentName}
                onChange={(e) => onUpdateSettings({ ...settings, studentName: e.target.value })}
                placeholder="e.g. Dhanush S."
                className="w-full px-3.5 py-2.5 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-neutral-50 border-neutral-300 text-black dark:bg-neutral-950 dark:border-neutral-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-neutral-600 dark:text-neutral-400">
                Roll No / Student ID
              </label>
              <input
                type="text"
                value={settings.studentRoll}
                onChange={(e) => onUpdateSettings({ ...settings, studentRoll: e.target.value })}
                placeholder="e.g. CS2026-8841"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-neutral-50 border-neutral-300 text-black dark:bg-neutral-950 dark:border-neutral-700 dark:text-white"
              />
            </div>
          </div>

          {/* Subject Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400">
              <BookOpen className="w-3.5 h-3.5 text-neutral-500" /> Subject Domain
            </label>
            <select
              value={settings.subject}
              onChange={(e) => onUpdateSettings({ ...settings, subject: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white font-medium bg-neutral-50 border-neutral-300 text-black dark:bg-neutral-950 dark:border-neutral-700 dark:text-white"
            >
              {subjectsList.map(subj => (
                <option key={subj} value={subj}>{subj}</option>
              ))}
            </select>
          </div>

          {/* Rubric Strictness */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400">
              <GraduationCap className="w-3.5 h-3.5 text-neutral-500" /> Evaluation Strictness &amp; Rubric
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                {
                  id: 'strict' as const,
                  title: 'Strict Mode',
                  desc: 'Board / Competitive. Deducts for omissions and vagueness.',
                },
                {
                  id: 'balanced' as const,
                  title: 'Balanced',
                  desc: 'Standard University. Balanced facts, logic, and structure.',
                },
                {
                  id: 'generous' as const,
                  title: 'Generous',
                  desc: 'Formative / School. Focuses on ideas, rewards effort.',
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
                        ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-md'
                        : 'border-neutral-300 bg-neutral-50 text-neutral-600 hover:border-black dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400 dark:hover:border-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm">{rubric.title}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                    <p className="text-xs opacity-80 leading-snug">{rubric.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Teacher's Reference Answer Key */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center justify-between text-neutral-600 dark:text-neutral-400">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-neutral-500" />
                Teacher's Reference Answer Key (Optional)
              </span>
              <span className="text-[11px] font-normal text-neutral-400">Leave blank for automatic AI evaluation</span>
            </label>
            <textarea
              rows={4}
              value={settings.referenceAnswerKey}
              onChange={(e) => onUpdateSettings({ ...settings, referenceAnswerKey: e.target.value })}
              placeholder="Paste key expected points, formulas, or marking scheme to evaluate against... (e.g. Q1: Must include virtual-to-physical translation, TLB role, and LRU page replacement algorithm)."
              className="w-full px-3.5 py-2.5 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white leading-relaxed font-mono bg-neutral-50 border-neutral-300 text-black placeholder-neutral-400 dark:bg-neutral-950 dark:border-neutral-700 dark:text-white"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-xs font-bold rounded-xl transition shadow-md bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default RubricSettingsModal;
