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
import ThemeToggle from './components/ThemeToggle';
import { SampleExamPaper } from './services/sampleData';
import {
  Sparkles,
  Key,
  Sliders,
  Clock,
  LogOut,
  Shield,
  GraduationCap,
  AlertCircle,
  Hash,
  Terminal,
  Activity
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
  // Theme state: 'dark' or 'light'
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('app_theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    localStorage.setItem('app_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

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
    return { success: false, message: 'Invalid credentials. Use Quick Demo buttons below.' };
  };

  const handleSignup = (email: string, password: string) => {
    const users = getStoredUsers();
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: 'Account exists with this email address.' };
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

    setEvaluationResult(sample.result);
    setAppState(AppState.RESULTS);
    setError(null);

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
          <div className="w-full max-w-3xl mx-auto view-fade-in text-center text-black dark:text-white">
            {/* Bold Avant-Garde Editorial Header */}
            <header className="mb-10 text-left border-b border-black dark:border-white pb-6">
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-neutral-500 mb-2">
                <span className="flex items-center gap-1.5 font-bold text-black dark:text-white">
                  <Terminal className="w-3.5 h-3.5" /> SPEC: EVAL.MULTIMODAL.v4
                </span>
                <span>STATUS // READY</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black tracking-tighter uppercase leading-none font-sans text-black dark:text-white">
                Descriptive Answer Evaluator
              </h1>

              <div className="flex flex-wrap items-center justify-between gap-4 mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-800 font-mono text-xs text-neutral-600 dark:text-neutral-400">
                <p className="max-w-xl font-sans text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Optical transcription, logical soundness verification, and 5-criteria grading for handwritten exam sheets.
                </p>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 border border-black dark:border-white font-mono text-[10px] font-bold uppercase">
                    MAX: 10.0 PTS
                  </span>
                </div>
              </div>
            </header>

            {/* Main File Intake Area */}
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
              <div className="mt-4 p-4 border text-xs flex items-center gap-2.5 text-left max-w-2xl mx-auto font-mono bg-white border-black text-black dark:bg-black dark:border-white dark:text-white">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <div className="flex-1">
                  <p className="font-bold uppercase tracking-wider">[ DIAGNOSTIC ERROR ]</p>
                  <p className="opacity-80 text-[11px]">{error}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsApiKeyModalOpen(true)}
                  className="px-3 py-1.5 border border-black dark:border-white font-bold text-xs uppercase bg-black text-white dark:bg-white dark:text-black"
                >
                  SET KEY
                </button>
              </div>
            )}

            {/* Submit Action Button */}
            <div className="mt-8 text-center font-mono">
              <button
                type="button"
                onClick={handleEvaluation}
                disabled={!currentFile}
                className="group relative px-12 py-4 font-mono font-black text-xs uppercase tracking-[0.2em] border-2 border-black dark:border-white transition-all duration-150 disabled:opacity-30 disabled:pointer-events-none bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 shadow-xl"
              >
                <span>[ EXECUTE AI EVALUATION ]</span>
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
            theme={theme}
            onToggleTheme={toggleTheme}
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
            theme={theme}
            onToggleTheme={toggleTheme}
          />
        );
      case 'EVALUATOR':
        return (
          <div className="w-full text-black dark:text-white">
            {/* Architectural Dossier Telemetry Header */}
            <header className="w-full border-b border-black dark:border-white pb-3 mb-8 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 border border-black dark:border-white flex items-center justify-center font-black bg-black text-white dark:bg-white dark:text-black">
                  AI
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm tracking-tight font-sans uppercase">
                      EVALUATOR // ACADEMIC DOSSIER
                    </span>
                    <span className="w-2 h-2 rounded-full bg-black dark:bg-white animate-pulse" />
                  </div>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-widest hidden sm:block">
                    OPERATOR: {currentUser}
                  </p>
                </div>
              </div>

              {/* Action Controls & Top Theme Switcher */}
              <div className="flex flex-wrap items-center gap-2">
                <ThemeToggle theme={theme} onToggleTheme={toggleTheme} />

                {/* Engine Mode Pill */}
                <button
                  type="button"
                  onClick={() => setIsApiKeyModalOpen(true)}
                  className="px-2.5 py-1.5 border border-neutral-300 dark:border-neutral-700 hover:border-black dark:hover:border-white font-mono text-[11px] font-bold uppercase transition bg-white dark:bg-black text-black dark:text-white flex items-center gap-1.5"
                  title="Configure Gemini API Key"
                >
                  <Key className="w-3 h-3 opacity-60" />
                  <span className="hidden md:inline">
                    {isSimulatedActive ? 'ENGINE: DEMO' : `ENGINE: ${settings.model || '2.5-FLASH'}`}
                  </span>
                  <span className="md:hidden">
                    {isSimulatedActive ? 'DEMO' : 'API'}
                  </span>
                </button>

                {/* Rubric Settings */}
                <button
                  type="button"
                  onClick={() => setIsRubricModalOpen(true)}
                  className="px-2.5 py-1.5 border border-neutral-300 dark:border-neutral-700 hover:border-black dark:hover:border-white font-mono text-[11px] font-bold uppercase transition bg-white dark:bg-black text-black dark:text-white flex items-center gap-1.5"
                  title="Rubric and syllabus options"
                >
                  <Sliders className="w-3 h-3" />
                  <span className="hidden sm:inline">CRITERIA</span>
                </button>

                {/* History Drawer */}
                <button
                  type="button"
                  onClick={() => setIsHistoryDrawerOpen(true)}
                  className="px-2.5 py-1.5 border border-neutral-300 dark:border-neutral-700 hover:border-black dark:hover:border-white font-mono text-[11px] font-bold uppercase transition bg-white dark:bg-black text-black dark:text-white flex items-center gap-1.5"
                  title="Past examinations"
                >
                  <Clock className="w-3 h-3" />
                  <span className="hidden sm:inline">HISTORY</span>
                  {userHistory.length > 0 && (
                    <span className="px-1 font-bold bg-black text-white dark:bg-white dark:text-black text-[10px]">
                      {userHistory.length}
                    </span>
                  )}
                </button>

                {/* Admin Switch */}
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => setCurrentView('ADMIN')}
                    className="px-2.5 py-1.5 border border-black dark:border-white font-mono text-[11px] font-bold uppercase bg-black text-white dark:bg-white dark:text-black transition"
                    title="Executive Admin Dashboard"
                  >
                    ADMIN
                  </button>
                )}

                {/* Logout */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-1.5 border border-neutral-300 dark:border-neutral-700 hover:border-black dark:hover:border-white text-neutral-500 hover:text-black dark:hover:text-white transition"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </header>

            <main className="w-full flex-grow flex items-center justify-center py-2">
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
            theme={theme}
            onToggleTheme={toggleTheme}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-3 sm:p-6 transition-colors duration-200">
      <div className="w-full max-w-6xl mx-auto flex-grow flex items-center justify-center">
        {renderMainView()}
      </div>

      {/* Technical Ticker Footer */}
      <footer className="w-full max-w-6xl mx-auto pt-4 mt-8 border-t border-neutral-300 dark:border-neutral-800 font-mono text-[10px] uppercase tracking-widest text-neutral-500 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-black dark:text-white" />
          <span>ACADEMIC AI DIAGNOSTIC ENGINE // REVISION 2026</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsApiKeyModalOpen(true)}
            className="hover:text-black dark:hover:text-white underline underline-offset-2 transition"
          >
            [ MODEL SPECS ]
          </button>
          <button
            onClick={() => setIsRubricModalOpen(true)}
            className="hover:text-black dark:hover:text-white underline underline-offset-2 transition"
          >
            [ RUBRIC CONFIG ]
          </button>
        </div>
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
