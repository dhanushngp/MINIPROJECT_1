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
      const cleanText = text.replace(/[*#_`]/g, ''); // strip markdown
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
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 border border-blue-500/30 transition-all duration-200"
        title={isPlaying ? (isPaused ? "Resume audio" : "Pause audio") : "Listen to audio feedback"}
      >
        {isPlaying ? (
          isPaused ? <Play className="w-3.5 h-3.5 text-blue-400" /> : <Pause className="w-3.5 h-3.5 text-blue-400" />
        ) : (
          <Volume2 className="w-3.5 h-3.5 text-blue-400" />
        )}
        <span>{isPlaying ? (isPaused ? 'Resume' : 'Pause') : label}</span>
      </button>

      {isPlaying && (
        <button
          type="button"
          onClick={handleStop}
          className="p-1.5 text-xs rounded-lg bg-red-600/20 text-red-300 hover:bg-red-600/30 border border-red-500/30 transition-all duration-200"
          title="Stop reading"
        >
          <VolumeX className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export default SpeechSynthesisButton;
