import React, { useState } from 'react';
import { User, EvaluationResult } from '../types';
import { Users, Award, BookOpen, Download, Search, ArrowRight, ShieldCheck, TrendingUp, Key } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface AdminDashboardProps {
  onLogout: () => void;
  onSwitchView: () => void;
  users: User[];
  onOpenSettings: () => void;
  onInspectResult?: (result: EvaluationResult) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onLogout,
  onSwitchView,
  users,
  onOpenSettings,
  onInspectResult,
  theme,
  onToggleTheme
}) => {
  const [searchTerm, setSearchTerm] = useState('');

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
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 text-black dark:text-white view-fade-in">
      {/* Top Header */}
      <div className="border rounded-2xl p-6 shadow-xl mb-6 bg-white border-neutral-200 dark:bg-neutral-900/90 dark:border-neutral-800">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl border bg-neutral-100 border-neutral-300 text-black dark:bg-neutral-800 dark:border-neutral-700 dark:text-white">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight">Executive Academic Portal</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold border bg-neutral-100 text-black border-neutral-300 dark:bg-neutral-800 dark:text-white dark:border-neutral-700">
                  CEO / Administrator
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                Centralized evaluation monitoring, gradebook analytics, and model management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <ThemeToggle theme={theme} onToggleTheme={onToggleTheme} />
            <button
              onClick={onOpenSettings}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition border bg-neutral-100 text-black border-neutral-300 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-white dark:border-neutral-700 dark:hover:bg-neutral-700"
            >
              <Key className="w-3.5 h-3.5" />
              API Settings
            </button>
            <button
              onClick={onSwitchView}
              className="px-4 py-2 text-xs font-bold rounded-xl transition shadow-md bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
            >
              Go to Evaluator
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2 text-xs font-bold rounded-xl transition border bg-neutral-100 text-black border-neutral-300 hover:bg-black hover:text-white dark:bg-neutral-800 dark:text-white dark:border-neutral-700 dark:hover:bg-white dark:hover:text-black"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Aggregate Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="border p-4 rounded-2xl flex items-center gap-3.5 bg-white border-neutral-200 dark:bg-neutral-900/80 dark:border-neutral-800 shadow-sm">
          <div className="p-3 rounded-xl border bg-neutral-100 border-neutral-300 text-black dark:bg-neutral-800 dark:border-neutral-700 dark:text-white">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-medium text-neutral-500">Registered Students</span>
            <h3 className="text-xl font-black font-mono">{totalUsers}</h3>
          </div>
        </div>

        <div className="border p-4 rounded-2xl flex items-center gap-3.5 bg-white border-neutral-200 dark:bg-neutral-900/80 dark:border-neutral-800 shadow-sm">
          <div className="p-3 rounded-xl border bg-neutral-100 border-neutral-300 text-black dark:bg-neutral-800 dark:border-neutral-700 dark:text-white">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-medium text-neutral-500">Evaluated Papers</span>
            <h3 className="text-xl font-black font-mono">{totalEvaluations}</h3>
          </div>
        </div>

        <div className="border p-4 rounded-2xl flex items-center gap-3.5 bg-white border-neutral-200 dark:bg-neutral-900/80 dark:border-neutral-800 shadow-sm">
          <div className="p-3 rounded-xl border bg-neutral-100 border-neutral-300 text-black dark:bg-neutral-800 dark:border-neutral-700 dark:text-white">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-medium text-neutral-500">Class Average Score</span>
            <h3 className="text-xl font-black font-mono">{avgScore} <span className="text-xs text-neutral-400">/ 10</span></h3>
          </div>
        </div>

        <div className="border p-4 rounded-2xl flex items-center gap-3.5 bg-white border-neutral-200 dark:bg-neutral-900/80 dark:border-neutral-800 shadow-sm">
          <div className="p-3 rounded-xl border bg-neutral-100 border-neutral-300 text-black dark:bg-neutral-800 dark:border-neutral-700 dark:text-white">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-medium text-neutral-500">Overall Pass Rate</span>
            <h3 className="text-xl font-black font-mono">{passRate}%</h3>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="border rounded-2xl p-6 shadow-xl bg-white border-neutral-200 dark:bg-neutral-900/90 dark:border-neutral-800">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
          <div>
            <h3 className="text-lg font-black">Student Enrollment &amp; Activity Log</h3>
            <p className="text-xs text-neutral-500">Detailed submissions, evaluation history, and student records</p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 pointer-events-none text-neutral-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search students..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-neutral-50 border-neutral-300 text-black placeholder-neutral-400 dark:bg-neutral-950 dark:border-neutral-700 dark:text-white"
              />
            </div>

            <button
              onClick={handleExportAllCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition border shadow-sm shrink-0 bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
              title="Export all records to CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* User Table */}
        <div className="overflow-x-auto border rounded-xl border-neutral-200 dark:border-neutral-800">
          <table className="w-full text-xs text-left">
            <thead className="text-[11px] uppercase font-bold tracking-wider border-b bg-neutral-100 border-neutral-200 text-neutral-600 dark:bg-neutral-950 dark:border-neutral-800 dark:text-neutral-400">
              <tr>
                <th scope="col" className="px-5 py-3">#</th>
                <th scope="col" className="px-5 py-3">Student Email</th>
                <th scope="col" className="px-5 py-3">Submissions</th>
                <th scope="col" className="px-5 py-3">Recent Performance</th>
                <th scope="col" className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => {
                  const evalCount = user.history?.length || 0;
                  const lastEval = evalCount > 0 ? user.history![evalCount - 1] : null;

                  return (
                    <tr key={index} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition">
                      <td className="px-5 py-3.5 font-mono text-neutral-400">{index + 1}</td>
                      <td className="px-5 py-3.5 font-bold">{user.email}</td>
                      <td className="px-5 py-3.5 font-mono">
                        <span className="px-2 py-0.5 rounded-full border bg-neutral-100 border-neutral-300 text-black dark:bg-neutral-800 dark:border-neutral-700 dark:text-white font-bold">
                          {evalCount} papers
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        {lastEval ? (
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold font-mono border bg-neutral-100 text-black border-neutral-300 dark:bg-neutral-800 dark:text-white dark:border-neutral-700">
                              {lastEval.score.toFixed(1)}/10
                            </span>
                            <span className="truncate max-w-[150px] text-neutral-500">{lastEval.subject}</span>
                          </div>
                        ) : (
                          <span className="italic text-neutral-400">No submissions yet</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {evalCount > 0 && lastEval && onInspectResult && (
                          <button
                            type="button"
                            onClick={() => onInspectResult(lastEval.fullResult)}
                            className="font-bold inline-flex items-center gap-1 hover:underline text-black dark:text-white"
                          >
                            Inspect Paper <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-neutral-400">
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