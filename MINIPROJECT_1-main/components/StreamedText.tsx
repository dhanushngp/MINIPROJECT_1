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
      }, 25);
      return () => clearInterval(intervalId);
    }
  }, [words]);

  return (
    <p className="p-3 rounded-xl border-l-4 border-black dark:border-white bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-800 whitespace-pre-wrap min-h-[4rem] leading-relaxed">
      {displayedText}
    </p>
  );
};

export default StreamedText;
