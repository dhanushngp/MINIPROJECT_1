import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, X, Check, AlertCircle } from 'lucide-react';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (file: File) => void;
}

const CameraModal: React.FC<CameraModalProps> = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    setCameraError(null);
    setCapturedImage(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: 'environment',
        },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError('Unable to access camera. Please allow camera permissions or upload an image file instead.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const handleTakePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      setCapturedImage(dataUrl);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  const handleConfirm = () => {
    if (!capturedImage) return;
    const arr = capturedImage.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    const filename = `Exam_Paper_Snapshot_${Date.now()}.jpg`;
    const file = new File([u8arr], filename, { type: mime });
    onCapture(file);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm view-fade-in text-black dark:text-white">
      <div className="rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative border bg-white border-neutral-300 dark:bg-neutral-900 dark:border-neutral-800">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-black dark:hover:text-white transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl border bg-neutral-100 border-neutral-300 text-black dark:bg-neutral-800 dark:border-neutral-700 dark:text-white">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black">Live Camera Document Scanner</h3>
            <p className="text-xs text-neutral-500">Position your handwritten sheet inside the frame</p>
          </div>
        </div>

        {/* Viewfinder / Capture display */}
        <div className="relative aspect-[4/3] bg-black rounded-xl overflow-hidden border border-neutral-800 flex items-center justify-center">
          {cameraError ? (
            <div className="text-center p-6 max-w-sm text-neutral-400">
              <AlertCircle className="w-10 h-10 mx-auto mb-2 opacity-80" />
              <p className="text-sm font-medium">{cameraError}</p>
            </div>
          ) : capturedImage ? (
            <img src={capturedImage} alt="Captured Paper" className="w-full h-full object-contain" />
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {/* Document Alignment Frame */}
              <div className="absolute inset-8 border-2 border-dashed border-white/70 rounded-lg pointer-events-none flex flex-col justify-between p-3">
                <span className="text-[11px] font-mono bg-black/80 text-white px-2 py-0.5 rounded self-start">
                  Align paper inside frame
                </span>
                <span className="text-[11px] font-mono bg-black/80 text-white px-2 py-0.5 rounded self-end">
                  Ensure good lighting
                </span>
              </div>
            </>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-neutral-500 hover:text-black dark:hover:text-white transition"
          >
            Cancel
          </button>

          {!cameraError && (
            <div className="flex items-center gap-3">
              {capturedImage ? (
                <>
                  <button
                    type="button"
                    onClick={handleRetake}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition border bg-neutral-100 text-black border-neutral-300 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-white dark:border-neutral-700 dark:hover:bg-neutral-700"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Retake
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirm}
                    className="flex items-center gap-1.5 px-6 py-2 text-xs font-bold rounded-xl transition shadow-md bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                  >
                    <Check className="w-3.5 h-3.5" /> Use Photo
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleTakePhoto}
                  className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold rounded-xl transition shadow-md bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                >
                  <Camera className="w-4 h-4" /> Capture Snapshot
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CameraModal;
