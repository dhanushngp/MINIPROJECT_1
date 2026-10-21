import React, { useState, useCallback, useEffect } from 'react';
import {
  AppState,
  EvaluationResult,
  EvaluationSettings,
  User,
  EvaluationHistoryItem
} from './types';
import { evaluateHandwriting, getActiveApiKey } from './services/geminiService';
import FileUpload from './components/FileUpload';
import ProcessingView from './components/ProcessingView';
import ResultsView from './components/ResultsView';
import Auth from './components/Auth';
import AdminDashboard from './components/AdminDashboard';
import CEOWelcome from './components/CEOWelcome';
import CEOSecurityCheck from './components/CEOSecurityCheck';
import ApiKeyModal from './components/ApiKeyModal';
import RubricSettingsModal from './components/RubricSettingsModal';
import HistoryDrawer from './components/HistoryDrawer';
import SampleExamSelector from './components/SampleExamSelector';
import { SampleExamPaper } from './services/sampleData';
import {
  Sparkles,
  Key,
  Sliders,
  Clock,
  LogOut,
  Shield,
  GraduationCap,
  AlertCircle
} from 'lucide-react';

const getStoredUsers = (): User[] => {
  try {
    const users = localStorage.getItem('handwriting-eval-users');
    return users ? JSON.parse(users) : [];
  } catch (e) {
    return [];
  }
};

