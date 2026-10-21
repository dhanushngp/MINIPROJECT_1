import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface CEOSecurityCheckProps {
  onVerifySuccess: () => void;
  onLogout: () => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

const CEOSecurityCheck: React.FC<CEOSecurityCheckProps> = ({
  onVerifySuccess,
  onLogout,
  theme = 'dark',
  onToggleTheme
}) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const getStoredCode = () => localStorage.getItem('admin_code') || 'ceo112';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === getStoredCode()) {
      onVerifySuccess();
    } else {
      setError('Invalid verification code. Access denied.');
      setCode('');
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (oldPassword === getStoredCode()) {
      if (newPassword.length < 4) {
        setError('New password must be at least 4 characters.');
        return;
      }
      localStorage.setItem('admin_code', newPassword);
      setSuccessMsg('Password updated successfully!');
      setError('');
      setOldPassword('');
      setNewPassword('');
      setTimeout(() => {
        setIsChangingPassword(false);
        setSuccessMsg('');
      }, 1000);
    } else {
      setError('Incorrect old password.');
    }
  };

  const handleReset = () => {
    if (window.confirm("Reset password to default ('ceo112')?")) {
      localStorage.removeItem('admin_code');
      setSuccessMsg('Password reset to default (ceo112).');
      setError('');
      setTimeout(() => {
        setIsChangingPassword(false);
        setSuccessMsg('');
      }, 1500);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto view-fade-in text-black dark:text-white">
      {onToggleTheme && (
        <div className="flex justify-end mb-4">
          <ThemeToggle theme={theme} onToggleTheme={onToggleTheme} />
        </div>
      )}

      <div className="rounded-2xl p-8 border shadow-xl bg-white border-neutral-300 dark:bg-neutral-900/90 dark:border-neutral-800">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center border mb-3 bg-neutral-100 border-neutral-300 text-black dark:bg-neutral-800 dark:border-neutral-700 dark:text-white">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black">
            {isChangingPassword ? 'Change Passcode' : 'Secondary Verification'}
          </h2>
          <p className="text-xs text-neutral-500 mt-2">
            {isChangingPassword ? 'Enter old and new passcode.' : 'Enter the CEO passcode to unlock administrator mode (default: ceo112)'}
          </p>
        </div>

        {!isChangingPassword ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                id="ceo-code"
                type="password"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="block w-full px-3 py-3 rounded-xl border text-center tracking-widest font-mono text-base focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition bg-neutral-50 border-neutral-300 text-black placeholder-neutral-400 dark:bg-neutral-950 dark:border-neutral-700 dark:text-white"
                placeholder="••••••"
                autoFocus
              />
            </div>

            {error && (
              <p className="text-xs font-mono p-3 rounded-xl border text-center bg-neutral-100 border-neutral-300 text-black dark:bg-neutral-950 dark:border-neutral-800 dark:text-white">
                {error}
              </p>
            )}

            <div className="flex flex-col gap-3">
              <button
                type="submit"
                className="w-full py-3 px-4 font-bold text-xs rounded-xl transition shadow-md bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
              >
                Verify Access
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setIsChangingPassword(true); setError(''); }}
                  className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition border bg-neutral-100 text-black border-neutral-300 hover:bg-neutral-200 dark:bg-neutral-950 dark:text-white dark:border-neutral-800 dark:hover:bg-neutral-800"
                >
                  Change Code
                </button>
                <button
                  type="button"
                  onClick={onLogout}
                  className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition border bg-neutral-100 text-black border-neutral-300 hover:bg-neutral-200 dark:bg-neutral-950 dark:text-white dark:border-neutral-800 dark:hover:bg-neutral-800"
                >
                  Logout
                </button>
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase mb-1 text-neutral-500">Old Passcode</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="block w-full px-3 py-2 rounded-xl border text-xs bg-neutral-50 border-neutral-300 text-black dark:bg-neutral-950 dark:border-neutral-700 dark:text-white"
                placeholder="Current passcode"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase mb-1 text-neutral-500">New Passcode</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="block w-full px-3 py-2 rounded-xl border text-xs bg-neutral-50 border-neutral-300 text-black dark:bg-neutral-950 dark:border-neutral-700 dark:text-white"
                placeholder="New passcode (min 4 chars)"
              />
            </div>

            {error && (
              <p className="text-xs p-3 rounded-xl border text-center bg-neutral-100 border-neutral-300 text-black dark:bg-neutral-950 dark:border-neutral-800 dark:text-white">
                {error}
              </p>
            )}
            {successMsg && (
              <p className="text-xs p-3 rounded-xl border text-center font-bold bg-neutral-100 border-neutral-300 text-black dark:bg-neutral-950 dark:border-neutral-800 dark:text-white">
                {successMsg}
              </p>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-2.5 px-3 font-bold text-xs rounded-xl transition bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
              >
                Update
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-2.5 font-bold text-xs rounded-xl border transition border-neutral-300 text-neutral-600 hover:text-black dark:border-neutral-700 dark:text-neutral-400 dark:hover:text-white"
                title="Reset to default code"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => { setIsChangingPassword(false); setError(''); }}
                className="flex-1 py-2.5 px-3 font-bold text-xs rounded-xl border transition bg-neutral-100 text-black border-neutral-300 hover:bg-neutral-200 dark:bg-neutral-950 dark:text-white dark:border-neutral-800 dark:hover:bg-neutral-800"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CEOSecurityCheck;
