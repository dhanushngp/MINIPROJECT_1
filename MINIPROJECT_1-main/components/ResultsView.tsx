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
  BookOpen,
  Hash
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

  return (
    <div className="flex items-center gap-6">
      <div className="relative w-36 h-36 shrink-0">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle
            className="text-neutral-200 dark:text-neutral-800"
            strokeWidth="6"
            stroke="currentColor"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
          />
          <circle
            className="stroke-black dark:stroke-white transition-all duration-1000 ease-out"
            strokeWidth="6"
            strokeDasharray={circumference}
            style={{ strokeDashoffset }}
            strokeLinecap="square"
            stroke="currentColor"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
            transform="rotate(-90 50 50)"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
          <span className="text-3xl font-black">{score.toFixed(1)}</span>
          <span className="text-[10px] text-neutral-500 uppercase tracking-widest">/ 10.0</span>
        </div>
      </div>

      <div className="font-mono space-y-1">
        <div className="inline-block px-3 py-1 border-2 border-black dark:border-white font-black text-sm tracking-wider uppercase bg-white dark:bg-black">
          GRADE: {grade}
        </div>
        <p className="text-xs text-neutral-500 font-bold">SCORE: {percentage}%</p>
        <p className="text-[11px] text-neutral-400">BENCHMARK: {score >= 7.5 ? 'DISTINCTION' : score >= 5.0 ? 'SATISFACTORY' : 'NEEDS REVISION'}</p>
      </div>
    </div>
  );
};

