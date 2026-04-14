import { Play, Settings, Menu, Plus } from 'lucide-react';

import { useFlowStore } from '../store/flowStore';

interface MobileLayoutProps {
  children: React.ReactNode;
  onAddClick: () => void;
}

export function MobileLayout({ children, onAddClick }: MobileLayoutProps) {
  const { isSimulating, startSimulation, stopSimulation } = useFlowStore();

  return (
    <div className="h-screen w-full bg-slate-900 text-slate-50 flex flex-col overflow-hidden">
      {/* Top Header - Glassmorphism */}
      <header className="z-10 px-4 py-3 glass sticky top-0 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-2">
          <Menu className="w-5 h-5 text-slate-300" />
          <h1 className="text-lg font-semibold tracking-tight">Automation Flow</h1>
        </div>
        <div>
          {isSimulating ? (
            <button 
              onClick={stopSimulation}
              className="bg-red-500/20 text-red-400 border border-red-500/50 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 active:scale-95 transition-all"
            >
              Stop
            </button>
          ) : (
            <button 
              onClick={startSimulation}
              className="bg-primary/20 text-blue-400 border border-primary/50 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <Play className="w-3.5 h-3.5" fill="currentColor" />
              Run
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-24 relative">
        <div className="max-w-md mx-auto w-full p-4 relative z-0">
          {children}
        </div>
      </main>

      {/* Floating Add Button */}
      <button 
        onClick={onAddClick}
        className="absolute bottom-20 right-6 z-20 w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 active:scale-90 transition-transform"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Bottom Navigation */}
      <nav className="glass fixed bottom-0 w-full pb-safe pt-2 px-6 flex justify-around items-center border-t border-slate-700/50 z-30 h-16">
        <button className="flex flex-col items-center gap-1 text-primary">
          <div className="p-1.5 bg-primary/20 rounded-xl">
            <Menu className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-medium">Flows</span>
        </button>
        
        <button className="flex flex-col items-center gap-1 text-slate-400">
          <div className="p-1.5 hover:bg-slate-800 rounded-xl transition-colors">
            <Settings className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-medium">Settings</span>
        </button>
      </nav>
    </div>
  );
}
