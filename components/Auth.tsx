import React, { useState } from 'react';
import { Eye, EyeOff, Sparkles, Shield, UserCheck, ArrowRight } from 'lucide-react';

interface AuthProps {
  onLogin: (email: string, pass: string) => { success: boolean; message?: string };
  onSignup: (email: string, pass: string) => { success: boolean; message?: string };
  onQuickDemoLogin?: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin, onSignup, onQuickDemoLogin }) => {
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
    <div className="w-full max-w-md mx-auto view-fade-in p-4 text-slate-200">
      <header className="text-center mb-6">
        <div className="inline-flex p-3 bg-blue-600/20 text-blue-400 rounded-2xl border border-blue-500/30 mb-3 shadow-lg shadow-blue-500/20">
          <Sparkles className="w-8 h-8 text-blue-400" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          AI Answer <span className="text-blue-400">Evaluator</span>
        </h1>
        <p className="mt-1.5 text-xs text-slate-400">
          Multimodal AI evaluation for handwritten exams, assignments, and study notes
        </p>
      </header>

      {/* Main Card */}
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-2xl p-6 sm:p-8">
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 mb-6 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setIsLoginView(true);
              setError(null);
            }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              isLoginView ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
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
              !isLoginView ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@university.edu"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 transition font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-xs text-red-300 text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 px-4 font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition shadow-lg shadow-blue-600/30 mt-2"
          >
            {isLoginView ? 'Sign In to Dashboard' : 'Create Student Account'}
          </button>
        </form>

        {/* Demo Fast Login Shortcuts */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block text-center mb-2.5">
            Quick Demo Shortcuts
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={fillStudentCredentials}
              className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition border border-slate-700"
              title="Pre-fill Student demo credentials"
            >
              <UserCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Student Demo</span>
            </button>
            <button
              type="button"
              onClick={fillAdminCredentials}
              className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition border border-slate-700"
              title="Pre-fill CEO / Admin credentials (pass: test112 / code: ceo112)"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin / CEO</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;