import React, { useState, useEffect, useMemo } from 'react';

const StreamedText: React.FC<{ text: string }> = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  const words = useMemo(() => text.split(/(\s+)/), [text]);

  useEffect(() => {
    setDisplayedText('');
    if (words && words.length > 0) {
      let i = 0;
      const intervalId = setInterval(() => {
        if (i < words.length) {
          setDisplayedText(prev => prev + words[i]);
          i++;
        } else {
          clearInterval(intervalId);
        }
      }, 30); // Adjust speed of word appearance
      return () => clearInterval(intervalId);
    }
  }, [words]);

  return <p className="text-slate-300 bg-slate-900/50 p-3 rounded-md border-l-4 border-blue-500 whitespace-pre-wrap min-h-[4rem]">{displayedText}</p>;
};

export default StreamedText;
