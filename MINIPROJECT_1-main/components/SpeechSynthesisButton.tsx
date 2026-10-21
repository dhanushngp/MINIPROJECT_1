import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Pause, Play } from 'lucide-react';

interface SpeechSynthesisButtonProps {
  text: string;
  label?: string;
  className?: string;
}

const SpeechSynthesisButton: React.FC<SpeechSynthesisButtonProps> = ({
  text,
  label = 'Listen',
  className = ''
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setSupported(false);
    }
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleToggle = () => {
    if (!supported) return;

    if (isPlaying) {
      if (isPaused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      } else {
        window.speechSynthesis.pause();
        setIsPaused(true);
      }
    } else {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*#_`]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };

      utterance.onerror = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };

      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
      setIsPaused(false);
    }
  };

  const handleStop = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (supported) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }
  };

  if (!supported) return null;

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <button
        type="button"
        onClick={handleToggle}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold uppercase rounded-none bg-neutral-100 text-black hover:bg-neutral-200 border border-neutral-300 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800 dark:border-neutral-700 transition-all duration-150"
        title={isPlaying ? (isPaused ? "Resume audio" : "Pause audio") : "Listen to audio critique"}
      >
        {isPlaying ? (
          isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />
        ) : (
          <Volume2 className="w-3.5 h-3.5" />
        )}
        <span>{isPlaying ? (isPaused ? '[ RESUME ]' : '[ PAUSE ]') : `[ ${label.toUpperCase()} ]`}</span>
      </button>

      {isPlaying && (
        <button
          type="button"
          onClick={handleStop}
          className="p-1.5 text-xs font-mono rounded-none bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 border border-neutral-400 dark:border-neutral-600 transition-all duration-150"
          title="Stop reading"
        >
          <VolumeX className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export default SpeechSynthesisButton;
