import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, Play, Pause, ChevronRight, Layers } from 'lucide-react';
import { useFlowStore } from '../store/flowStore';
import { useEffect } from 'react';
import { getTranslation } from '../lib/i18n';

interface FlowListSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FlowListSheet({ isOpen, onClose }: FlowListSheetProps) {
  const { savedFlows, fetchFlows, deleteFlow, toggleFlowEnabled, loadFlow, clearFlow, activeFlowId } = useFlowStore();
  const lang = 'my';

  useEffect(() => {
    if (isOpen) fetchFlows();
  }, [isOpen, fetchFlows]);

  const handleCreateNew = () => {
    clearFlow();
    onClose();
  };

  const handleSelectFlow = (id: string) => {
    loadFlow(id);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[80]"
          />
          <motion.div 
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 h-[85vh] bg-slate-900 border-t border-slate-700/50 rounded-t-3xl z-[90] flex flex-col shadow-2xl"
          >
            <div className="flex-none p-4 pb-2 border-b border-slate-800 flex justify-between items-center bg-slate-900 rounded-t-3xl z-10">
              <button onClick={onClose} className="p-2 bg-slate-800 rounded-full text-slate-400 active:scale-95 transition-transform">
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-base font-semibold text-slate-100 text-center flex-1 flex items-center justify-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                {getTranslation(lang, 'flows')}
              </h2>
              <button 
                onClick={handleCreateNew}
                className="p-2 bg-primary/20 text-primary rounded-full active:scale-95 transition-transform"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-950/30">
              {savedFlows.length === 0 ? (
                <div className="text-center py-20 text-slate-600">
                  <Layers className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">အလိုအလျောက်လုပ်ဆောင်ချက်များ မရှိသေးပါ</p>
                  <button 
                    onClick={handleCreateNew}
                    className="mt-4 px-6 py-2 bg-primary/20 text-primary rounded-full text-sm font-medium"
                  >
                    တစ်ခုဖန်တီးမည်
                  </button>
                </div>
              ) : (
                savedFlows.map((flow) => (
                  <div 
                    key={flow.id} 
                    className={`bg-slate-900 border ${activeFlowId === flow.id ? 'border-primary/50 ring-1 ring-primary/30' : 'border-slate-800'} rounded-2xl p-4 shadow-sm active:scale-[0.98] transition-all overflow-hidden relative`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3 flex-1" onClick={() => handleSelectFlow(flow.id)}>
                        <div className={`w-10 h-10 rounded-xl ${flow.enabled ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-800 text-slate-500'} flex items-center justify-center`}>
                          <Layers className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-100 truncate max-w-[150px]">{flow.name}</div>
                          <div className="text-[10px] text-slate-500">{flow.nodes.length} nodes • {flow.enabled ? 'Running' : 'Paused'}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => toggleFlowEnabled(flow.id)}
                          className={`p-2 rounded-full ${flow.enabled ? 'text-emerald-500 bg-emerald-500/10' : 'text-slate-500 bg-slate-800'}`}
                        >
                          {flow.enabled ? <Pause className="w-4 h-4" fill="currentColor" /> : <Play className="w-4 h-4" fill="currentColor" />}
                        </button>
                        <button 
                          onClick={() => deleteFlow(flow.id)}
                          className="p-2 text-slate-600 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleSelectFlow(flow.id)}
                          className="p-2 text-slate-400"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex gap-1 overflow-x-hidden opacity-30 pointer-events-none">
                      {flow.nodes.map((n: any, i: number) => (
                        <div key={i} className="w-2 h-2 rounded-full bg-slate-700" title={n.name} />
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
