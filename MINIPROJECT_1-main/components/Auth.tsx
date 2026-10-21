import React, { useState } from 'react';
import { Eye, EyeOff, Sparkles, Shield, UserCheck } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface AuthProps {
  onLogin: (email: string, pass: string) => { success: boolean; message?: string };
  onSignup: (email: string, pass: string) => { success: boolean; message?: string };
  onQuickDemoLogin?: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin, onSignup, theme, onToggleTheme }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    const result = isLoginView ? onLogin(email, password) : onSignup(email, password);
    if (!result.success) {
      setError(result.message || 'Authentication error.');
    }
  };

  const fillAdminCredentials = () => {
    setEmail('dhanush31101@gmail.com');
    setPassword('test112');
    setError(null);
  };

  const fillStudentCredentials = () => {
    setEmail('student@university.edu');
    setPassword('student123');
    setError(null);
  };

  return (
    <div className="w-full max-w-md mx-auto view-fade-in p-4 text-black dark:text-white relative">
      {/* Top Bar with Dark/Light Mode Switcher */}
      <div className="flex justify-end mb-4">
        <ThemeToggle theme={theme} onToggleTheme={onToggleTheme} />
      </div>

      <header className="text-center mb-6">
        <div className="inline-flex p-3 rounded-2xl border mb-3 shadow-md bg-neutral-100 border-neutral-300 text-black dark:bg-neutral-900 dark:border-neutral-800 dark:text-white">
          <Sparkles className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black tracking-tight">
          AI Answer Evaluator
        </h1>
        <p className="mt-1.5 text-xs text-neutral-600 dark:text-neutral-400">
          Multimodal AI evaluation for handwritten exams, assignments, and study notes
        </p>
      </header>

      {/* Main Card */}
      <div className="rounded-2xl shadow-xl p-6 sm:p-8 border bg-white border-neutral-300 dark:bg-neutral-900/90 dark:border-neutral-800">
        <div className="flex p-1 rounded-xl border mb-6 text-xs font-bold bg-neutral-100 border-neutral-300 dark:bg-neutral-950 dark:border-neutral-800">
          <button
            type="button"
            onClick={() => {
              setIsLoginView(true);
              setError(null);
            }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              isLoginView
                ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                : 'text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLoginView(false);
              setError(null);
            }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              !isLoginView
                ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                : 'text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-neutral-600 dark:text-neutral-400">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@university.edu"
              className="w-full px-3.5 py-2.5 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition bg-neutral-50 border-neutral-300 text-black placeholder-neutral-400 dark:bg-neutral-950 dark:border-neutral-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-neutral-600 dark:text-neutral-400">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white pr-10 transition font-mono bg-neutral-50 border-neutral-300 text-black placeholder-neutral-400 dark:bg-neutral-950 dark:border-neutral-700 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-neutral-400 hover:text-black dark:hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl text-xs text-center border bg-neutral-100 border-neutral-300 text-black dark:bg-neutral-950 dark:border-neutral-700 dark:text-white font-mono">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 px-4 font-bold text-xs rounded-xl transition shadow-md mt-2 bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
          >
            {isLoginView ? 'Sign In to Dashboard' : 'Create Student Account'}
          </button>
        </form>

        {/* Demo Fast Login Shortcuts */}
        <div className="mt-6 pt-5 border-t border-neutral-200 dark:border-neutral-800">
          <span className="text-[11px] font-bold uppercase tracking-wider block text-center mb-2.5 text-neutral-500">
            Quick Demo Shortcuts
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={fillStudentCredentials}
              className="flex items-center justify-center gap-1.5 p-2 rounded-xl transition border bg-neutral-100 text-black border-neutral-300 hover:bg-neutral-200 dark:bg-neutral-950 dark:text-white dark:border-neutral-700 dark:hover:bg-neutral-800 font-bold"
              title="Pre-fill Student demo credentials"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Student Demo</span>
            </button>
            <button
              type="button"
              onClick={fillAdminCredentials}
              className="flex items-center justify-center gap-1.5 p-2 rounded-xl transition border bg-neutral-100 text-black border-neutral-300 hover:bg-neutral-200 dark:bg-neutral-950 dark:text-white dark:border-neutral-700 dark:hover:bg-neutral-800 font-bold"
              title="Pre-fill CEO / Admin credentials"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin / CEO</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;