const storeUsers = (users: User[]) => {
  localStorage.setItem('handwriting-eval-users', JSON.stringify(users));
};

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [currentPreviewUrl, setCurrentPreviewUrl] = useState<string | undefined>(undefined);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Authentication & Navigation
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<'AUTH' | 'ADMIN' | 'EVALUATOR' | 'CEO_WELCOME' | 'CEO_SECURITY_CHECK'>('AUTH');

  // Modals & Drawers
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isRubricModalOpen, setIsRubricModalOpen] = useState(false);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);

  // Evaluation Settings
  const [settings, setSettings] = useState<EvaluationSettings>(() => {
    const storedSim = localStorage.getItem('eval_use_simulated') === 'true';
    const storedKey = localStorage.getItem('user_gemini_api_key') || '';
    const storedModel = localStorage.getItem('eval_model') || 'gemini-2.5-flash';
    return {
      rubric: 'balanced',
      subject: 'Computer Science & Engineering',
      maxMarksPerQuestion: 10,
      referenceAnswerKey: '',
      studentName: 'Dhanush S.',
      studentRoll: 'CS2026-8841',
      model: storedModel,
      customApiKey: storedKey,
      isSimulatedDemo: storedSim,
    };
  });

  // History for current session
  const [userHistory, setUserHistory] = useState<EvaluationHistoryItem[]>(() => {
    try {
      const stored = localStorage.getItem('handwriting_eval_history');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const sessionUser = sessionStorage.getItem('handwriting-eval-user');
    const sessionIsAdmin = sessionStorage.getItem('handwriting-eval-isAdmin') === 'true';
    if (sessionUser) {
      if (sessionIsAdmin) {
        handleLogout();
      } else {
        setCurrentUser(sessionUser);
        setIsAdmin(false);
        setCurrentView('EVALUATOR');
      }
    }
  }, []);

  const handleLogin = (email: string, password: string) => {
    // Hardcoded admin/CEO check
    if (email.toLowerCase() === 'dhanush31101@gmail.com' && password === 'test112') {
      setCurrentUser(email);
      setIsAdmin(true);
      setCurrentView('CEO_SECURITY_CHECK');
      sessionStorage.setItem('handwriting-eval-user', email);
      sessionStorage.setItem('handwriting-eval-isAdmin', 'true');
      return { success: true };
    }

    const users = getStoredUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (user) {
      setCurrentUser(user.email);
      setIsAdmin(false);
      setCurrentView('EVALUATOR');
      sessionStorage.setItem('handwriting-eval-user', user.email);
      sessionStorage.setItem('handwriting-eval-isAdmin', 'false');
      return { success: true };
    }
    return { success: false, message: 'Invalid email or password. Use "Student Demo" or "Admin / CEO" shortcuts.' };
  };

  const handleSignup = (email: string, password: string) => {
    const users = getStoredUsers();
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: 'An account with this email already exists.' };
    }
    const newUsers = [...users, { email, password, history: [] }];
    storeUsers(newUsers);
    return handleLogin(email, password);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAdmin(false);
    setCurrentView('AUTH');
    sessionStorage.removeItem('handwriting-eval-user');
    sessionStorage.removeItem('handwriting-eval-isAdmin');
    handleReset();
  };

  const handleFileUpload = useCallback((file: File, previewUrl?: string) => {
    setCurrentFile(file);
    setCurrentPreviewUrl(previewUrl);
    setError(null);
  }, []);

  const handleClearFile = useCallback(() => {
    setCurrentFile(null);
    setCurrentPreviewUrl(undefined);
    setError(null);
  }, []);

  const handleSelectSample = (sample: SampleExamPaper) => {
    // Convert SVG preview into a File object so the user can re-evaluate or immediately view
    const blob = new Blob([sample.svgPreview], { type: 'image/svg+xml' });
    const file = new File([blob], sample.filename, { type: 'image/svg+xml' });
    setCurrentFile(file);
    setCurrentPreviewUrl(sample.svgPreview);
    setSettings(prev => ({
      ...prev,
      subject: sample.subject,
      studentName: sample.studentName,
      studentRoll: sample.studentRoll,
    }));

    // Directly present sample result
    setEvaluationResult(sample.result);
    setAppState(AppState.RESULTS);
    setError(null);

    // Save to user history
    saveResultToHistory(sample.result);
  };

  const saveResultToHistory = (result: EvaluationResult) => {
    const historyItem: EvaluationHistoryItem = {
      id: result.id,
      timestamp: new Date().toISOString(),
      score: result.overallScore,
      maxScore: result.maxOverallScore,
      grade: result.grade,
      subject: result.subject,
      documentName: result.documentName || 'Answer Paper',
      feedbackSummary: result.generalFeedback.substring(0, 70) + '...',
      fullResult: result,
    };

    const updated = [historyItem, ...userHistory.filter(h => h.id !== result.id)].slice(0, 30);
    setUserHistory(updated);
    localStorage.setItem('handwriting_eval_history', JSON.stringify(updated));

    if (currentUser) {
      const users = getStoredUsers();
      const updatedUsers = users.map(user => {
        if (user.email === currentUser) {
          return { ...user, history: [historyItem, ...(user.history || [])] };
        }
        return user;
      });
      storeUsers(updatedUsers);
    }
  };

  const handleEvaluation = async () => {
    if (!currentFile) {
      setError("Please select or scan an answer sheet document first.");
      return;
    }

    setAppState(AppState.PROCESSING);
    setError(null);

    try {
      const result = await evaluateHandwriting(currentFile, settings, currentPreviewUrl);
      setEvaluationResult(result);
      setAppState(AppState.RESULTS);
      saveResultToHistory(result);
    } catch (err: any) {
      const errorMessage = err?.message || "An unexpected error occurred during AI evaluation.";
      setError(errorMessage);
      setAppState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setCurrentFile(null);
    setCurrentPreviewUrl(undefined);
    setEvaluationResult(null);
    setError(null);
  };

  const handleSaveApiSettings = (apiKey: string, model: string, useSimulated: boolean) => {
    localStorage.setItem('user_gemini_api_key', apiKey);
    localStorage.setItem('eval_model', model);
    localStorage.setItem('eval_use_simulated', useSimulated ? 'true' : 'false');
    setSettings(prev => ({
      ...prev,
      customApiKey: apiKey,
      model,
      isSimulatedDemo: useSimulated,
    }));
  };

  const handleClearHistory = () => {
    setUserHistory([]);
    localStorage.removeItem('handwriting_eval_history');
  };

  const handleDeleteHistoryItem = (id: string) => {
    const filtered = userHistory.filter(h => h.id !== id);
    setUserHistory(filtered);
    localStorage.setItem('handwriting_eval_history', JSON.stringify(filtered));
  };

  const isSimulatedActive = settings.isSimulatedDemo || !getActiveApiKey(settings.customApiKey);

  const renderEvaluatorContent = () => {
    switch (appState) {
      case AppState.PROCESSING:
        return <ProcessingView onCancel={handleReset} />;
      case AppState.RESULTS:
        return evaluationResult ? (
          <ResultsView result={evaluationResult} onReset={handleReset} />
        ) : null;
      case AppState.ERROR:
      case AppState.IDLE:
      default:
        return (
          <div className="w-full max-w-2xl mx-auto view-fade-in text-center">
            <header className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 text-blue-400 border border-blue-500/20 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Next-Gen Handwriting OCR &amp; Diagnostic Evaluator</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                AI Descriptive <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-teal-300">Answer Evaluator</span>
              </h1>
              <p className="mt-3 text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                Upload handwritten exam papers, assignments, or study sheets. Our multimodal AI transcribes your handwriting, evaluates factual logic, scores out of 10, and generates full model answers.
              </p>
            </header>

            {/* Main File Upload Area */}
            <FileUpload
              onFileUpload={handleFileUpload}
              disabled={false}
              selectedFile={currentFile}
              onClearFile={handleClearFile}
              onOpenSettings={() => setIsRubricModalOpen(true)}
              subjectName={settings.subject}
              rubricName={settings.rubric}
            />

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs flex items-center gap-2.5 text-left max-w-2xl mx-auto">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-red-200">Evaluation Issue</p>
                  <p>{error}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsApiKeyModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-red-900/60 hover:bg-red-800 text-white font-medium text-xs shrink-0"
                >
                  Configure Key
                </button>
              </div>
            )}

            {/* Submit Action Button */}
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={handleEvaluation}
                disabled={!currentFile}
                className="px-10 py-3.5 font-bold text-base text-white transition-all duration-300 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 rounded-xl shadow-xl shadow-blue-600/30 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:pointer-events-none disabled:shadow-none"
              >
                Start AI Evaluation
              </button>
            </div>

            {/* Sample Exam Sheets Selector */}
            <SampleExamSelector
              onSelectSample={handleSelectSample}
              disabled={false}
            />
          </div>
        );
    }
  };

  const renderMainView = () => {
    switch (currentView) {
      case 'CEO_SECURITY_CHECK':
        return (
          <CEOSecurityCheck
            onVerifySuccess={() => setCurrentView('CEO_WELCOME')}
            onLogout={handleLogout}
          />
        );
      case 'CEO_WELCOME':
        return <CEOWelcome onComplete={() => setCurrentView('ADMIN')} />;
      case 'ADMIN':
        return (
          <AdminDashboard
            onLogout={handleLogout}
            onSwitchView={() => setCurrentView('EVALUATOR')}
            users={getStoredUsers()}
            onOpenSettings={() => setIsApiKeyModalOpen(true)}
            onInspectResult={(res) => {
              setEvaluationResult(res);
              setAppState(AppState.RESULTS);
              setCurrentView('EVALUATOR');
            }}
          />
        );
      case 'EVALUATOR':
        return (
          <div className="w-full">
            {/* Top Navigation Bar */}
            <header className="w-full flex items-center justify-between gap-3 py-3 px-4 sm:px-6 mb-6 rounded-2xl bg-slate-900/80 border border-slate-700/80 backdrop-blur-md shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md shadow-blue-600/30">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                    Evaluator <span className="text-blue-400">AI</span>
                  </h2>
                  <p className="text-[11px] text-slate-400 hidden sm:block">
                    Logged in as: <strong className="text-slate-200">{currentUser}</strong>
                  </p>
                </div>
              </div>

              {/* Status & Action Buttons */}
              <div className="flex items-center gap-2">
                {/* Engine Mode Pill */}
                <button
                  type="button"
                  onClick={() => setIsApiKeyModalOpen(true)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                    isSimulatedActive
                      ? 'bg-purple-950/40 border-purple-500/40 text-purple-300 hover:bg-purple-900/40'
                      : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/40'
                  }`}
                  title="Click to configure Gemini API Key or change AI mode"
                >
                  <span className={`w-2 h-2 rounded-full ${isSimulatedActive ? 'bg-purple-400 animate-pulse' : 'bg-emerald-400'}`} />
                  <span className="hidden md:inline">
                    {isSimulatedActive ? 'Simulated AI / Demo Mode' : `Gemini Online (${settings.model || '2.5-flash'})`}
                  </span>
                  <span className="md:hidden">
                    {isSimulatedActive ? 'Demo' : 'Online'}
                  </span>
                  <Key className="w-3 h-3 text-slate-400 ml-0.5" />
                </button>

                {/* Rubric Settings */}
                <button
                  type="button"
                  onClick={() => setIsRubricModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
                  title="Customize grading rubrics, subject, or student name"
                >
                  <Sliders className="w-3.5 h-3.5 text-blue-400" />
                  <span className="hidden sm:inline">Options</span>
                </button>

                {/* History Drawer */}
                <button
                  type="button"
                  onClick={() => setIsHistoryDrawerOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition relative"
                  title="Past evaluations"
                >
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="hidden sm:inline">History</span>
                  {userHistory.length > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-blue-600 text-[10px] font-bold text-white">
                      {userHistory.length}
                    </span>
                  )}
                </button>

                {/* Switch to Admin if admin user */}
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => setCurrentView('ADMIN')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-amber-300 bg-amber-950/40 border border-amber-800/50 hover:bg-amber-900/40 transition"
                    title="Switch to CEO Admin Dashboard"
                  >
                    <Shield className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden sm:inline">Admin</span>
                  </button>
                )}

                {/* Logout */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-red-600/80 transition"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </header>

            <main className="w-full flex-grow flex items-center justify-center py-4">
              {renderEvaluatorContent()}
            </main>
          </div>
        );
      case 'AUTH':
      default:
        return (
          <Auth
            onLogin={handleLogin}
            onSignup={handleSignup}
            onQuickDemoLogin={() => handleLogin('student@university.edu', 'student123')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen text-slate-100 flex flex-col justify-between p-3 sm:p-6 bg-slate-950 font-sans selection:bg-blue-500 selection:text-white">
      <div className="w-full max-w-6xl mx-auto flex-grow flex items-center justify-center">
        {renderMainView()}
      </div>

      <footer className="text-center text-slate-500 text-xs py-4 mt-6 border-t border-slate-900 flex flex-wrap items-center justify-center gap-4">
        <p>AI Descriptive Answer Evaluator • Powered by Google Gemini &amp; React 19</p>
        <span>•</span>
        <button
          onClick={() => setIsApiKeyModalOpen(true)}
          className="hover:text-slate-300 underline underline-offset-2 transition"
        >
          Model Settings
        </button>
        <span>•</span>
        <button
          onClick={() => setIsRubricModalOpen(true)}
          className="hover:text-slate-300 underline underline-offset-2 transition"
        >
          Exam Rubric
        </button>
      </footer>

      {/* Global Modals & Drawers */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onSave={handleSaveApiSettings}
        currentKey={settings.customApiKey || ''}
        currentModel={settings.model || 'gemini-2.5-flash'}
        isSimulatedDemo={!!settings.isSimulatedDemo}
      />

      <RubricSettingsModal
        isOpen={isRubricModalOpen}
        onClose={() => setIsRubricModalOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
      />

      <HistoryDrawer
        isOpen={isHistoryDrawerOpen}
        onClose={() => setIsHistoryDrawerOpen(false)}
        history={userHistory}
        onSelectResult={(res) => {
          setEvaluationResult(res);
          setAppState(AppState.RESULTS);
        }}
        onClearHistory={handleClearHistory}
        onDeleteHistoryItem={handleDeleteHistoryItem}
      />
    </div>
  );
};

export default App;
