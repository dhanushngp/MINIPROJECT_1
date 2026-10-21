import React, { useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';

interface CEOWelcomeProps {
  onComplete: () => void;
}

const CEOWelcome: React.FC<CEOWelcomeProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2800);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 view-fade-in text-black dark:text-white">
      <div className="mb-6 p-4 rounded-3xl border bg-neutral-100 border-neutral-300 text-black dark:bg-neutral-900 dark:border-neutral-800 dark:text-white shadow-xl animate-pulse">
        <ShieldCheck className="w-16 h-16" />
      </div>
      <h1 className="text-4xl font-black tracking-tight mb-2">
        Welcome, Administrator
      </h1>
      <p className="text-sm text-neutral-500">
        System access verified. Loading executive dashboard...
      </p>
      <div className="w-full max-w-xs h-1.5 rounded-full overflow-hidden mt-8 border bg-neutral-200 border-neutral-300 dark:bg-neutral-800 dark:border-neutral-700">
        <div className="h-full w-full animate-shimmer" />
      </div>
    </div>
  );
};

export default CEOWelcome;
