import { useState } from 'react';
import { Play, Settings, Menu, Plus, Terminal, Layers, History } from 'lucide-react';

import { useFlowStore } from '../store/flowStore';
import { getTranslation } from '../lib/i18n';
import type { Language } from '../lib/i18n';
import { ExecutionLogsSheet } from './ExecutionLogsSheet';
import { CredentialsSheet } from './CredentialsSheet';
import { FlowListSheet } from './FlowListSheet';

interface MobileLayoutProps {
  children: React.ReactNode;
  onAddClick: () => void;
}

export function MobileLayout({ children, onAddClick }: MobileLayoutProps) {
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [isCredsOpen, setIsCredsOpen] = useState(false);
  const [isFlowsOpen, setIsFlowsOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const { isSimulating, startSimulation, stopSimulation } = useFlowStore();

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      await useFlowStore.getState().saveFlow();
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };
  const lang: Language = 'my';

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 font-sans selection:bg-primary/30 overflow-hidden">
      <header className="glass fixed top-0 w-full h-16 px-4 flex items-center justify-between z-40 border-b border-slate-700/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            {getTranslation(lang, 'app_title')}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {isSimulating ? (
            <button 
              onClick={stopSimulation}
              className="h-10 px-4 bg-red-500/20 text-red-400 border border-red-500/30 rounded-full text-xs font-bold flex items-center gap-2 active:scale-95 transition-all animate-pulse"
            >
              <div className="w-2 h-2 rounded-full bg-red-500" />
              {getTranslation(lang, 'stop')}
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                disabled={saveStatus === 'saving'}
                className={`h-10 px-4 rounded-full text-xs font-bold active:scale-95 transition-all border ${
                  saveStatus === 'saved'  ? 'bg-emerald-500/30 text-emerald-300 border-emerald-500/50' :
                  saveStatus === 'error'  ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                  saveStatus === 'saving' ? 'bg-slate-700/50 text-slate-500 border-slate-600/30' :
                  'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                }`}
              >
                {saveStatus === 'saving' ? 'သိမ်းနေသည်...' :
                 saveStatus === 'saved'  ? '✓ သိမ်းပြီး' :
                 saveStatus === 'error'  ? '✗ မအောင်မြင်' :
                 getTranslation(lang, 'save')}
              </button>
              <button 
                onClick={startSimulation}
                className="h-10 px-5 bg-primary text-white rounded-full text-xs font-bold flex items-center gap-2 shadow-lg shadow-primary/25 active:scale-95 transition-all"
              >
                <Play className="w-3.5 h-3.5" fill="currentColor" />
                {getTranslation(lang, 'run')}
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 mt-16 mb-16 overflow-y-auto">
        <div className="max-w-md mx-auto h-full relative">
           <div className="absolute top-4 right-4 z-20">
            <button 
              onClick={onAddClick}
              className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/20 active:scale-90 transition-all border border-primary/50"
            >
              <Plus className="w-6 h-6 text-white" />
            </button>
          </div>
          {children}
        </div>
      </main>

      <nav className="glass fixed bottom-0 w-full pb-safe pt-2 px-6 flex justify-around items-center border-t border-slate-700/50 z-30 h-16">
        <button 
          onClick={() => setIsFlowsOpen(true)}
          className={`flex flex-col items-center gap-1 ${isFlowsOpen ? 'text-primary' : 'text-slate-400'}`}
        >
          <div className="p-1.5 bg-primary/20 rounded-xl">
            <Layers className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-medium">{getTranslation(lang, 'flows')}</span>
        </button>
        
        <button 
          onClick={() => setIsCredsOpen(true)}
          className={`flex flex-col items-center gap-1 ${isCredsOpen ? 'text-primary' : 'text-slate-400'}`}
        >
          <div className="p-1.5 hover:bg-slate-800 rounded-xl transition-colors">
            <Settings className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-medium">{getTranslation(lang, 'configurations')}</span>
        </button>
        
        <button 
          onClick={() => setIsLogsOpen(true)}
          className={`flex flex-col items-center gap-1 ${isLogsOpen ? 'text-primary' : 'text-slate-400'}`}
        >
          <div className="p-1.5 hover:bg-slate-800 rounded-xl transition-colors">
            <History className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-medium">{getTranslation(lang, 'history')}</span>
        </button>
      </nav>

      <ExecutionLogsSheet isOpen={isLogsOpen} onClose={() => setIsLogsOpen(false)} />
      <CredentialsSheet isOpen={isCredsOpen} onClose={() => setIsCredsOpen(false)} />
      <FlowListSheet isOpen={isFlowsOpen} onClose={() => setIsFlowsOpen(false)} />
    </div>
  );
}
