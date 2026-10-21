import React, { useState } from 'react';
import { EvaluationHistoryItem, EvaluationResult } from '../types';
import { Clock, X, Search, Trash2, ArrowUpRight, Award, BookOpen } from 'lucide-react';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: EvaluationHistoryItem[];
  onSelectResult: (result: EvaluationResult) => void;
  onClearHistory: () => void;
  onDeleteHistoryItem: (id: string) => void;
}

const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectResult,
  onClearHistory,
  onDeleteHistoryItem
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filteredHistory = history.filter((item) => {
    const q = search.toLowerCase();
    return (
      item.subject.toLowerCase().includes(q) ||
      item.documentName.toLowerCase().includes(q) ||
      item.feedbackSummary.toLowerCase().includes(q) ||
      item.grade.toLowerCase().includes(q) ||
      (item.fullResult.studentName || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm view-fade-in text-black dark:text-white">
      <div className="w-full max-w-md h-full p-6 flex flex-col shadow-2xl relative border-l bg-white border-neutral-300 dark:bg-neutral-950 dark:border-neutral-800">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl border bg-neutral-100 border-neutral-300 text-black dark:bg-neutral-900 dark:border-neutral-700 dark:text-white">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base">Evaluation History</h3>
              <p className="text-xs text-neutral-500">{history.length} past evaluations recorded</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-black dark:hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="my-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 pointer-events-none text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by subject, student, or grade..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-neutral-50 border-neutral-300 text-black placeholder-neutral-400 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {filteredHistory.length > 0 ? (
            filteredHistory.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectResult(item.fullResult);
                  onClose();
                }}
                className="p-3.5 rounded-xl border transition cursor-pointer group bg-neutral-50 border-neutral-200 hover:border-black dark:bg-neutral-900/80 dark:border-neutral-800 dark:hover:border-white"
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-neutral-400" />
                    <span className="text-xs font-bold truncate max-w-[200px]">
                      {item.subject}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold font-mono border bg-white text-black border-neutral-300 dark:bg-neutral-950 dark:text-white dark:border-neutral-700">
                    {item.score.toFixed(1)}/10
                  </span>
                </div>

                <p className="text-[11px] text-neutral-500 line-clamp-1 mb-2">
                  {item.documentName} • {item.fullResult.studentName || 'Student'}
                </p>

                <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-neutral-200 dark:border-neutral-800 text-neutral-400">
                  <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteHistoryItem(item.id);
                      }}
                      className="hover:text-black dark:hover:text-white transition"
                      title="Delete record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform text-black dark:text-white">
                      Open <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-neutral-400">
              <Award className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-xs font-medium">No evaluation history found</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex justify-between items-center text-xs">
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Are you sure you want to clear your entire evaluation history?")) {
                  onClearHistory();
                }
              }}
              className="text-neutral-500 hover:text-black dark:hover:text-white font-bold transition flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All History
            </button>
            <span className="text-neutral-500">{history.length} records</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryDrawer;
