import React, { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCw, RefreshCw, Maximize2, Minimize2, Eye, Sun, Moon } from 'lucide-react';

interface DocumentViewerProps {
  previewUrl?: string;
  filename?: string;
  extractedText?: string;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({
  previewUrl,
  filename = 'Document',
  extractedText
}) => {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isInverted, setIsInverted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<'image' | 'transcription'>('image');

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);
  const handleReset = () => {
    setScale(1);
    setRotation(0);
    setIsInverted(false);
  };

  return (
    <div className={`border rounded-2xl overflow-hidden flex flex-col shadow-2xl transition-all duration-300 bg-white border-neutral-300 dark:bg-neutral-950 dark:border-neutral-800 ${
      isFullscreen ? 'fixed inset-4 z-50 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md' : 'w-full h-[520px]'
    }`}>
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b text-xs bg-neutral-100 border-neutral-300 text-neutral-800 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-300">
        <div className="flex items-center gap-2">
          <div className="flex p-0.5 rounded-lg border bg-neutral-200 border-neutral-300 dark:bg-neutral-950 dark:border-neutral-800">
            <button
              onClick={() => setActiveTab('image')}
              className={`px-3 py-1 rounded-md font-bold transition-all ${
                activeTab === 'image'
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                  : 'text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white'
              }`}
            >
              Handwritten Paper
            </button>
            {extractedText && (
              <button
                onClick={() => setActiveTab('transcription')}
                className={`px-3 py-1 rounded-md font-bold transition-all ${
                  activeTab === 'transcription'
                    ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                    : 'text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white'
                }`}
              >
                AI OCR Transcript
              </button>
            )}
          </div>
          <span className="truncate max-w-[180px] font-mono hidden sm:inline text-neutral-500" title={filename}>
            {filename}
          </span>
        </div>

        {activeTab === 'image' && (
          <div className="flex items-center gap-1 font-mono">
            <button
              onClick={handleZoomIn}
              className="p-1.5 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 transition text-black dark:text-white"
              title="Zoom In (+)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <span className="w-12 text-center font-bold">{Math.round(scale * 100)}%</span>
            <button
              onClick={handleZoomOut}
              className="p-1.5 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 transition text-black dark:text-white"
              title="Zoom Out (-)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleRotate}
              className="p-1.5 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 transition text-black dark:text-white"
              title="Rotate 90°"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsInverted(!isInverted)}
              className={`p-1.5 rounded-md transition ${isInverted ? 'bg-black text-white dark:bg-white dark:text-black' : 'hover:bg-neutral-200 dark:hover:bg-neutral-800 text-black dark:text-white'}`}
              title="High Contrast / Invert Ink (Faint Handwriting mode)"
            >
              {isInverted ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={handleReset}
              className="p-1.5 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 transition text-black dark:text-white"
              title="Reset View"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 transition ml-1 text-black dark:text-white"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto p-4 flex items-center justify-center relative select-none bg-neutral-100 dark:bg-neutral-950">
        {activeTab === 'image' ? (
          previewUrl ? (
            <div
              className="transition-transform duration-200 ease-out origin-center flex items-center justify-center"
              style={{
                transform: `scale(${scale}) rotate(${rotation}deg)`,
                filter: isInverted ? 'invert(1) contrast(1.4)' : 'none',
              }}
            >
              <img
                src={previewUrl}
                alt={filename}
                className="max-h-[440px] max-w-full rounded-lg shadow-xl object-contain border border-neutral-300 dark:border-neutral-700"
              />
            </div>
          ) : (
            <div className="text-center text-neutral-400 dark:text-neutral-600">
              <Eye className="w-12 h-12 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium">No preview available for this file type</p>
            </div>
          )
        ) : (
          <div className="w-full h-full p-4 overflow-y-auto text-left text-sm font-mono leading-relaxed rounded-xl border whitespace-pre-wrap select-text bg-white border-neutral-300 text-black dark:bg-neutral-900 dark:border-neutral-800 dark:text-white">
            {extractedText || 'No extracted OCR transcript text available.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentViewer;
