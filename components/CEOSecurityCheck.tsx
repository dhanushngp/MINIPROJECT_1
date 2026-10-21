import React, { useState } from 'react';

interface CEOSecurityCheckProps {
    onVerifySuccess: () => void;
    onLogout: () => void;
}

const CEOSecurityCheck: React.FC<CEOSecurityCheckProps> = ({ onVerifySuccess, onLogout }) => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // Load password from local storage or use default
    const getStoredCode = () => localStorage.getItem('admin_code') || "ceo112";

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
        if (window.confirm("Are you sure you want to reset the password to the default 'ceo112'?")) {
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
        <div className="w-full max-w-sm mx-auto view-fade-in">
            <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-xl shadow-2xl p-8">
                <div className="text-center mb-6">
                    <svg className="w-16 h-16 text-yellow-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <h2 className="text-2xl font-bold text-white mt-4">
                        {isChangingPassword ? 'Change Password' : 'Secondary Verification'}
                    </h2>
                    <p className="text-slate-300 mt-2">
                        {isChangingPassword ? 'Enter your old and new password.' : 'Enter the CEO verification code to access the admin dashboard.'}
                    </p>
                </div>

                {!isChangingPassword ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="ceo-code" className="sr-only">CEO Code</label>
                            <input
                                id="ceo-code"
                                type="password"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="block w-full px-3 py-3 bg-slate-900 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-center tracking-widest font-mono"
                                placeholder="••••••"
                                autoFocus
                            />
                        </div>

                        {error && <p className="text-sm text-red-400 bg-red-900/50 p-3 rounded-md text-center">{error}</p>}

                        <div className="flex flex-col gap-4">
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-500 transition-colors"
                            >
                                Verify Access
                            </button>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => { setIsChangingPassword(true); setError(''); }}
                                    className="flex-1 py-3 px-4 border border-slate-600 rounded-md shadow-sm text-sm font-medium text-slate-300 bg-transparent hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-slate-500 transition-colors"
                                >
                                    Change Password
                                </button>
                                <button
                                    type="button"
                                    onClick={onLogout}
                                    className="flex-1 py-3 px-4 border border-slate-600 rounded-md shadow-sm text-sm font-medium text-slate-300 bg-transparent hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-slate-500 transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleChangePassword} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Old Password</label>
                                <input
                                    type="password"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    className="block w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Current code"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">New Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="block w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="New code"
                                />
                            </div>
                        </div>

                        {error && <p className="text-sm text-red-400 bg-red-900/50 p-3 rounded-md text-center">{error}</p>}
                        {successMsg && <p className="text-sm text-green-400 bg-green-900/50 p-3 rounded-md text-center">{successMsg}</p>}

                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="flex-1 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-green-500 transition-colors"
                            >
                                Update
                            </button>
                            <button
                                type="button"
                                onClick={handleReset}
                                className="px-4 border border-red-500/50 rounded-md text-sm font-medium text-red-400 bg-red-900/20 hover:bg-red-900/40 focus:outline-none transition-colors"
                                title="Reset to default password"
                            >
                                Reset
                            </button>
                            <button
                                type="button"
                                onClick={() => { setIsChangingPassword(false); setError(''); }}
                                className="flex-1 py-3 px-4 border border-slate-600 rounded-md shadow-sm text-sm font-medium text-slate-300 bg-transparent hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-slate-500 transition-colors"
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
