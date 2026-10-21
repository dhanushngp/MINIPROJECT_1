import React, { useEffect } from 'react';

interface CEOWelcomeProps {
    onComplete: () => void;
}

const CEOWelcome: React.FC<CEOWelcomeProps> = ({ onComplete }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete();
        }, 4000); // Automatically proceed after 4 seconds

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className="flex flex-col items-center justify-center text-center text-white p-8 view-fade-in">
             <div className="mb-6">
                <svg className="w-24 h-24 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                     <path d="M12 22V12"></path>
                </svg>
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight mb-3">
                Welcome, <span className="text-blue-400">CEO</span>
            </h1>
            <p className="text-lg text-slate-300">
                System access granted. Loading administrative dashboard...
            </p>
            <div className="w-full max-w-xs h-1 bg-slate-700 rounded-full overflow-hidden mt-8">
                <div className="h-full w-full animate-shimmer"></div>
            </div>
        </div>
    );
};

export default CEOWelcome;
