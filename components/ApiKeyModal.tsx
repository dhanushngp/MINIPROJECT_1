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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm view-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-slate-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Gemini API &amp; Model Settings</h3>
            <p className="text-xs text-slate-400">Configure your Google GenAI credentials or demo mode</p>
          </div>
        </div>

        {/* Demo Mode Toggle */}
        <div className="mb-5 p-4 rounded-xl bg-slate-800/80 border border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <label htmlFor="simulated-toggle" className="text-sm font-semibold text-white cursor-pointer">
                Simulated AI / Demo Mode
              </label>
            </div>
            <input
              id="simulated-toggle"
              type="checkbox"
              checked={isSimulated}
              onChange={(e) => setIsSimulated(e.target.checked)}
              className="w-5 h-5 text-blue-600 bg-slate-900 border-slate-600 rounded focus:ring-blue-500 cursor-pointer"
            />
          </div>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            When enabled, allows instantaneous test evaluations without consuming API quota or requiring a live key.
          </p>
        </div>

        {/* API Key Input */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Google Gemini API Key
            </label>
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-sm placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            <div className="flex justify-between items-center mt-1.5 text-xs text-slate-400">
              <span>Saved locally in your browser.</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 hover:text-blue-300 flex items-center gap-1 inline-flex"
              >
                Get API Key <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Model Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Gemini Vision Model
            </label>
            <div className="relative">
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-10"
              >
                <option value="gemini-2.5-flash">Gemini 2.5 Flash (Recommended - Fastest Multimodal)</option>
                <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
              </select>
              <Cpu className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Test Status Banner */}
          {testStatus !== 'idle' && (
            <div className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
              testStatus === 'testing' ? 'bg-blue-900/30 border-blue-500/40 text-blue-300' :
              testStatus === 'success' ? 'bg-emerald-900/30 border-emerald-500/40 text-emerald-300' :
              'bg-red-900/30 border-red-500/40 text-red-300'
            }`}>
              {testStatus === 'testing' && <span className="animate-spin mr-1">⟳</span>}
              {testStatus === 'success' && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
              {testStatus === 'error' && <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />}
              <span className="truncate">{testMessage}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 mt-6 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={testStatus === 'testing'}
            className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition border border-slate-700 disabled:opacity-50"
          >
            {testStatus === 'testing' ? 'Testing...' : 'Test Connection'}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition shadow-lg shadow-blue-600/30"
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
