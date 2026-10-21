import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onToggleTheme, className = '' }) => {
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={onToggleTheme}
      className={`group relative inline-flex items-center gap-2 px-3 py-1.5 rounded-none border text-[11px] font-mono tracking-wider transition-all duration-150 select-none uppercase ${
        isDark
          ? 'bg-black text-white border-neutral-700 hover:border-white hover:bg-neutral-900'
          : 'bg-white text-black border-neutral-300 hover:border-black hover:bg-neutral-100'
      } ${className}`}
      title={isDark ? "Switch to Architectural Light Mode" : "Switch to Stealth Dark Mode"}
      aria-label="Toggle Dark and Light Mode"
    >
      <span className="flex items-center gap-1.5 font-mono font-bold">
        {isDark ? (
          <>
            <Sun className="w-3.5 h-3.5 text-white transition-transform group-hover:rotate-45" />
            <span>THEME // LIGHT</span>
          </>
        ) : (
          <>
            <Moon className="w-3.5 h-3.5 text-black transition-transform group-hover:-rotate-12" />
            <span>THEME // DARK</span>
          </>
        )}
      </span>
      <span className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white animate-pulse" />
    </button>
  );
};

export default ThemeToggle;
