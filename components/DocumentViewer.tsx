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
    <div className={`bg-slate-900 border border-slate-700/80 rounded-xl overflow-hidden flex flex-col shadow-2xl transition-all duration-300 ${
      isFullscreen ? 'fixed inset-4 z-50 bg-slate-950/95 backdrop-blur-md' : 'w-full h-[520px]'
    }`}>
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 bg-slate-800/90 border-b border-slate-700 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-900/80 p-0.5 rounded-lg border border-slate-700">
            <button
              onClick={() => setActiveTab('image')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                activeTab === 'image' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Handwritten Paper
            </button>
            {extractedText && (
              <button
                onClick={() => setActiveTab('transcription')}
                className={`px-3 py-1 rounded-md font-medium transition-all ${
                  activeTab === 'transcription' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                AI OCR Transcript
              </button>
            )}
          </div>
          <span className="text-slate-400 truncate max-w-[180px] font-mono hidden sm:inline" title={filename}>
            {filename}
          </span>
        </div>

        {activeTab === 'image' && (
          <div className="flex items-center gap-1">
            <button
              onClick={handleZoomIn}
              className="p-1.5 rounded-md hover:bg-slate-700 text-slate-300 hover:text-white transition"
              title="Zoom In (+)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <span className="w-12 text-center font-mono">{Math.round(scale * 100)}%</span>
            <button
              onClick={handleZoomOut}
              className="p-1.5 rounded-md hover:bg-slate-700 text-slate-300 hover:text-white transition"
              title="Zoom Out (-)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleRotate}
              className="p-1.5 rounded-md hover:bg-slate-700 text-slate-300 hover:text-white transition"
              title="Rotate 90°"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsInverted(!isInverted)}
              className={`p-1.5 rounded-md transition ${isInverted ? 'bg-amber-500/20 text-amber-300' : 'hover:bg-slate-700 text-slate-300'}`}
              title="High Contrast / Invert Ink (Faint Handwriting mode)"
            >
              {isInverted ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={handleReset}
              className="p-1.5 rounded-md hover:bg-slate-700 text-slate-300 hover:text-white transition"
              title="Reset View"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-md hover:bg-slate-700 text-blue-400 hover:text-blue-300 transition ml-1"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-slate-950/80 relative select-none">
        {activeTab === 'image' ? (
          previewUrl ? (
            <div
              className="transition-transform duration-200 ease-out origin-center flex items-center justify-center"
              style={{
                transform: `scale(${scale}) rotate(${rotation}deg)`,
                filter: isInverted ? 'invert(1) hue-rotate(180deg) contrast(1.3)' : 'none',
              }}
            >
              <img
                src={previewUrl}
                alt={filename}
                className="max-h-[440px] max-w-full rounded-lg shadow-2xl object-contain border border-slate-700"
              />
            </div>
          ) : (
            <div className="text-center text-slate-500">
              <Eye className="w-12 h-12 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No preview available for this file type</p>
            </div>
          )
        ) : (
          <div className="w-full h-full p-4 overflow-y-auto text-left text-sm font-mono text-slate-300 leading-relaxed bg-slate-900/90 rounded-lg border border-slate-800 whitespace-pre-wrap select-text">
            {extractedText || 'No extracted OCR transcript text available.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentViewer;