const QACard: React.FC<{ qa: QAPair; index: number }> = ({ qa, index }) => {
  const [showModelAnswer, setShowModelAnswer] = useState(false);

  return (
    <div className="p-6 mb-4 border transition-all duration-150 crosshair-corner bg-white border-neutral-300 dark:bg-[#0c0c0c] dark:border-neutral-800 hover:border-black dark:hover:border-neutral-600">
      {/* QA Header Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-neutral-200 dark:border-neutral-800 font-mono">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 border text-xs font-bold border-black bg-black text-white dark:border-white dark:bg-white dark:text-black">
            #{qa.questionNumber || index + 1}
          </span>
          <h4 className="font-bold text-sm uppercase tracking-wide">
            QUESTION AUDIT ITEM {qa.questionNumber || index + 1}
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <SpeechSynthesisButton
            text={`Question ${index + 1}. Score: ${qa.score} out of ${qa.maxMarks || 10}. Feedback: ${qa.feedback}`}
            label="Listen"
          />
          <span className="px-3 py-0.5 text-xs font-mono font-bold border border-black dark:border-white bg-neutral-100 text-black dark:bg-neutral-900 dark:text-white">
            MARKS: {qa.score} / {qa.maxMarks || 10}
          </span>
        </div>
      </div>

      <div className="space-y-4 text-xs font-mono">
        {/* Identified Question */}
        <div>
          <span className="font-bold uppercase tracking-wider block mb-1 text-neutral-500 text-[10px]">
            [ 01 // IDENTIFIED QUESTION TEXT ]
          </span>
          <p className="p-3 border font-sans text-xs leading-relaxed font-bold bg-neutral-50 border-neutral-200 dark:bg-[#121212] dark:border-neutral-800 text-black dark:text-white">
            {qa.question}
          </p>
        </div>

        {/* Student's Answer */}
        <div>
          <span className="font-bold uppercase tracking-wider block mb-1 text-neutral-500 text-[10px]">
            [ 02 // TRANSCRIBED CANDIDATE RESPONSE ]
          </span>
          <p className="p-3 border text-xs leading-relaxed font-mono bg-neutral-50 border-neutral-200 text-neutral-800 dark:bg-[#121212] dark:border-neutral-800 dark:text-neutral-300">
            {qa.answer}
          </p>
        </div>

        {/* AI Feedback */}
        <div>
          <span className="font-bold uppercase tracking-wider block mb-1 text-neutral-500 text-[10px] flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-black dark:text-white" />
            [ 03 // EXAMINER CRITIQUE &amp; LOGICAL AUDIT ]
          </span>
          <StreamedText text={qa.feedback} />
        </div>

        {/* Key Concepts Pills */}
        {((qa.keyConceptsCovered && qa.keyConceptsCovered.length > 0) ||
          (qa.missingKeyConcepts && qa.missingKeyConcepts.length > 0)) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {qa.keyConceptsCovered && qa.keyConceptsCovered.length > 0 && (
              <div className="p-3 border border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-[#121212]">
                <span className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 mb-2 text-black dark:text-white">
                  <Check className="w-3 h-3" /> VERIFIED KEY CONCEPTS:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {qa.keyConceptsCovered.map((c, i) => (
                    <span key={i} className="px-2 py-0.5 border text-[10px] font-mono border-neutral-400 bg-white dark:bg-black text-black dark:text-white">
                      + {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {qa.missingKeyConcepts && qa.missingKeyConcepts.length > 0 && (
              <div className="p-3 border border-dashed border-neutral-400 dark:border-neutral-700 bg-neutral-50 dark:bg-[#121212]">
                <span className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 mb-2 text-neutral-500">
                  <AlertCircle className="w-3 h-3" /> OMITTED SYLLABUS PARAMETERS:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {qa.missingKeyConcepts.map((c, i) => (
                    <span key={i} className="px-2 py-0.5 border border-dashed text-[10px] font-mono border-neutral-400 text-neutral-600 dark:text-neutral-400">
                      - {c}
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
              className="flex items-center justify-between w-full p-2.5 border text-xs font-mono font-bold uppercase tracking-wider transition bg-neutral-100 hover:bg-neutral-200 border-neutral-300 text-black dark:bg-[#161616] dark:hover:bg-[#1f1f1f] dark:border-neutral-800 dark:text-white"
            >
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                {showModelAnswer ? '[-] COLLAPSE MODEL ANSWER BENCHMARK' : '[+] VIEW 10/10 MODEL ANSWER BENCHMARK'}
              </span>
              {showModelAnswer ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showModelAnswer && (
              <div className="mt-2 p-3.5 border leading-relaxed text-xs view-fade-in bg-white border-black text-black dark:bg-black dark:border-white dark:text-neutral-200">
                <p className="font-mono font-bold mb-1 text-[10px] uppercase tracking-wider opacity-60">
                  IDEAL EXAM KEY // FULL CREDIT SPECIFICATION:
                </p>
                <p className="font-sans leading-relaxed">{qa.idealModelAnswer}</p>
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
    if (result.overallScore >= 8.0) {
      confetti({
        particleCount: 60,
        spread: 55,
        origin: { y: 0.6 },
        colors: ['#000000', '#ffffff', '#737373', '#d4d4d4', '#171717'],
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
    <div className="w-full max-w-5xl mx-auto p-2 sm:p-4 view-fade-in text-black dark:text-white">
      {/* Dossier Registration Header Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 p-4 border bg-white border-neutral-300 dark:bg-[#0c0c0c] dark:border-neutral-800 crosshair-corner">
        <div className="flex items-center gap-3 font-mono">
          <div className="p-2 border border-black dark:border-white bg-black text-white dark:bg-white dark:text-black">
            <Hash className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                EXAMINATION DOSSIER // {result.id}
              </span>
              <span className="px-1.5 py-0.2 border text-[9px] font-bold bg-neutral-100 border-neutral-300 dark:bg-neutral-900 dark:border-neutral-700">
                AI AUDITED
              </span>
            </div>
            <h2 className="text-lg font-black tracking-tight font-sans">
              {result.studentName || 'Student'} • {result.subject}
            </h2>
            <p className="text-[11px] text-neutral-500">
              ROLL NO: {result.studentRoll || 'N/A'} • DATE: {result.evaluationDate}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
          <button
            type="button"
            onClick={() => exportEvaluationToPdf(result)}
            className="flex items-center gap-1.5 px-3 py-1.5 font-bold uppercase tracking-wider border border-black bg-black text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 transition"
            title="Download PDF"
          >
            <Download className="w-3.5 h-3.5" /> [ PDF ]
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 font-bold uppercase tracking-wider border border-neutral-300 hover:border-black dark:border-neutral-700 dark:hover:border-white bg-neutral-50 dark:bg-neutral-900 transition"
            title="Print sheet"
          >
            <Printer className="w-3.5 h-3.5" /> [ PRINT ]
          </button>

          <button
            type="button"
            onClick={handleCopyMarkdown}
            className="flex items-center gap-1.5 px-3 py-1.5 font-bold uppercase tracking-wider border border-neutral-300 hover:border-black dark:border-neutral-700 dark:hover:border-white bg-neutral-50 dark:bg-neutral-900 transition"
            title="Copy summary"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'COPIED' : 'COPY'}
          </button>

          <button
            type="button"
            onClick={() => exportEvaluationToCsv(result)}
            className="p-1.5 border border-neutral-300 hover:border-black dark:border-neutral-700 dark:hover:border-white bg-neutral-50 dark:bg-neutral-900 transition"
            title="Export CSV"
          >
            <FileSpreadsheet className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => exportEvaluationToJson(result)}
            className="p-1.5 border border-neutral-300 hover:border-black dark:border-neutral-700 dark:hover:border-white bg-neutral-50 dark:bg-neutral-900 transition"
            title="Export JSON"
          >
            <FileJson className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 font-bold uppercase tracking-wider border border-neutral-300 hover:border-black dark:border-neutral-700 dark:hover:border-white bg-neutral-50 dark:bg-neutral-900 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" /> NEW
          </button>
        </div>
      </div>

      {/* Main Score & Diagnostic Block */}
      <div className="p-6 md:p-8 border mb-6 bg-white border-neutral-300 dark:bg-[#0c0c0c] dark:border-neutral-800 crosshair-corner">
        <div className="flex flex-col md:flex-row items-center gap-8 justify-between">
          <ScoreCircle
            score={result.overallScore}
            grade={result.grade}
            percentage={result.percentage}
          />

          <div className="flex-1 font-mono text-left">
            <div className="flex flex-wrap items-center gap-2 mb-2 text-[10px] font-bold text-neutral-500">
              <span>DOMAIN: {result.subject}</span>
              <span>//</span>
              <span>RUBRIC: {result.evaluationMode.toUpperCase()}</span>
            </div>

            <h3 className="text-xl font-black font-sans mb-2 text-black dark:text-white">
              EXECUTIVE EVALUATION SUMMARY
            </h3>
            <p className="text-xs font-sans leading-relaxed mb-4 text-neutral-700 dark:text-neutral-300">
              {result.generalFeedback}
            </p>

            <SpeechSynthesisButton
              text={`Evaluation Summary. Final score is ${result.overallScore} out of 10. Grade ${result.grade}. ${result.generalFeedback}`}
              label="Auditory Critique"
            />
          </div>
        </div>
      </div>

      {/* Dossier Tabs */}
      <div className="flex items-center gap-0 overflow-x-auto mb-6 border-b border-neutral-300 dark:border-neutral-800 font-mono text-xs font-bold uppercase tracking-wider">
        {[
          { id: 'breakdown', label: `[ 01 // QUESTIONS (${result.evaluations.length}) ]`, icon: FileText },
          { id: 'document', label: '[ 02 // SCRIPT & OCR ]', icon: Eye },
          { id: 'rubric', label: '[ 03 // 5-AXIS RUBRIC ]', icon: Sliders },
          { id: 'strengths', label: '[ 04 // DIAGNOSTIC MATRIX ]', icon: Sparkles },
          { id: 'modelAnswers', label: '[ 05 // MODEL ANSWERS ]', icon: BookOpen },
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 border-b-2 transition whitespace-nowrap ${
                isActive
                  ? 'border-black text-black bg-neutral-100 dark:border-white dark:text-white dark:bg-neutral-900 font-black'
                  : 'border-transparent text-neutral-500 hover:text-black dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
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
        <div className="view-fade-in p-6 border bg-white border-neutral-300 dark:bg-[#0c0c0c] dark:border-neutral-800 crosshair-corner">
          <div className="mb-4 font-mono">
            <span className="text-[10px] text-neutral-500 uppercase tracking-widest">[ DIAGNOSTIC RADAR ]</span>
            <h4 className="text-base font-black font-sans uppercase">5-Axis Competency Breakdown</h4>
            <p className="text-xs text-neutral-500 mt-1">
              Independent scoring metrics calibrated across factual accuracy, conceptual depth, keyword density, structure, and expression.
            </p>
          </div>
          <CriteriaBreakdown breakdown={result.criteriaBreakdown} />
        </div>
      )}

      {/* Tab 4: Strengths & Weaknesses */}
      {activeTab === 'strengths' && (
        <div className="view-fade-in grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
          <div className="p-6 border bg-white border-neutral-300 dark:bg-[#0c0c0c] dark:border-neutral-800 crosshair-corner">
            <h4 className="text-sm font-black uppercase tracking-wider mb-4 flex items-center gap-2 text-black dark:text-white">
              <CheckCircle2 className="w-4 h-4" /> [ DEMONSTRATED STRENGTHS ]
            </h4>
            <ul className="space-y-3 font-sans">
              {result.strengths.map((s, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs leading-relaxed text-neutral-700 dark:text-neutral-300">
                  <span className="font-mono font-bold text-neutral-400">+{idx + 1}.</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 border bg-white border-neutral-300 dark:bg-[#0c0c0c] dark:border-neutral-800 crosshair-corner">
            <h4 className="text-sm font-black uppercase tracking-wider mb-4 flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
              <AlertCircle className="w-4 h-4" /> [ OMISSION &amp; REMEDIATION MATRIX ]
            </h4>
            <ul className="space-y-3 font-sans">
              {result.areasForImprovement.map((a, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs leading-relaxed text-neutral-700 dark:text-neutral-300">
                  <span className="font-mono font-bold text-neutral-400">-{idx + 1}.</span>
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Tab 5: Complete Model Answer Sheet */}
      {activeTab === 'modelAnswers' && (
        <div className="view-fade-in space-y-4 font-mono">
          <div className="p-3 border text-xs bg-neutral-100 border-neutral-300 text-black dark:bg-[#121212] dark:border-neutral-800 dark:text-white">
            MASTER ANSWER KEY SPECIFICATION // GENERATED UNDER HIGH-LEVEL ACADEMIC CRITERIA:
          </div>
          {result.evaluations.map((qa, idx) => (
            <div key={idx} className="p-5 border bg-white border-neutral-300 dark:bg-[#0c0c0c] dark:border-neutral-800 crosshair-corner">
              <div className="flex items-center gap-2 mb-2 font-mono">
                <span className="px-2 py-0.5 border text-xs font-bold border-black bg-black text-white dark:border-white dark:bg-white dark:text-black">
                  Q{qa.questionNumber || idx + 1}
                </span>
                <h5 className="font-bold text-xs uppercase tracking-wide font-sans">{qa.question}</h5>
              </div>
              <div className="mt-3 p-4 border leading-relaxed text-xs bg-neutral-50 border-neutral-300 text-black dark:bg-black dark:border-neutral-700 dark:text-neutral-200">
                <p className="font-mono text-[10px] font-bold uppercase tracking-wider opacity-60 mb-1">IDEAL BENCHMARK (10/10):</p>
                <p className="font-sans leading-relaxed">{qa.idealModelAnswer || 'Standard model answer covering core definitions and principles.'}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom CTA */}
      <div className="text-center mt-8 font-mono">
        <button
          onClick={onReset}
          className="px-8 py-3.5 text-xs font-bold uppercase tracking-widest border border-black bg-black text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 transition shadow-lg"
        >
          [ EVALUATE ANOTHER DOCUMENT ]
        </button>
      </div>
    </div>
  );
};

export default ResultsView;