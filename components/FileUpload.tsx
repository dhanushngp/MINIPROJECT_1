import React, { useState, useCallback, useRef } from 'react';
import { Upload, FileText, Camera, Sliders, CheckCircle2, X, AlertCircle } from 'lucide-react';
import CameraModal from './CameraModal';

interface FileUploadProps {
  onFileUpload: (file: File, previewUrl?: string) => void;
  disabled: boolean;
  selectedFile: File | null;
  onClearFile: () => void;
  onOpenSettings: () => void;
  subjectName: string;
  rubricName: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileUpload,
  disabled,
  selectedFile,
  onClearFile,
  onOpenSettings,
  subjectName,
  rubricName
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [previewThumbnail, setPreviewThumbnail] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback((file: File) => {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid file type: PDF, JPEG, PNG, or WEBP.');
      return;
    }

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        setPreviewThumbnail(url);
        onFileUpload(file, url);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewThumbnail(null);
      onFileUpload(file);
    }
  }, [onFileUpload]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [processFile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewThumbnail(null);
    onClearFile();
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Upload Box */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && !selectedFile && inputRef.current?.click()}
        className={`relative p-8 border-2 border-dashed rounded-2xl transition-all duration-300 ease-in-out cursor-pointer text-center group ${
          disabled ? 'cursor-not-allowed opacity-50' : ''
        } ${
          dragActive
            ? 'border-blue-400 bg-blue-950/30 scale-[1.02] shadow-2xl shadow-blue-500/20'
            : selectedFile
            ? 'border-emerald-500/80 bg-slate-900/80'
            : 'border-slate-700 hover:border-blue-500/80 hover:bg-slate-800/40'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept=".pdf,.jpeg,.jpg,.png,.webp"
          onChange={handleChange}
          disabled={disabled}
        />

        {selectedFile ? (
          <div className="flex flex-col items-center justify-center view-fade-in">
            {previewThumbnail ? (
              <div className="w-24 h-32 rounded-lg border border-slate-700 overflow-hidden mb-3 shadow-lg relative group/thumb">
                <img src={previewThumbnail} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                </div>
              </div>
            ) : (
              <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/30 text-emerald-400 mb-3">
                <FileText className="w-10 h-10" />
              </div>
            )}

            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-white truncate max-w-md text-base">{selectedFile.name}</span>
              <button
                type="button"
                onClick={handleClear}
                className="p-1 rounded-full bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-slate-700 transition"
                title="Remove file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-400">
              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for AI Evaluation
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-400">
            <div className="p-4 bg-slate-800/80 text-blue-400 rounded-2xl border border-slate-700/80 mb-4 group-hover:scale-110 group-hover:bg-blue-600/20 group-hover:text-blue-300 transition-all duration-300 shadow-lg">
              <Upload className="w-10 h-10" />
            </div>

            <h3 className="text-lg font-bold text-white mb-1">
              Drop your handwritten paper here
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Supports scanned PDF, JPEG, PNG, or WEBP (up to 20MB)
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  inputRef.current?.click();
                }}
                disabled={disabled}
                className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition shadow-lg shadow-blue-600/30"
              >
                Browse Files
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCameraOpen(true);
                }}
                disabled={disabled}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition border border-slate-700"
              >
                <Camera className="w-3.5 h-3.5 text-blue-400" />
                Scan with Camera
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Rubric Badge & Quick Settings Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-4 px-2 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-slate-800/90 border border-slate-700 text-slate-300 font-medium">
            Subject: <strong className="text-blue-400">{subjectName}</strong>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-800/90 border border-slate-700 text-slate-300 font-medium capitalize">
            Rubric: <strong className="text-indigo-400">{rubricName}</strong>
          </span>
        </div>

        <button
          type="button"
          onClick={onOpenSettings}
          className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition font-medium"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Customize Options</span>
        </button>
      </div>

      {/* Camera Capture Modal */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(file) => processFile(file)}
      />
    </div>
  );
};

export default FileUpload;