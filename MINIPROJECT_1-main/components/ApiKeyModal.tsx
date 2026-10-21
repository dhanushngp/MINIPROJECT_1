import React, { useState } from 'react';
import { Key, CheckCircle, AlertTriangle, X, Sparkles, Cpu, ExternalLink } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apiKey: string, model: string, useSimulated: boolean) => void;
  currentKey: string;
  currentModel: string;
  isSimulatedDemo: boolean;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentKey,
  currentModel,
  isSimulatedDemo
}) => {
  const [key, setKey] = useState(currentKey);
  const [model, setModel] = useState(currentModel);
  const [isSimulated, setIsSimulated] = useState(isSimulatedDemo);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    if (!key.trim()) {
      setTestStatus('error');
      setTestMessage('Please enter an API key first.');
      return;
    }

    setTestStatus('testing');
    setTestMessage('Pinging Google Gemini API...');

    try {
      const ai = new GoogleGenAI({ apiKey: key.trim() });
      const response = await ai.models.generateContent({
        model: model || 'gemini-2.5-flash',
        contents: 'Say "OK"',
      });

      if (response.text) {
        setTestStatus('success');
        setTestMessage(`Connection successful! Connected to ${model}.`);
      } else {
        throw new Error('No response from Gemini API');
      }
    } catch (err: any) {
      setTestStatus('error');
      setTestMessage(err?.message || 'Connection failed. Verify your API key.');
    }
  };

  const handleSave = () => {
    onSave(key.trim(), model, isSimulated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm view-fade-in text-black dark:text-white">
      <div className="rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border bg-white border-neutral-300 dark:bg-neutral-900 dark:border-neutral-800">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-black dark:hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 rounded-xl border bg-neutral-100 border-neutral-300 text-black dark:bg-neutral-800 dark:border-neutral-700 dark:text-white">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black">Gemini API &amp; Model Settings</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Configure your Google GenAI credentials or demo mode</p>
          </div>
        </div>

        {/* Demo Mode Toggle */}
        <div className="mb-5 p-4 rounded-xl border bg-neutral-50 border-neutral-200 dark:bg-neutral-950 dark:border-neutral-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-black dark:text-white" />
              <label htmlFor="simulated-toggle" className="text-sm font-bold cursor-pointer">
                Simulated AI / Demo Mode
              </label>
            </div>
            <input
              id="simulated-toggle"
              type="checkbox"
              checked={isSimulated}
              onChange={(e) => setIsSimulated(e.target.checked)}
              className="w-5 h-5 accent-black dark:accent-white rounded cursor-pointer"
            />
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1.5 leading-relaxed">
            When enabled, allows instantaneous test evaluations without consuming API quota or requiring a live key.
          </p>
        </div>

        {/* API Key Input */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-neutral-600 dark:text-neutral-400">
              Google Gemini API Key
            </label>
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3.5 py-2.5 rounded-xl font-mono text-sm border focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition bg-neutral-50 border-neutral-300 text-black placeholder-neutral-400 dark:bg-neutral-950 dark:border-neutral-700 dark:text-white"
            />
            <div className="flex justify-between items-center mt-1.5 text-xs text-neutral-500">
              <span>Saved locally in your browser.</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="font-bold underline hover:opacity-80 flex items-center gap-1 inline-flex text-black dark:text-white"
              >
                Get API Key <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Model Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-neutral-600 dark:text-neutral-400">
              Gemini Vision Model
            </label>
            <div className="relative">
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white appearance-none pr-10 font-medium bg-neutral-50 border-neutral-300 text-black dark:bg-neutral-950 dark:border-neutral-700 dark:text-white"
              >
                <option value="gemini-2.5-flash">Gemini 2.5 Flash (Recommended - Fastest Multimodal)</option>
                <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
              </select>
              <Cpu className="w-4 h-4 absolute right-3.5 top-3 pointer-events-none text-neutral-400" />
            </div>
          </div>

          {/* Test Status Banner */}
          {testStatus !== 'idle' && (
            <div className="p-3 rounded-xl text-xs flex items-center gap-2 border bg-neutral-100 border-neutral-300 text-black dark:bg-neutral-950 dark:border-neutral-700 dark:text-white">
              {testStatus === 'testing' && <span className="animate-spin mr-1">⟳</span>}
              {testStatus === 'success' && <CheckCircle className="w-4 h-4 shrink-0" />}
              {testStatus === 'error' && <AlertTriangle className="w-4 h-4 shrink-0" />}
              <span className="truncate font-mono">{testMessage}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={testStatus === 'testing'}
            className="px-4 py-2 text-xs font-bold rounded-xl transition border bg-neutral-100 text-black border-neutral-300 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-white dark:border-neutral-700 dark:hover:bg-neutral-700 disabled:opacity-50"
          >
            {testStatus === 'testing' ? 'Testing...' : 'Test Connection'}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold transition text-neutral-500 hover:text-black dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 text-xs font-bold rounded-xl transition shadow-md bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;
