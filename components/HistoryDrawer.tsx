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
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm view-fade-in">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-700/80 h-full p-6 flex flex-col shadow-2xl relative text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Evaluation History</h3>
              <p className="text-xs text-slate-400">{history.length} past evaluations recorded</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="my-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by subject, student, or grade..."
              className="w-full pl-9 pr-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-blue-500/60 hover:bg-slate-800/40 transition cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors truncate max-w-[200px]">
                      {item.subject}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono ${
                    item.score >= 8 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    item.score >= 6 ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                    'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {item.score.toFixed(1)}/10
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 line-clamp-1 mb-2">
                  {item.documentName} • {item.fullResult.studentName || 'Student'}
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1.5 border-t border-slate-800/60">
                  <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteHistoryItem(item.id);
                      }}
                      className="text-slate-500 hover:text-red-400 transition"
                      title="Delete record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-blue-400 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                      Open <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-slate-500">
              <Award className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-xs">No evaluation history found</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-xs">
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Are you sure you want to clear your entire evaluation history?")) {
                  onClearHistory();
                }
              }}
              className="text-red-400 hover:text-red-300 transition flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All History
            </button>
            <span className="text-slate-500">{history.length} records</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryDrawer;
