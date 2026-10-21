import jsPDF from 'jspdf';
import { EvaluationResult } from '../types';

export const exportEvaluationToPdf = (result: EvaluationResult) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 18;

  // Header Bar
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('AI DESCRIPTIVE ANSWER EVALUATION REPORT', 14, 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text(`Generated on ${result.evaluationDate} | Powered by Google Gemini`, 14, 21);

  y = 36;

  // Student & Exam Metadata Box
  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, y, pageWidth - 28, 24, 2, 2, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(`Student: ${result.studentName || 'N/A'}`, 18, y + 7);
  doc.text(`Roll / ID: ${result.studentRoll || 'N/A'}`, 18, y + 14);
  doc.text(`Document: ${result.documentName || 'Answer Sheet'}`, 18, y + 21);

  doc.text(`Subject: ${result.subject || 'General'}`, pageWidth / 2 + 5, y + 7);
  doc.text(`Rubric Mode: ${result.evaluationMode?.toUpperCase() || 'BALANCED'}`, pageWidth / 2 + 5, y + 14);
  doc.text(`Overall Score: ${result.overallScore.toFixed(1)} / 10  (${result.percentage}% - Grade ${result.grade})`, pageWidth / 2 + 5, y + 21);

  y += 32;

  // General Feedback Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 58, 138); // blue-900
  doc.text('EXAMINER SUMMARY & FEEDBACK', 14, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  const feedbackLines = doc.splitTextToSize(result.generalFeedback, pageWidth - 28);
  doc.text(feedbackLines, 14, y);
  y += feedbackLines.length * 4.5 + 4;

  // Criteria Breakdown
  if (result.criteriaBreakdown) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(30, 58, 138);
    doc.text('CRITERIA EVALUATION (0-10)', 14, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    const cb = result.criteriaBreakdown;
    const critText = `Factual Accuracy: ${cb.factualAccuracy.toFixed(1)} | Conceptual Depth: ${cb.conceptualDepth.toFixed(1)} | Keywords: ${cb.keywordCoverage.toFixed(1)} | Clarity: ${cb.clarityAndStructure.toFixed(1)} | Presentation: ${cb.languageAndGrammar.toFixed(1)}`;
    doc.text(critText, 14, y);
    y += 8;
  }

  // Question-by-Question Breakdown
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 58, 138);
  doc.text('QUESTION-BY-QUESTION ANALYSIS', 14, y);
  y += 6;

  result.evaluations.forEach((qa, idx) => {
    // Check page overflow
    if (y > 250) {
      doc.addPage();
      y = 18;
    }

    // QA Card Box
    doc.setDrawColor(226, 232, 240);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(14, y, pageWidth - 28, 45, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`Q${idx + 1}: ${qa.question}`, 18, y + 6);

    doc.setTextColor(2, 132, 199); // sky-600
    doc.text(`Score: ${qa.score} / ${qa.maxMarks || 10}`, pageWidth - 42, y + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('Student Answer:', 18, y + 12);

    doc.setTextColor(51, 65, 85);
    const answerSnippet = qa.answer.length > 180 ? qa.answer.slice(0, 180) + '...' : qa.answer;
    const ansLines = doc.splitTextToSize(answerSnippet, pageWidth - 36);
    doc.text(ansLines, 18, y + 16);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 58, 138);
    doc.text('AI Feedback:', 18, y + 26);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    const feedbackSnippet = qa.feedback.length > 200 ? qa.feedback.slice(0, 200) + '...' : qa.feedback;
    const fbLines = doc.splitTextToSize(feedbackSnippet, pageWidth - 36);
    doc.text(fbLines, 18, y + 30);

    y += 50;
  });

  // Footer on current page
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('This evaluation was performed by AI Descriptive Answer Evaluator. For formal academic credit, verify with instructor.', 14, 287);

  const cleanFilename = (result.studentName || 'Student').replace(/\s+/g, '_') + '_Evaluation_Report.pdf';
  doc.save(cleanFilename);
};

export const exportEvaluationToJson = (result: EvaluationResult) => {
  const jsonStr = JSON.stringify(result, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${(result.studentName || 'Evaluation').replace(/\s+/g, '_')}_Result.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const exportEvaluationToCsv = (result: EvaluationResult) => {
  const headers = ['Question Number', 'Question', 'Student Answer', 'Score Awarded', 'Max Marks', 'Feedback'];
  const rows = result.evaluations.map(qa => [
    qa.questionNumber || '',
    `"${(qa.question || '').replace(/"/g, '""')}"`,
    `"${(qa.answer || '').replace(/"/g, '""')}"`,
    qa.score,
    qa.maxMarks || 10,
    `"${(qa.feedback || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${(result.studentName || 'Evaluation').replace(/\s+/g, '_')}_GradeSheet.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

export const generateMarkdownSummary = (result: EvaluationResult): string => {
  return `# AI Answer Evaluation Report
**Student:** ${result.studentName || 'N/A'} | **Roll:** ${result.studentRoll || 'N/A'}
**Subject:** ${result.subject || 'General'} | **Date:** ${result.evaluationDate}
**Overall Score:** ${result.overallScore.toFixed(1)} / 10 (${result.percentage}% - Grade: ${result.grade})

## General Feedback
${result.generalFeedback}

### Key Strengths:
${result.strengths.map(s => `- ${s}`).join('\n')}

### Areas for Improvement:
${result.areasForImprovement.map(a => `- ${a}`).join('\n')}

## Detailed Breakdown:
${result.evaluations.map((qa, i) => `
### Question ${i + 1}: ${qa.question}
- **Score:** ${qa.score} / ${qa.maxMarks || 10}
- **Your Answer:** ${qa.answer}
- **Feedback:** ${qa.feedback}
${qa.idealModelAnswer ? `- **Model Answer:** ${qa.idealModelAnswer}` : ''}
`).join('\n')}
`;
};
