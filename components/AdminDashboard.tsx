import React, { useState } from 'react';
import { User, EvaluationResult } from '../types';
import { Users, Award, BookOpen, Download, Search, ArrowRight, ShieldCheck, TrendingUp, CheckCircle2, AlertTriangle, Key } from 'lucide-react';

interface AdminDashboardProps {
  onLogout: () => void;
  onSwitchView: () => void;
  users: User[];
  onOpenSettings: () => void;
  onInspectResult?: (result: EvaluationResult) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onLogout,
  onSwitchView,
  users,
  onOpenSettings,
  onInspectResult
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Calculate Aggregates
  const totalUsers = users.length;
  let totalEvaluations = 0;
  let scoreSum = 0;
  let passCount = 0;

  users.forEach((u) => {
    if (u.history) {
      totalEvaluations += u.history.length;
      u.history.forEach((h) => {
        scoreSum += h.score;
        if (h.score >= 5.0) passCount++;
      });
    }
  });

  const avgScore = totalEvaluations > 0 ? (scoreSum / totalEvaluations).toFixed(1) : '0.0';
  const passRate = totalEvaluations > 0 ? Math.round((passCount / totalEvaluations) * 100) : 100;

  const filteredUsers = users.filter((u) =>
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportAllCsv = () => {
    const headers = ['User Email', 'Evaluation ID', 'Subject', 'Score', 'Max Marks', 'Date', 'Feedback Summary'];
    const rows: (string | number)[][] = [];

    users.forEach((u) => {
      if (u.history) {
        u.history.forEach((h) => {
          rows.push([
            u.email,
            h.id,
            `"${h.subject.replace(/"/g, '""')}"`,
            h.score,
            h.maxScore || 10,
            h.timestamp,
            `"${h.feedbackSummary.replace(/"/g, '""')}"`
          ]);
        });
      }
    });

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `All_Students_Evaluation_MasterReport_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 text-white view-fade-in">
      {/* Top Header */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-6 shadow-2xl mb-6 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight">Executive Academic Portal</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  CEO / Administrator
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Centralized evaluation monitoring, gradebook analytics, and model management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenSettings}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition border border-slate-700"
            >
              <Key className="w-3.5 h-3.5 text-blue-400" />
              API Settings
            </button>
            <button
              onClick={onSwitchView}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition shadow-lg shadow-blue-600/20"
            >
              Go to Evaluator
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-red-600 hover:text-white rounded-xl transition border border-slate-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Aggregate Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Registered Students</span>
            <h3 className="text-xl font-bold font-mono text-white">{totalUsers}</h3>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Total Evaluated Papers</span>
            <h3 className="text-xl font-bold font-mono text-white">{totalEvaluations}</h3>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Class Average Score</span>
            <h3 className="text-xl font-bold font-mono text-white">{avgScore} <span className="text-xs text-slate-500">/ 10</span></h3>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Overall Pass Rate</span>
            <h3 className="text-xl font-bold font-mono text-white">{passRate}%</h3>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
          <div>
            <h3 className="text-lg font-bold text-white">Student Enrollment &amp; Activity Log</h3>
            <p className="text-xs text-slate-400">Detailed submissions, evaluation history, and student records</p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search students..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={handleExportAllCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/40 rounded-xl transition border border-emerald-800/50 shrink-0"
              title="Export all records to CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* User Table */}
        <div className="overflow-x-auto border border-slate-800 rounded-xl">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="text-[11px] text-slate-400 uppercase bg-slate-950/80 border-b border-slate-800 font-semibold tracking-wider">
              <tr>
                <th scope="col" className="px-5 py-3">#</th>
                <th scope="col" className="px-5 py-3">Student Email</th>
                <th scope="col" className="px-5 py-3">Submissions</th>
                <th scope="col" className="px-5 py-3">Recent Performance</th>
                <th scope="col" className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => {
                  const evalCount = user.history?.length || 0;
                  const lastEval = evalCount > 0 ? user.history![evalCount - 1] : null;

                  return (
                    <tr key={index} className="hover:bg-slate-800/40 transition">
                      <td className="px-5 py-3.5 font-mono text-slate-500">{index + 1}</td>
                      <td className="px-5 py-3.5 font-medium text-white">{user.email}</td>
                      <td className="px-5 py-3.5 font-mono">
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                          {evalCount} papers
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        {lastEval ? (
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono ${
                              lastEval.score >= 8 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                              lastEval.score >= 6 ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                              'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}>
                              {lastEval.score.toFixed(1)}/10
                            </span>
                            <span className="text-slate-400 truncate max-w-[150px]">{lastEval.subject}</span>
                          </div>
                        ) : (
                          <span className="italic text-slate-500">No submissions yet</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {evalCount > 0 && lastEval && onInspectResult && (
                          <button
                            type="button"
                            onClick={() => onInspectResult(lastEval.fullResult)}
                            className="text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center gap-1 hover:underline"
                          >
                            Inspect Last Paper <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-slate-500">
                    No registered student records match the search filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;