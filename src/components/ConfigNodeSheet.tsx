import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import type { FlowNode } from '../store/flowStore';
import { useState, useEffect } from 'react';

interface ConfigNodeSheetProps {
  node: FlowNode | null;
  onClose: () => void;
  onSave: (id: string, config: Record<string, any>) => void;
}

export function ConfigNodeSheet({ node, onClose, onSave }: ConfigNodeSheetProps) {
  const [configParams, setConfigParams] = useState<Record<string, any>>({});

  useEffect(() => {
    if (node) {
      setConfigParams(node.config || {});
    }
  }, [node]);

  if (!node) return null;

  const handleSave = () => {
    onSave(node.id, configParams);
    onClose();
  };

  const renderConfigForm = () => {
    switch (node.type) {
      case 'action_sheets':
        return (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Spreadsheet ID</label>
              <input 
                type="text" 
                value={configParams.sheetId || ''}
                onChange={(e) => setConfigParams({...configParams, sheetId: e.target.value})}
                placeholder="1BxiMVs0XRY..."
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Action</label>
              <select 
                value={configParams.action || 'read'}
                onChange={(e) => setConfigParams({...configParams, action: e.target.value})}
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="read">Read Row</option>
                <option value="append">Append Row</option>
                <option value="update">Update Row</option>
              </select>
            </div>
          </div>
        );
      case 'action_gmail':
        return (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">To Email</label>
              <input 
                type="email" 
                value={configParams.to || ''}
                onChange={(e) => setConfigParams({...configParams, to: e.target.value})}
                placeholder="user@example.com"
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Subject</label>
              <input 
                type="text"
                value={configParams.subject || ''}
                onChange={(e) => setConfigParams({...configParams, subject: e.target.value})}
                placeholder="Automated alert"
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
        );
      case 'action_agent':
        return (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">AI Provider</label>
              <select 
                value={configParams.provider || 'openai'}
                onChange={(e) => setConfigParams({...configParams, provider: e.target.value})}
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="openai">OpenAI</option>
                <option value="anthropic">Anthropic</option>
                <option value="gemini">Google Gemini</option>
                <option value="custom">Custom (OpenAI Compatible)</option>
              </select>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Model Name</label>
              <input 
                type="text" 
                value={configParams.model || ''}
                onChange={(e) => setConfigParams({...configParams, model: e.target.value})}
                placeholder={configParams.provider === 'anthropic' ? 'claude-3-opus-20240229' : 'gpt-4o'}
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">API Key</label>
              <input 
                type="password" 
                value={configParams.apiKey || ''}
                onChange={(e) => setConfigParams({...configParams, apiKey: e.target.value})}
                placeholder="sk-..."
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            {configParams.provider === 'custom' && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">Base URL</label>
                <input 
                  type="url" 
                  value={configParams.baseUrl || ''}
                  onChange={(e) => setConfigParams({...configParams, baseUrl: e.target.value})}
                  placeholder="https://api.custom.ai/v1"
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">System Prompt</label>
              <textarea 
                value={configParams.prompt || ''}
                onChange={(e) => setConfigParams({...configParams, prompt: e.target.value})}
                placeholder="You are a helpful assistant..."
                rows={4}
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
        );
      default:
        return (
          <div className="text-center text-slate-400 py-6">
            Basic configuration for {node.name}
          </div>
        );
    }
  };

  return (
    <AnimatePresence>
      {node && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40"
          />
          <motion.div 
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 h-[70vh] bg-slate-900 border-t border-slate-700/50 rounded-t-3xl z-50 flex flex-col shadow-2xl"
          >
            <div className="flex-none p-4 pb-2 border-b border-slate-800 flex justify-between items-center">
              <button onClick={onClose} className="p-2 bg-slate-800 rounded-full text-slate-400">
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-base font-semibold text-slate-100 text-center flex-1">Configure {node.name}</h2>
              <button onClick={handleSave} className="p-2 bg-primary text-white rounded-full">
                <Check className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {renderConfigForm()}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
