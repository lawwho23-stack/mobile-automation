import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Calendar, Table, Send, Bot } from 'lucide-react';
import type { NodeType } from '../store/flowStore';

interface AddNodeSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNode: (type: NodeType, name: string) => void;
}

const AVAILABLE_NODES = [
  { type: 'trigger_schedule', name: 'Schedule Trigger', icon: Calendar, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  { type: 'action_sheets', name: 'Google Sheets', icon: Table, color: 'text-green-400', bg: 'bg-green-400/10' },
  { type: 'action_calendar', name: 'Google Calendar', icon: Calendar, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { type: 'action_gmail', name: 'Gmail', icon: Mail, color: 'text-red-400', bg: 'bg-red-400/10' },
  { type: 'action_telegram', name: 'Telegram Bot', icon: Send, color: 'text-sky-400', bg: 'bg-sky-400/10' },
  { type: 'action_agent', name: 'AI Agent', icon: Bot, color: 'text-purple-400', bg: 'bg-purple-400/10' },
] as const;

export function AddNodeSheet({ isOpen, onClose, onSelectNode }: AddNodeSheetProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40"
          />
          
          {/* Bottom Sheet */}
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 max-h-[85vh] h-[500px] bg-slate-900 border-t border-slate-700/50 rounded-t-3xl z-50 overflow-hidden flex flex-col shadow-2xl"
          >
            <div className="flex-none p-4 pb-2 text-center relative border-b border-slate-800">
              <div className="absolute left-1/2 -translate-x-1/2 top-2 w-12 h-1.5 bg-slate-700 rounded-full" />
              <h2 className="text-lg font-semibold text-slate-100 mt-2">Add Automation Node</h2>
              <button 
                onClick={onClose}
                className="absolute right-4 top-4 p-2 bg-slate-800 rounded-full text-slate-400 active:scale-90"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-safe">
              {AVAILABLE_NODES.map((node) => (
                <button
                  key={node.type}
                  onClick={() => onSelectNode(node.type as NodeType, node.name)}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl bg-slate-800/50 border border-slate-700/30 active:bg-slate-700 transition-colors text-left"
                >
                  <div className={`p-3 rounded-xl ${node.bg}`}>
                    <node.icon className={`w-6 h-6 ${node.color}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-100">{node.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {node.type.startsWith('trigger') ? 'Start your flow' : 'Perform an action'}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
