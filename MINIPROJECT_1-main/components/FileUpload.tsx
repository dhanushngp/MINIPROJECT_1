import React, { useState, useCallback, useRef } from 'react';
import { Upload, FileText, Camera, Sliders, Check, X, FileCode } from 'lucide-react';
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
      alert('Supported file formats: PDF, JPEG, PNG, or WEBP.');
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
      {/* Dossier Header Label */}
      <div className="flex items-center justify-between px-1 mb-2 font-mono text-[11px] uppercase tracking-widest text-neutral-500">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-black dark:bg-white inline-block" />
          INTAKE CONSOLE // HANDWRITING UPLOAD
        </span>
        <span>REF: SEC-01</span>
      </div>

      {/* Main Intake Box */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && !selectedFile && inputRef.current?.click()}
        className={`relative p-8 border transition-all duration-200 cursor-pointer text-center group crosshair-corner ${
          disabled ? 'cursor-not-allowed opacity-50' : ''
        } ${
          dragActive
            ? 'border-black dark:border-white bg-neutral-100 dark:bg-neutral-900 ring-1 ring-black dark:ring-white'
            : selectedFile
            ? 'border-black dark:border-white bg-white dark:bg-[#0a0a0a]'
            : 'border-neutral-300 dark:border-neutral-800 bg-white dark:bg-[#0c0c0c] hover:border-black dark:hover:border-neutral-500'
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
          <div className="flex flex-col items-center justify-center view-fade-in font-mono">
            {previewThumbnail ? (
              <div className="w-28 h-36 border border-black dark:border-white p-1 mb-3 bg-white dark:bg-black shadow-md relative group/thumb">
                <img src={previewThumbnail} alt="Preview" className="w-full h-full object-cover grayscale" />
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity text-white text-[10px] font-bold">
                  PREVIEW VERIFIED
                </div>
              </div>
            ) : (
              <div className="p-4 border border-black dark:border-white mb-3 bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white">
                <FileText className="w-8 h-8" />
              </div>
            )}

            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-sm tracking-wide text-black dark:text-white truncate max-w-md">
                {selectedFile.name}
              </span>
              <button
                type="button"
                onClick={handleClear}
                className="p-1 border border-neutral-300 dark:border-neutral-700 hover:border-black dark:hover:border-white text-neutral-500 hover:text-black dark:hover:text-white transition"
                title="Discard file"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-neutral-500 font-mono mt-1">
              <span>SIZE: {(selectedFile.size / 1024).toFixed(1)} KB</span>
              <span>•</span>
              <span className="text-black dark:text-white font-bold">[ READY FOR EVALUATION ]</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <div className="w-12 h-12 border border-black dark:border-white mb-4 flex items-center justify-center transition-transform group-hover:-translate-y-1 bg-white text-black dark:bg-black dark:text-white">
              <Upload className="w-5 h-5" />
            </div>

            <h3 className="text-base font-bold tracking-tight mb-1 uppercase font-mono text-black dark:text-white">
              Drop Handwritten Examination Sheet
            </h3>
            <p className="text-xs mb-5 font-mono text-neutral-500 dark:text-neutral-400">
              PDF, JPEG, PNG, OR WEBP (MAX 20MB)
            </p>

            <div className="flex items-center gap-2 font-mono">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  inputRef.current?.click();
                }}
                disabled={disabled}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider border border-black dark:border-white bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 transition"
              >
                [ BROWSE LOCAL FILES ]
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCameraOpen(true);
                }}
                disabled={disabled}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white hover:border-black dark:hover:border-white transition"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>CAMERA SCAN</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-3 p-2.5 border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#0c0c0c] font-mono text-[11px]">
        <div className="flex flex-wrap items-center gap-2 text-neutral-600 dark:text-neutral-400">
          <span>SUBJECT: <strong className="text-black dark:text-white">{subjectName}</strong></span>
          <span>//</span>
          <span>RUBRIC: <strong className="text-black dark:text-white uppercase">{rubricName}</strong></span>
        </div>

        <button
          type="button"
          onClick={onOpenSettings}
          className="flex items-center gap-1.5 font-bold uppercase text-black dark:text-white hover:underline transition"
        >
          <Sliders className="w-3 h-3" />
          <span>[ EDIT CRITERIA ]</span>
        </button>
      </div>

      {/* Camera Modal */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(file) => processFile(file)}
      />
    </div>
  );
};

export default FileUpload;