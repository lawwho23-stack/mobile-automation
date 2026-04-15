import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Calendar, Table, Send, Bot, Zap } from 'lucide-react';
import type { NodeType } from '../store/flowStore';
import { getTranslation } from '../lib/i18n';

interface AddNodeSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNode: (type: NodeType, name: string) => void;
}

const AVAILABLE_NODES = [
  // Triggers
  { type: 'trigger_schedule', name: 'Schedule', icon: Calendar, color: 'bg-emerald-500', desc: 'Run at specific time' },
  { type: 'trigger_telegram', name: 'Telegram', icon: Send, color: 'bg-sky-500', desc: 'When message received' },
  { type: 'trigger_sheets', name: 'Sheets', icon: Table, color: 'bg-green-500', desc: 'When new row added' },
  
  // Actions
  { type: 'action_telegram', name: 'Telegram', icon: Send, color: 'bg-sky-500', desc: 'Send message' },
  { type: 'action_sheets', name: 'Sheets', icon: Table, color: 'bg-green-500', desc: 'Append row' },
  { type: 'action_agent', name: 'AI Agent', icon: Bot, color: 'bg-purple-500', desc: 'Process with AI' },
  { type: 'action_calendar', name: 'Calendar', icon: Calendar, color: 'bg-blue-500', desc: 'Create event' },
  { type: 'action_gmail', name: 'Email', icon: Mail, color: 'bg-red-500', desc: 'Send email' },
  { type: 'action_condition', name: 'Condition', icon: Zap, color: 'bg-orange-500', desc: 'Filter data' },
] as const;

export function AddNodeSheet({ isOpen, onClose, onSelectNode }: AddNodeSheetProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40"
          />
          
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 max-h-[85vh] h-[600px] bg-slate-900 border-t border-slate-700/50 rounded-t-3xl z-50 overflow-hidden flex flex-col shadow-2xl"
          >
            <div className="flex-none p-4 pb-2 text-center relative border-b border-slate-800">
              <div className="absolute left-1/2 -translate-x-1/2 top-2 w-12 h-1.5 bg-slate-700 rounded-full" />
              <h2 className="text-lg font-semibold text-slate-100 mt-2">Add Node</h2>
              <button 
                onClick={onClose}
                className="absolute right-4 top-4 p-2 bg-slate-800 rounded-full text-slate-400 active:scale-90"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 pb-safe">
              <div className="grid grid-cols-3 gap-3">
                {AVAILABLE_NODES.map((node) => (
                  <button
                    key={node.type}
                    onClick={() => onSelectNode(node.type as NodeType, node.name)}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-800/50 border border-slate-700/30 active:bg-slate-700 transition-colors"
                  >
                    <div className={`w-12 h-12 ${node.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <node.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-slate-200">{node.name}</span>
                    <span className="text-[10px] text-slate-500 text-center">{node.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
