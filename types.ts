export enum AppState {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  RESULTS = 'RESULTS',
  ERROR = 'ERROR',
}

export interface EvaluationCriteriaBreakdown {
  factualAccuracy: number;     // 0-10
  conceptualDepth: number;     // 0-10
  keywordCoverage: number;     // 0-10
  clarityAndStructure: number; // 0-10
  languageAndGrammar: number;  // 0-10
}

export interface QAPair {
  questionNumber?: number;
  question: string;
  answer: string;
  feedback: string;
  score: number;
  maxMarks: number;
  strengths?: string[];
  improvements?: string[];
  keyConceptsCovered?: string[];
  missingKeyConcepts?: string[];
  idealModelAnswer?: string;
  criteriaBreakdown?: EvaluationCriteriaBreakdown;
}

export interface EvaluationResult {
  id: string;
  overallScore: number;
  maxOverallScore: number;
  percentage: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  generalFeedback: string;
  strengths: string[];
  areasForImprovement: string[];
  criteriaBreakdown: EvaluationCriteriaBreakdown;
  evaluations: QAPair[];
  extractedFullText?: string;
  subject: string;
  studentName?: string;
  studentRoll?: string;
  evaluationDate: string;
  evaluationMode: 'strict' | 'balanced' | 'generous';
  documentName?: string;
  documentPreviewUrl?: string;
}

export interface EvaluationHistoryItem {
  id: string;
  timestamp: string;
  score: number;
  maxScore: number;
  grade: string;
  subject: string;
  documentName: string;
  feedbackSummary: string;
  fullResult: EvaluationResult;
}

export interface User {
  email: string;
  password?: string;
  name?: string;
  role?: 'student' | 'teacher' | 'admin';
  history?: EvaluationHistoryItem[];
}

export interface EvaluationSettings {
  rubric: 'strict' | 'balanced' | 'generous';
  subject: string;
  maxMarksPerQuestion: number;
  referenceAnswerKey: string;
  studentName: string;
  studentRoll: string;
  model: string;
  customApiKey?: string;
  isSimulatedDemo?: boolean;
}