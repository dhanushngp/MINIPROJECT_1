import React, { useState, useEffect } from 'react';
import { EvaluationResult, QAPair } from '../types';
import confetti from 'canvas-confetti';
import {
  Download,
  Printer,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  FileText,
  Eye,
  Sliders,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  FileJson,
  FileSpreadsheet,
  Award,
  BookOpen
} from 'lucide-react';
import SpeechSynthesisButton from './SpeechSynthesisButton';
import DocumentViewer from './DocumentViewer';
import CriteriaBreakdown from './CriteriaBreakdown';
import StreamedText from './StreamedText';
import {
  exportEvaluationToPdf,
  exportEvaluationToJson,
  exportEvaluationToCsv,
  generateMarkdownSummary
} from '../services/exportService';

interface ResultsViewProps {
  result: EvaluationResult;
  onReset: () => void;
}

const ScoreCircle: React.FC<{ score: number; grade: string; percentage: number }> = ({
  score,
  grade,
  percentage
}) => {
  const circumference = 2 * Math.PI * 45;
  const [strokeDashoffset, setStrokeDashoffset] = useState(circumference);

  useEffect(() => {
    const finalOffset = circumference - (percentage / 100) * circumference;
    const timer = setTimeout(() => setStrokeDashoffset(finalOffset), 120);
    return () => clearTimeout(timer);
  }, [percentage, circumference]);

  let strokeColor = 'stroke-emerald-400';
  let badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
  if (score < 7.5) {
    strokeColor = 'stroke-blue-400';
    badgeColor = 'bg-blue-500/20 text-blue-300 border-blue-500/30';
  }
  if (score < 6) {
    strokeColor = 'stroke-amber-400';
    badgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
  }
  if (score < 4) {
    strokeColor = 'stroke-rose-500';
    badgeColor = 'bg-rose-500/20 text-rose-300 border-rose-500/30';
  }

  return (
    <div className="relative w-44 h-44 shrink-0">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle
          className="text-slate-800"
          strokeWidth="8"
          stroke="currentColor"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
        />
        <circle
          className={`${strokeColor} transition-all duration-1000 ease-out`}
          strokeWidth="8"
          strokeDasharray={circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold text-white font-mono">{score.toFixed(1)}</span>
        <span className="text-xs text-slate-400 font-mono">out of 10</span>
        <span className={`mt-1 px-2.5 py-0.5 text-xs font-bold rounded-full border ${badgeColor}`}>
          Grade {grade} • {percentage}%
        </span>
      </div>
    </div>
  );
};

const QACard: React.FC<{ qa: QAPair; index: number }> = ({ qa, index }) => {
  const [showModelAnswer, setShowModelAnswer] = useState(false);

  let scoreBadgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
  if (qa.score < 7.5) scoreBadgeColor = 'bg-blue-500/20 text-blue-300 border-blue-500/30';
  if (qa.score < 6) scoreBadgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
  if (qa.score < 4) scoreBadgeColor = 'bg-rose-500/20 text-rose-300 border-rose-500/30';

  return (
    <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-6 mb-4 shadow-xl hover:border-slate-600 transition-all duration-200">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs border border-blue-500/30">
            {qa.questionNumber || index + 1}
          </span>
          <h4 className="font-semibold text-white text-base">Question {qa.questionNumber || index + 1}</h4>
        </div>

        <div className="flex items-center gap-2">
          <SpeechSynthesisButton
            text={`Question ${index + 1}. Score: ${qa.score} out of ${qa.maxMarks || 10}. Feedback: ${qa.feedback}`}
            label="Listen"
          />
          <span className={`px-3 py-1 text-xs font-bold rounded-full border font-mono ${scoreBadgeColor}`}>
            Score: {qa.score} / {qa.maxMarks || 10}
          </span>
        </div>
      </div>

      <div className="space-y-4 text-xs">
        {/* Identified Question */}
        <div>
          <span className="font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Question Identified:
          </span>
          <p className="text-slate-200 bg-slate-950/80 p-3 rounded-xl border border-slate-800 leading-relaxed font-medium">
            {qa.question}
          </p>
        </div>

        {/* Student's Answer */}
        <div>
          <span className="font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Student's Handwritten Answer:
          </span>
          <p className="text-slate-300 bg-slate-950/80 p-3 rounded-xl border border-slate-800 leading-relaxed font-mono">
            {qa.answer}
          </p>
        </div>

        {/* AI Feedback */}
        <div>
          <span className="font-semibold text-slate-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            Examiner Feedback &amp; Analysis:
          </span>
          <StreamedText text={qa.feedback} />
        </div>

        {/* Key Concepts Pills */}
        {((qa.keyConceptsCovered && qa.keyConceptsCovered.length > 0) ||
          (qa.missingKeyConcepts && qa.missingKeyConcepts.length > 0)) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {qa.keyConceptsCovered && qa.keyConceptsCovered.length > 0 && (
              <div className="bg-emerald-950/20 p-3 rounded-xl border border-emerald-900/30">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1 mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Key Concepts Included:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {qa.keyConceptsCovered.map((c, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[11px]">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {qa.missingKeyConcepts && qa.missingKeyConcepts.length > 0 && (
              <div className="bg-amber-950/20 p-3 rounded-xl border border-amber-900/30">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1 mb-2">
                  <AlertCircle className="w-3.5 h-3.5" /> Missing Concepts to Improve:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {qa.missingKeyConcepts.map((c, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[11px]">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Ideal Model Answer Accordion */}
        {qa.idealModelAnswer && (
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowModelAnswer(!showModelAnswer)}
              className="flex items-center justify-between w-full p-2.5 rounded-xl bg-blue-950/30 hover:bg-blue-950/50 border border-blue-900/40 text-blue-300 text-xs font-semibold transition"
            >
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                {showModelAnswer ? 'Hide Ideal 10/10 Model Answer' : 'View Ideal 10/10 Model Answer'}
              </span>
              {showModelAnswer ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showModelAnswer && (
              <div className="mt-2 p-3.5 rounded-xl bg-slate-950/90 border border-blue-500/30 text-slate-200 leading-relaxed font-sans view-fade-in text-xs">
                <p className="font-semibold text-blue-400 mb-1">Standard Full-Marks Benchmark:</p>
                <p>{qa.idealModelAnswer}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const ResultsView: React.FC<ResultsViewProps> = ({ result, onReset }) => {
  const [activeTab, setActiveTab] = useState<'breakdown' | 'document' | 'rubric' | 'strengths' | 'modelAnswers'>('breakdown');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // If the student did well (>= 8.0/10), celebrate with confetti!
    if (result.overallScore >= 8.0) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'],
      });
    }
  }, [result.overallScore]);

  const handleCopyMarkdown = () => {
    const md = generateMarkdownSummary(result);
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-2 sm:p-4 view-fade-in text-slate-200">
      {/* Top Banner / Breadcrumb & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-slate-900/80 p-4 rounded-2xl border border-slate-700/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">AI Evaluation Report</h2>
            <p className="text-xs text-slate-400">
              Student: <strong className="text-slate-200">{result.studentName || 'Student'}</strong> ({result.studentRoll || 'N/A'}) • {result.subject}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => exportEvaluationToPdf(result)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition shadow-lg shadow-blue-600/20"
            title="Download printable PDF Report"
          >
            <Download className="w-3.5 h-3.5" /> PDF Report
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition border border-slate-700"
            title="Print sheet"
          >
            <Printer className="w-3.5 h-3.5" /> Print
          </button>

          <button
            type="button"
            onClick={handleCopyMarkdown}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition border border-slate-700"
            title="Copy summary to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>

          <button
            type="button"
            onClick={() => exportEvaluationToCsv(result)}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition border border-slate-700"
            title="Export CSV gradebook"
          >
            <FileSpreadsheet className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => exportEvaluationToJson(result)}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition border border-slate-700"
            title="Export raw JSON"
          >
            <FileJson className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition border border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" /> New Paper
          </button>
        </div>
      </div>

      {/* Main Score & Summary Card */}
      <div className="bg-gradient-to-br from-slate-900/90 via-slate-900/95 to-slate-950 p-6 md:p-8 rounded-2xl border border-slate-700/80 shadow-2xl mb-6">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <ScoreCircle
            score={result.overallScore}
            grade={result.grade}
            percentage={result.percentage}
          />

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-600/20 text-blue-300 border border-blue-500/30">
                {result.subject}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 capitalize">
                Rubric: {result.evaluationMode}
              </span>
              <span className="text-xs text-slate-400">{result.evaluationDate}</span>
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">Overall Evaluation Summary</h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              {result.generalFeedback}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <SpeechSynthesisButton
                text={`Overall Evaluation Summary. Score: ${result.overallScore} out of 10. Grade ${result.grade}. ${result.generalFeedback}`}
                label="Listen to Examiner Audio"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 border-b border-slate-800 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('breakdown')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl transition ${
            activeTab === 'breakdown'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Question Analysis ({result.evaluations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('document')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl transition ${
            activeTab === 'document'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Document &amp; OCR</span>
        </button>

        <button
          onClick={() => setActiveTab('rubric')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl transition ${
            activeTab === 'rubric'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>5-Criteria Rubric</span>
        </button>

        <button
          onClick={() => setActiveTab('strengths')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl transition ${
            activeTab === 'strengths'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Strengths &amp; Improvements</span>
        </button>

        <button
          onClick={() => setActiveTab('modelAnswers')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl transition ${
            activeTab === 'modelAnswers'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Full Model Answers</span>
        </button>
      </div>

      {/* Tab 1: Detailed Question Analysis */}
      {activeTab === 'breakdown' && (
        <div className="view-fade-in">
          {result.evaluations.map((qa, index) => (
            <QACard key={index} qa={qa} index={index} />
          ))}
        </div>
      )}

      {/* Tab 2: Document & Handwriting Preview */}
      {activeTab === 'document' && (
        <div className="view-fade-in">
          <DocumentViewer
            previewUrl={result.documentPreviewUrl}
            filename={result.documentName}
            extractedText={result.extractedFullText}
          />
        </div>
      )}

      {/* Tab 3: 5-Criteria Rubric Breakdown */}
      {activeTab === 'rubric' && (
        <div className="view-fade-in bg-slate-900/90 p-6 rounded-2xl border border-slate-700/80">
          <div className="mb-4">
            <h4 className="text-lg font-bold text-white">Multi-Dimensional Evaluation Radar</h4>
            <p className="text-xs text-slate-400">
              Graded independently on accuracy, depth, keywords, logical coherence, and presentation.
            </p>
          </div>
          <CriteriaBreakdown breakdown={result.criteriaBreakdown} />
        </div>
      )}

      {/* Tab 4: Strengths & Weaknesses */}
      {activeTab === 'strengths' && (
        <div className="view-fade-in grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900/90 border border-emerald-900/40 p-6 rounded-2xl">
            <h4 className="text-base font-bold text-emerald-400 flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5" /> Demonstrated Strengths
            </h4>
            <ul className="space-y-3">
              {result.strengths.map((s, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-900/90 border border-amber-900/40 p-6 rounded-2xl">
            <h4 className="text-base font-bold text-amber-400 flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5" /> Recommended Improvements
            </h4>
            <ul className="space-y-3">
              {result.areasForImprovement.map((a, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Tab 5: Complete Model Answer Sheet */}
      {activeTab === 'modelAnswers' && (
        <div className="view-fade-in space-y-4">
          <div className="bg-slate-900/90 p-4 rounded-xl border border-blue-500/30 text-xs text-blue-300">
            Below is the teacher's model answer key generated by the AI to demonstrate how to score 10/10 for each question.
          </div>
          {result.evaluations.map((qa, idx) => (
            <div key={idx} className="bg-slate-900/90 border border-slate-700/80 p-5 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded bg-blue-600/20 text-blue-400 font-bold text-xs">
                  Q{qa.questionNumber || idx + 1}
                </span>
                <h5 className="font-semibold text-white text-sm">{qa.question}</h5>
              </div>
              <div className="mt-3 p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-200 leading-relaxed">
                <p className="font-semibold text-emerald-400 mb-1">Ideal Model Answer (10/10):</p>
                <p>{qa.idealModelAnswer || 'Standard model answer covering core definitions, equations, and applications.'}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom CTA */}
      <div className="text-center mt-8">
        <button
          onClick={onReset}
          className="px-8 py-3.5 font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition shadow-xl shadow-blue-600/30 hover:scale-105 transform duration-200"
        >
          Evaluate Another Document
        </button>
      </div>
    </div>
  );
};

export default ResultsView;