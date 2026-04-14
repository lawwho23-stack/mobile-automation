import { motion, AnimatePresence } from 'framer-motion';
import { X, Terminal, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useFlowStore } from '../store/flowStore';
import { useEffect } from 'react';
import { getTranslation } from '../lib/i18n';

interface ExecutionLogsSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExecutionLogsSheet({ isOpen, onClose }: ExecutionLogsSheetProps) {
  const { actualLogs, fetchLogs } = useFlowStore();
  const lang = 'my';

  useEffect(() => {
    if (isOpen) {
      fetchLogs();
      const interval = setInterval(fetchLogs, 3000); // Polling logs every 3s
      return () => clearInterval(interval);
    }
  }, [isOpen, fetchLogs]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[60]"
          />
          <motion.div 
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 h-[85vh] bg-slate-900 border-t border-slate-700/50 rounded-t-3xl z-[70] flex flex-col shadow-2xl"
          >
            <div className="flex-none p-4 pb-2 border-b border-slate-800 flex justify-between items-center bg-slate-900 rounded-t-3xl z-10">
              <button onClick={onClose} className="p-2 bg-slate-800 rounded-full text-slate-400 active:scale-95 transition-transform">
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-base font-semibold text-slate-100 text-center flex-1 flex items-center justify-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                {getTranslation(lang, 'logs')}
              </h2>
              <div className="w-9" />
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-safe bg-slate-950/50">
              {actualLogs.length === 0 ? (
                <div className="text-center text-slate-500 py-10 text-sm">
                  လုပ်ဆောင်ချက် မှတ်တမ်းများ မရှိသေးပါ
                </div>
              ) : (
                actualLogs.map((log: any) => (
                  <div key={log.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
                    <div className="bg-slate-800 px-3 py-2 flex justify-between items-center border-b border-slate-700/50">
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-slate-200">
                          {log.flowName || 'Auto Flow'}
                        </span>
                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {new Date(log.startTime).toLocaleTimeString()}
                        </span>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        log.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                        log.status === 'failed' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {log.status === 'completed' ? 'အောင်မြင်သည်' : 
                         log.status === 'failed' ? 'မအောင်မြင်ပါ' : 'လုပ်ဆောင်နေဆဲ'}
                      </span>
                    </div>
                    <div className="p-3 space-y-2">
                      {log.steps.map((step: any, idx: number) => (
                        <div key={idx} className="flex items-start gap-2">
                          {step.status === 'success' ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5" />
                          ) : (
                            <AlertCircle className="w-3.5 h-3.5 text-red-500 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <div className="text-xs text-slate-300 font-medium">{step.nodeName}</div>
                            {step.output && (
                              <pre className="mt-1 text-[10px] bg-black/30 p-2 rounded border border-slate-800 text-slate-400 overflow-x-auto">
                                {String(step.output)}
                              </pre>
                            )}
                            {step.error && (
                              <div className="mt-1 text-[10px] text-red-400 bg-red-500/10 p-2 rounded border border-red-500/20">
                                {step.error}
                              </div>
                            )}
                          </div>
                        </div>
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
